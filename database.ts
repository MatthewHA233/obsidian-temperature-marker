import * as fs from 'fs';
import * as path from 'path';
import type { SqlJsStatic, Database } from 'sql.js';
import type { App } from 'obsidian';

// ── 类型 ────────────────────────────────────────────────────────

export type Temperature = 'green' | 'orange' | 'red';

export interface HistoryEntry {
  file: string;
  line: number;
  color: Temperature;
  timestamp: number;
}

// ── 相似度工具 ───────────────────────────────────────────────────

/**
 * 计算两个字符串的相似度（0~1）。
 * 基于 Levenshtein 编辑距离：1 - dist / max(len_a, len_b)
 * 完全相同 → 1，完全不同 → 0。
 */
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const la = a.length, lb = b.length;
  // 超长行截断到 300 字符，避免 O(n²) 过慢
  const sa = a.slice(0, 300), sb = b.slice(0, 300);
  const row = Array.from({ length: sb.length + 1 }, (_, i) => i);
  for (let i = 1; i <= sa.length; i++) {
    let prev = i;
    for (let j = 1; j <= sb.length; j++) {
      const val = sa[i - 1] === sb[j - 1]
        ? row[j - 1]
        : 1 + Math.min(prev, row[j], row[j - 1]);
      row[j - 1] = prev;
      prev = val;
    }
    row[sb.length] = prev;
  }
  return 1 - row[sb.length] / Math.max(la, lb);
}

// ── Schema ──────────────────────────────────────────────────────

const MAIN_SCHEMA = `
  CREATE TABLE IF NOT EXISTS marks (
    file    TEXT    NOT NULL,
    line    INTEGER NOT NULL,
    color   TEXT    NOT NULL,
    content TEXT,
    PRIMARY KEY (file, line)
  );
  CREATE TABLE IF NOT EXISTS note_vocab (
    file    TEXT NOT NULL,
    term    TEXT NOT NULL,
    PRIMARY KEY (file, term)
  );
  CREATE INDEX IF NOT EXISTS idx_nv_file ON note_vocab(file);
  CREATE INDEX IF NOT EXISTS idx_nv_term ON note_vocab(term);
`;

const HISTORY_SCHEMA = `
  CREATE TABLE IF NOT EXISTS history (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    file      TEXT    NOT NULL,
    line      INTEGER NOT NULL,
    color     TEXT    NOT NULL,
    timestamp INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_h_file ON history(file);
  CREATE INDEX IF NOT EXISTS idx_h_ts   ON history(timestamp);
`;

// ── DatabaseManager ─────────────────────────────────────────────

export class DatabaseManager {
  private SQL!: SqlJsStatic;
  private mainDb!: Database;
  private historyDbs: Map<number, Database> = new Map();
  private pluginDir!: string;

  private mainDirty = false;
  private historyDirty = new Set<number>();
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  // ── 初始化 ──────────────────────────────────────────────────

  async init(app: App, pluginId: string) {
    const adapter = app.vault.adapter as any;
    const vaultPath: string = adapter.getBasePath();
    this.pluginDir = path.join(vaultPath, '.obsidian', 'plugins', pluginId);

    // 加载 WASM（Node.js 直接读文件，避免 fetch）
    const wasmBinary = fs.readFileSync(path.join(this.pluginDir, 'sql-wasm.wasm'));
    const initSqlJs: (config?: object) => Promise<SqlJsStatic> = require('sql.js');
    this.SQL = await initSqlJs({ wasmBinary });

    this.mainDb    = this._loadOrCreate('temp-main.db',    MAIN_SCHEMA);
    const year     = new Date().getFullYear();
    this._ensureHistoryDb(year);

    // 每 3 秒自动 flush 到磁盘
    this.flushTimer = setInterval(() => this._flush(), 3000);
  }

  // ── 内部工具 ────────────────────────────────────────────────

  private _loadOrCreate(filename: string, schema: string): Database {
    const filePath = path.join(this.pluginDir, filename);
    let db: Database;
    if (fs.existsSync(filePath)) {
      db = new this.SQL.Database(fs.readFileSync(filePath));
    } else {
      db = new this.SQL.Database();
    }
    db.run(schema);
    // 迁移：给旧 marks 表加 content 列（已有该列时 ALTER TABLE 会报错，忽略即可）
    if (filename === 'temp-main.db') {
      try { db.run('ALTER TABLE marks ADD COLUMN content TEXT'); } catch {}
    }
    return db;
  }

  private _ensureHistoryDb(year: number): Database {
    if (!this.historyDbs.has(year)) {
      this.historyDbs.set(year, this._loadOrCreate(`temp-history-${year}.db`, HISTORY_SCHEMA));
    }
    return this.historyDbs.get(year)!;
  }

  private _flush() {
    if (this.mainDirty) {
      fs.writeFileSync(
        path.join(this.pluginDir, 'temp-main.db'),
        Buffer.from(this.mainDb.export()),
      );
      this.mainDirty = false;
    }
    for (const year of this.historyDirty) {
      const db = this.historyDbs.get(year);
      if (db) {
        fs.writeFileSync(
          path.join(this.pluginDir, `temp-history-${year}.db`),
          Buffer.from(db.export()),
        );
      }
    }
    this.historyDirty.clear();
  }

  // ── 温度标记 ────────────────────────────────────────────────

  getFileMarks(file: string): Map<number, Temperature> {
    const result = new Map<number, Temperature>();
    const stmt = this.mainDb.prepare('SELECT line, color FROM marks WHERE file = ?');
    stmt.bind([file]);
    while (stmt.step()) {
      const row = stmt.getAsObject();
      result.set(row.line as number, row.color as Temperature);
    }
    stmt.free();
    return result;
  }

  setMark(file: string, line: number, color: Temperature | null, content?: string) {
    if (color === null) {
      this.mainDb.run('DELETE FROM marks WHERE file = ? AND line = ?', [file, line]);
    } else {
      this.mainDb.run(
        'INSERT OR REPLACE INTO marks (file, line, color, content) VALUES (?, ?, ?, ?)',
        [file, line, color, content ?? null],
      );
    }
    this.mainDirty = true;
  }

  /**
   * 为尚未存储 content 的 marks 补充行内容。
   * 在 file-open 时调用，确保旧标记也能参与后续的相似度重映射。
   */
  populateMarkContent(file: string, lines: string[]) {
    const stmt = this.mainDb.prepare(
      'SELECT line FROM marks WHERE file = ? AND (content IS NULL OR content = "")',
    );
    stmt.bind([file]);
    const toUpdate: number[] = [];
    while (stmt.step()) toUpdate.push((stmt.getAsObject().line as number));
    stmt.free();

    if (toUpdate.length === 0) return;
    for (const lineNum of toUpdate) {
      const text = (lines[lineNum - 1] ?? '').trim();
      this.mainDb.run(
        'UPDATE marks SET content = ? WHERE file = ? AND line = ?',
        [text, file, lineNum],
      );
    }
    this.mainDirty = true;
  }

  /**
   * 文件内容变更时，用相似度匹配把 marks 的行号重映射到新位置。
   * 返回是否有任何标记发生了移动。
   */
  remapFileMarks(file: string, lines: string[]): boolean {
    const stmt = this.mainDb.prepare(
      'SELECT line, color, content FROM marks WHERE file = ? AND content IS NOT NULL AND content != ""',
    );
    stmt.bind([file]);
    const marks: Array<{ line: number; color: Temperature; content: string }> = [];
    while (stmt.step()) {
      const r = stmt.getAsObject();
      marks.push({ line: r.line as number, color: r.color as Temperature, content: r.content as string });
    }
    stmt.free();
    if (marks.length === 0) return false;

    const WINDOW = 30;
    const THRESHOLD = 0.6;
    let anyChanged = false;

    for (const mark of marks) {
      const stored = mark.content.trim();
      // 先检查当前行号
      const curText = (lines[mark.line - 1] ?? '').trim();
      if (similarity(stored, curText) >= THRESHOLD) continue; // 还在原位

      // 在 ±WINDOW 行内找最佳匹配
      let bestLine = -1;
      let bestSim  = THRESHOLD;
      const lo = Math.max(0, mark.line - 1 - WINDOW);
      const hi = Math.min(lines.length - 1, mark.line - 1 + WINDOW);
      for (let i = lo; i <= hi; i++) {
        if (i === mark.line - 1) continue;
        const sim = similarity(stored, lines[i].trim());
        if (sim > bestSim) { bestSim = sim; bestLine = i + 1; }
      }

      if (bestLine !== -1) {
        this.mainDb.run('DELETE FROM marks WHERE file = ? AND line = ?', [file, mark.line]);
        this.mainDb.run(
          'INSERT OR REPLACE INTO marks (file, line, color, content) VALUES (?, ?, ?, ?)',
          [file, bestLine, mark.color, mark.content],
        );
        anyChanged = true;
      }
    }

    if (anyChanged) this.mainDirty = true;
    return anyChanged;
  }

  // ── 历史记录 ────────────────────────────────────────────────

  addHistory(file: string, line: number, color: Temperature, timestamp: number) {
    const year = new Date(timestamp).getFullYear();
    const db   = this._ensureHistoryDb(year);
    const ONE_MINUTE = 60_000;

    // 1 分钟内同行变更 → 原地替换
    const stmt = db.prepare(
      'SELECT id, timestamp FROM history WHERE file=? AND line=? ORDER BY timestamp DESC LIMIT 1',
    );
    stmt.bind([file, line]);
    let existing: { id: number; ts: number } | null = null;
    if (stmt.step()) {
      const row = stmt.getAsObject();
      existing = { id: row.id as number, ts: row.timestamp as number };
    }
    stmt.free();

    if (existing && timestamp - existing.ts < ONE_MINUTE) {
      db.run('UPDATE history SET color=?, timestamp=? WHERE id=?', [color, timestamp, existing.id]);
    } else {
      db.run(
        'INSERT INTO history (file, line, color, timestamp) VALUES (?, ?, ?, ?)',
        [file, line, color, timestamp],
      );
    }
    this.historyDirty.add(year);
  }

  getHistory(opts: { since?: number; until?: number; file?: string; limit?: number } = {}): HistoryEntry[] {
    const year = new Date().getFullYear();
    const db   = this._ensureHistoryDb(year);

    let sql = 'SELECT file, line, color, timestamp FROM history WHERE 1=1';
    const params: (string | number)[] = [];
    if (opts.since) { sql += ' AND timestamp >= ?'; params.push(opts.since); }
    if (opts.until) { sql += ' AND timestamp < ?';  params.push(opts.until); }
    if (opts.file)  { sql += ' AND file = ?';        params.push(opts.file);  }
    sql += ' ORDER BY timestamp DESC';
    if (opts.limit) { sql += ' LIMIT ?'; params.push(opts.limit); }

    const results: HistoryEntry[] = [];
    const stmt = db.prepare(sql);
    stmt.bind(params);
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        file:      row.file      as string,
        line:      row.line      as number,
        color:     row.color     as Temperature,
        timestamp: row.timestamp as number,
      });
    }
    stmt.free();
    return results;
  }

  // 遍历所有年份 DB，返回最早的 timestamp（毫秒），无记录返回 null
  getEarliestTimestamp(): number | null {
    const currentYear = new Date().getFullYear();
    // 扫描存在的年份文件（从 2020 到今年）
    const years: number[] = [];
    for (let y = 2020; y <= currentYear; y++) {
      if (fs.existsSync(path.join(this.pluginDir, `temp-history-${y}.db`))) {
        years.push(y);
      }
    }
    let earliest: number | null = null;
    for (const year of years) {
      const db   = this._ensureHistoryDb(year);
      const stmt = db.prepare('SELECT MIN(timestamp) AS t FROM history');
      stmt.step();
      const row = stmt.getAsObject();
      stmt.free();
      if (row.t != null) {
        const t = row.t as number;
        if (earliest === null || t < earliest) earliest = t;
      }
    }
    return earliest;
  }

  deleteHistoryEntry(file: string, line: number, timestamp: number) {
    const year = new Date(timestamp).getFullYear();
    const db   = this._ensureHistoryDb(year);
    db.run('DELETE FROM history WHERE file=? AND line=? AND timestamp=?', [file, line, timestamp]);
    this.historyDirty.add(year);
  }

  // 获取每日标记数量（全部数据，用于热力图）
  getDailyStats(): Array<{ date: string; green: number; orange: number; red: number }> {
    const currentYear = new Date().getFullYear();
    const map = new Map<string, { green: number; orange: number; red: number }>();

    for (let y = 2020; y <= currentYear; y++) {
      if (!fs.existsSync(path.join(this.pluginDir, `temp-history-${y}.db`))) continue;
      const db   = this._ensureHistoryDb(y);
      const stmt = db.prepare(`
        SELECT
          date(timestamp / 1000, 'unixepoch', 'localtime') AS date,
          color,
          COUNT(*) AS cnt
        FROM history
        GROUP BY date, color
        ORDER BY date
      `);
      while (stmt.step()) {
        const row = stmt.getAsObject();
        const d   = row.date  as string;
        const col = row.color as Temperature;
        const cnt = row.cnt   as number;
        if (!map.has(d)) map.set(d, { green: 0, orange: 0, red: 0 });
        map.get(d)![col] += cnt;
      }
      stmt.free();
    }

    return [...map.entries()].map(([date, v]) => ({ date, ...v }));
  }

  // 每日"当前状态"分布（用于热力图状态模式）
  // 对每天历史里出现过的 distinct (file, line) 对，查其现在的标记颜色，统计分布
  getDailyCurrentStats(): Array<{ date: string; green: number; orange: number; red: number }> {
    const currentYear = new Date().getFullYear();

    // Step1: 收集所有年份历史中，每天触碰过的 distinct (file, line) 对
    const dayMap = new Map<string, Set<string>>(); // date -> Set<"file\0line">
    for (let y = 2020; y <= currentYear; y++) {
      if (!fs.existsSync(path.join(this.pluginDir, `temp-history-${y}.db`))) continue;
      const db   = this._ensureHistoryDb(y);
      const stmt = db.prepare(`
        SELECT DISTINCT
          date(timestamp / 1000, 'unixepoch', 'localtime') AS date,
          file, line
        FROM history
      `);
      while (stmt.step()) {
        const row = stmt.getAsObject();
        const d   = row.date as string;
        const key = `${row.file}\0${row.line}`;
        if (!dayMap.has(d)) dayMap.set(d, new Set());
        dayMap.get(d)!.add(key);
      }
      stmt.free();
    }

    // Step2: 读取所有当前标记
    const markMap = new Map<string, Temperature>(); // "file\0line" -> color
    const stmt2 = this.mainDb.prepare('SELECT file, line, color FROM marks');
    while (stmt2.step()) {
      const row = stmt2.getAsObject();
      markMap.set(`${row.file}\0${row.line}`, row.color as Temperature);
    }
    stmt2.free();

    // Step3: 按天统计当前状态分布（忽略已清除的行）
    return [...dayMap.entries()]
      .map(([date, keys]) => {
        const counts = { green: 0, orange: 0, red: 0 };
        for (const key of keys) {
          const cur = markMap.get(key);
          if (cur === 'green' || cur === 'orange' || cur === 'red') counts[cur]++;
        }
        return { date, ...counts };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // 返回所有当前标记，供历史面板做"状态变化"比对
  getAllCurrentMarks(): Map<string, Temperature> {
    const result = new Map<string, Temperature>(); // "file\0line" -> color
    const stmt = this.mainDb.prepare('SELECT file, line, color FROM marks');
    while (stmt.step()) {
      const row = stmt.getAsObject();
      result.set(`${row.file}\0${row.line}`, row.color as Temperature);
    }
    stmt.free();
    return result;
  }

  // ── 词条关联 ────────────────────────────────────────────────

  getNoteVocab(file: string): string[] {
    const stmt = this.mainDb.prepare('SELECT term FROM note_vocab WHERE file = ? ORDER BY term');
    stmt.bind([file]);
    const terms: string[] = [];
    while (stmt.step()) terms.push(stmt.getAsObject().term as string);
    stmt.free();
    return terms;
  }

  addNoteVocab(file: string, term: string) {
    this.mainDb.run('INSERT OR IGNORE INTO note_vocab (file, term) VALUES (?, ?)', [file, term]);
    this.mainDirty = true;
  }

  removeNoteVocab(file: string, term: string) {
    this.mainDb.run('DELETE FROM note_vocab WHERE file=? AND term=?', [file, term]);
    this.mainDirty = true;
  }

  getAllFilesForTerm(term: string): string[] {
    const stmt = this.mainDb.prepare('SELECT file FROM note_vocab WHERE term = ?');
    stmt.bind([term]);
    const files: string[] = [];
    while (stmt.step()) files.push(stmt.getAsObject().file as string);
    stmt.free();
    return files;
  }

  // ── 生命周期 ────────────────────────────────────────────────

  flushAndClose() {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this._flush();
    this.mainDb.close();
    for (const db of this.historyDbs.values()) db.close();
  }
}
