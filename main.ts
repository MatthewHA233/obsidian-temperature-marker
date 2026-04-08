import { Plugin, TFile, ItemView, WorkspaceLeaf, MarkdownView, Modal, App, Menu, Editor, Notice, MarkdownRenderer, Component } from 'obsidian';
import { DatabaseManager, Temperature as Temp } from './database';
import { t } from './i18n';

const VIEW_TYPE_HISTORY    = 'temperature-history';
const VIEW_TYPE_VOCAB      = 'vocab-queue';
const VIEW_TYPE_HISTORY_FULL = 'temperature-history-full';
import {
  EditorView,
  ViewPlugin,
  ViewUpdate,
  DecorationSet,
  Decoration,
  WidgetType,
} from '@codemirror/view';
import {
  StateField,
  StateEffect,
  Transaction,
  Range,
} from '@codemirror/state';

// ─────────────────────────────────────────────
// 词条索引（驱动双向链接装饰）
// ─────────────────────────────────────────────

class VocabLinkIndex {
  readonly termToPath: Map<string, string> = new Map();
  private _regex: RegExp | null = null;

  rebuild(app: App) {
    this.termToPath.clear();
    for (const file of app.vault.getFiles()) {
      // 只索引分类子目录下的词条，排除根目录的索引文件
      if (file.path.match(/^_词汇表\/.+\/.+\.md$/)) {
        this.termToPath.set(file.basename, file.path);
      }
    }
    this._buildRegex();
  }

  addTerm(basename: string, path: string) {
    // 只收录二级目录下的文件
    if (!path.match(/^_词汇表\/.+\/.+\.md$/)) return;
    this.termToPath.set(basename, path);
    this._buildRegex();
  }

  removeTerm(basename: string) {
    this.termToPath.delete(basename);
    this._buildRegex();
  }

  getRegex(): RegExp | null {
    if (!this._regex) return null;
    this._regex.lastIndex = 0;
    return this._regex;
  }

  private _buildRegex() {
    if (this.termToPath.size === 0) { this._regex = null; return; }
    const terms = [...this.termToPath.keys()].sort((a, b) => b.length - a.length);
    const patterns = terms.map(t => {
      const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // 英文单词加 \b 防止误匹配子串；中文词条两侧不是 \w，\b 不适用
      const left  = /^\w/.test(t) ? '\\b' : '';
      const right = /\w$/.test(t) ? '\\b' : '';
      return `${left}${esc}${right}`;
    });
    this._regex = new RegExp(`(${patterns.join('|')})`, 'g');
  }
}

// 模块级单例，用于 hover/click 时解析 term → filePath
const vocabLinkIndex = new VocabLinkIndex();

// ─── 当前笔记关联的词条（term → filePath），驱动高亮装饰 ───
// 只包含当前文件在 db.noteVocab 里登记的词条
const setNoteVocabTerms = StateEffect.define<Map<string, string>>();

const noteVocabField = StateField.define<Map<string, string>>({
  create() { return new Map(); },
  update(prev, tr) {
    for (const e of tr.effects) {
      if (e.is(setNoteVocabTerms)) return new Map(e.value);
    }
    return prev;
  },
});

// ─────────────────────────────────────────────
// 类型（Temperature / HistoryEntry 从 database.ts 引入）
// ─────────────────────────────────────────────

type Temperature = Temp;

// ─────────────────────────────────────────────
// 词条收集清单
// ─────────────────────────────────────────────

interface VocabItem {
  word: string;     // 选中的词语或短语
  file: string;     // 来源文件路径
  line: number;     // 行号
  context: string;  // 所在行完整内容
}

// ─────────────────────────────────────────────
// 全局拖拽状态
// ─────────────────────────────────────────────

const drag = {
  active: false,
  color: null as Temperature | null,
};

document.addEventListener('mouseup', () => {
  if (drag.active) {
    drag.active = false;
    drag.color = null;
    document.body.classList.remove('temp-dragging');
  }
});

// ─────────────────────────────────────────────
// StateEffect
// ─────────────────────────────────────────────

// 用户操作：设置某行颜色
const setLineTemp = StateEffect.define<{ line: number; temp: Temperature | null }>();

// 系统操作：打开新文件时，清空并恢复保存的状态
const restoreTemps = StateEffect.define<Map<number, Temperature>>();

// ─────────────────────────────────────────────
// StateField
// ─────────────────────────────────────────────

const tempField = StateField.define<Map<number, Temperature>>({
  create() {
    return new Map();
  },

  update(prev: Map<number, Temperature>, tr: Transaction) {
    const hasSet     = tr.effects.some(e => e.is(setLineTemp));
    const hasRestore = tr.effects.some(e => e.is(restoreTemps));

    if (!hasSet && !hasRestore) return prev;

    // 恢复操作：直接用保存的 Map 替换（整体重置）
    if (hasRestore) {
      for (const e of tr.effects) {
        if (e.is(restoreTemps)) return new Map(e.value);
      }
    }

    // 用户操作：逐条更新
    const next = new Map(prev);
    for (const e of tr.effects) {
      if (e.is(setLineTemp)) {
        const { line, temp } = e.value;
        temp === null ? next.delete(line) : next.set(line, temp);
      }
    }
    return next;
  },
});

// ─────────────────────────────────────────────
// WidgetType：右侧三个圆点
// ─────────────────────────────────────────────

class DotsWidget extends WidgetType {
  constructor(
    private lineNumber: number,
    private current: Temperature | null,
    private view: EditorView,
  ) {
    super();
  }

  eq(other: DotsWidget) {
    return other.lineNumber === this.lineNumber && other.current === this.current;
  }

  toDOM(): HTMLElement {
    const wrap = document.createElement('span');
    wrap.className = 'temp-dots-container';

    // 拖拽经过时：只 dispatch effect，保存由 ViewPlugin.update 统一处理
    wrap.addEventListener('mouseenter', () => {
      if (!drag.active) return;
      if (drag.color === this.current) return;
      this.view.dispatch({
        effects: setLineTemp.of({ line: this.lineNumber, temp: drag.color }),
      });
    });

    const colors: Temperature[] = ['green', 'orange', 'red'];

    for (const color of colors) {
      const dot = document.createElement('span');
      dot.className = `temp-dot temp-dot-${color}`;
      if (this.current === color) dot.classList.add('temp-dot-active');

      dot.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const next: Temperature | null = this.current === color ? null : color;

        drag.active = true;
        drag.color = next;
        document.body.classList.add('temp-dragging');

        // 只 dispatch effect，保存由 ViewPlugin.update 统一处理
        this.view.dispatch({
          effects: setLineTemp.of({ line: this.lineNumber, temp: next }),
        });
      });

      wrap.appendChild(dot);
    }

    return wrap;
  }

  ignoreEvent() { return false; }
}

// ─────────────────────────────────────────────
// 行背景色 StateField
// 独立于 ViewPlugin，直接通过 provide 挂入 EditorView.decorations
// 这样行背景色和圆点 widget 完全分离，避免混用 Decoration.line + widget 的兼容问题
// ─────────────────────────────────────────────

const tempLineBgField = StateField.define<DecorationSet>({
  create() { return Decoration.none; },

  update(decs, tr) {
    const hasTemps = tr.effects.some(e => e.is(restoreTemps) || e.is(setLineTemp));
    if (!hasTemps) return decs.map(tr.changes);

    // 从最新的 tempField 重建所有行背景色装饰
    const temps = tr.state.field(tempField);
    const all: Range<Decoration>[] = [];
    for (const [lineNum, color] of temps) {
      if (lineNum < 1 || lineNum > tr.state.doc.lines) continue;
      const line = tr.state.doc.line(lineNum);
      all.push(Decoration.line({ class: `temp-bg-${color}` }).range(line.from));
    }
    // 按位置排序（迭代 Map 不保证顺序）
    all.sort((a, b) => a.from - b.from);
    return all.length ? Decoration.set(all) : Decoration.none;
  },

  provide: f => EditorView.decorations.from(f),
});

// ─────────────────────────────────────────────
// buildDecorations（只负责圆点 widget，行背景色已由 tempLineBgField 处理）
// ─────────────────────────────────────────────

function buildDecorations(view: EditorView): DecorationSet {
  const temps = view.state.field(tempField);
  const all: Range<Decoration>[] = [];

  for (const { from, to } of view.visibleRanges) {
    let pos = from;
    while (pos <= to) {
      const line = view.state.doc.lineAt(pos);
      const temp = temps.get(line.number) ?? null;
      all.push(
        Decoration.widget({ widget: new DotsWidget(line.number, temp, view), side: 1 })
          .range(line.to),
      );
      pos = line.to + 1;
    }
  }

  // 按行顺序迭代，结果已有序，无需额外排序
  return all.length ? Decoration.set(all) : Decoration.none;
}

// ─────────────────────────────────────────────
// 词条链接装饰（给代码块内外的已知词条加下划线）
// ─────────────────────────────────────────────

function buildVocabDecorations(view: EditorView): DecorationSet {
  const termMap = view.state.field(noteVocabField);
  if (termMap.size === 0) return Decoration.none;

  // 用当前笔记的词条列表动态构建正则，不依赖全局索引
  const terms = [...termMap.keys()].sort((a, b) => b.length - a.length);
  const patterns = terms.map(t => {
    const esc  = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const left  = /^\w/.test(t) ? '\\b' : '';
    const right = /\w$/.test(t) ? '\\b' : '';
    return `${left}${esc}${right}`;
  });
  const regex = new RegExp(`(${patterns.join('|')})`, 'g');

  const marks: Range<Decoration>[] = [];

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to);
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const term = match[1];
      const start = from + match.index;
      const end   = start + term.length;
      marks.push(
        Decoration.mark({
          class: 'vocab-link',
          attributes: { 'data-vocab-term': term },
        }).range(start, end),
      );
    }
  }

  marks.sort((a, b) => a.from - b.from);
  const deduped: Range<Decoration>[] = [];
  let lastEnd = -1;
  for (const m of marks) {
    if (m.from >= lastEnd) {
      deduped.push(m);
      lastEnd = m.to;
    }
  }

  return Decoration.set(deduped, true);
}

// ─────────────────────────────────────────────
// Plugin
// ─────────────────────────────────────────────

export default class TemperatureMarkerPlugin extends Plugin {
  public sqlDb!: DatabaseManager;
  private saveTimer: ReturnType<typeof setTimeout> | null = null; // 保留供 scheduleSave 兼容调用

  // 词条收集模式
  public highlightMode = false;
  public vocabQueue: VocabItem[] = [];
  private statusBarEl: HTMLElement | null = null;

  // Obsidian hover preview 需要 hoverParent 有此属性
  hoverPopover: any = null;

  // 词条悬浮预览 tooltip
  private _tooltipEl: HTMLElement | null = null;
  private _tooltipHideTimer: ReturnType<typeof setTimeout> | null = null;

  async onload() {
    // 初始化 SQLite
    this.sqlDb = new DatabaseManager();
    await this.sqlDb.init(this.app, this.manifest.id);

    // 初始化词条索引
    vocabLinkIndex.rebuild(this.app);

    // 监听词汇表文件变化，实时更新索引并刷新当前文件高亮
    this.registerEvent(
      this.app.vault.on('create', (file) => {
        if (file instanceof TFile && file.path.match(/^_词汇表\/.+\/.+\.md$/)) {
          vocabLinkIndex.addTerm(file.basename, file.path);
          const active = this.app.workspace.getActiveFile();
          if (active) this._dispatchNoteVocabTerms(active.path);
        }
      }),
    );
    this.registerEvent(
      this.app.vault.on('delete', (file) => {
        if (file instanceof TFile && file.path.match(/^_词汇表\/.+\/.+\.md$/)) {
          vocabLinkIndex.removeTerm(file.basename);
          const active = this.app.workspace.getActiveFile();
          if (active) this._dispatchNoteVocabTerms(active.path);
        }
      }),
    );

    // 注册全页历史视图
    this.registerView(VIEW_TYPE_HISTORY_FULL, (leaf) => new FullHistoryView(leaf, this));

    // 注册右侧历史面板
    this.registerView(VIEW_TYPE_HISTORY, (leaf) => new TempHistoryView(leaf, this));

    // 注册右侧词条收集面板
    this.registerView(VIEW_TYPE_VOCAB, (leaf) => new VocabQueueView(leaf, this));

    // 左侧工具栏：打开全页学习历史
    this.addRibbonIcon('list-checks', t('RIBBON_HISTORY'), () => this.activateFullHistoryView());

    // 左侧工具栏：进入/退出词条收集模式
    this.addRibbonIcon('book-plus', t('RIBBON_VOCAB'), () => this.toggleHighlightMode());

    // 高亮模式下按 A 键加入清单
    this.registerDomEvent(document, 'keydown', (e: KeyboardEvent) => {
      if (!this.highlightMode) return;
      if (e.key !== 'q' && e.key !== 'Q') return;
      if (!e.ctrlKey || e.metaKey || e.altKey) return;

      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!activeView) return;
      const selection = activeView.editor.getSelection().trim();
      if (!selection) return;

      e.preventDefault();
      this.addToVocabQueue(selection, activeView.editor);
    });

    // 状态栏（词条收集模式下显示计数）
    this.statusBarEl = this.addStatusBarItem();
    this.statusBarEl.style.display = 'none';

    // 注册 CM6 扩展
    this.registerEditorExtension([tempField, tempLineBgField, noteVocabField, this.buildViewPlugin(), this.buildVocabViewPlugin()]);

    // 编辑器右键菜单：高亮模式下显示"加入词条清单"
    this.registerEvent(
      this.app.workspace.on('editor-menu', (menu: Menu, editor: Editor) => {
        if (!this.highlightMode) return;
        const selection = editor.getSelection().trim();
        if (!selection) return;

        menu.addItem((item) => {
          item
            .setTitle(t('MENU_ADD_VOCAB', { word: selection }))
            .setIcon('book-plus')
            .onClick(() => this.addToVocabQueue(selection, editor));
        });
      }),
    );

    // 切换文件时恢复标记 + 词条 + 刷新面板
    // 用 setTimeout 而非 requestAnimationFrame：关闭再重开时编辑器需要更多初始化时间
    this.registerEvent(
      this.app.workspace.on('file-open', (file: TFile | null) => {
        if (!file) return;
        setTimeout(() => {
          this.restoreMarks(file.path);
          this._dispatchNoteVocabTerms(file.path);
          this.refreshVocabPanel();
        }, 100);
      }),
    );

    // 启动时恢复当前文件
    this.app.workspace.onLayoutReady(() => {
      const file = this.app.workspace.getActiveFile();
      if (file) requestAnimationFrame(() => {
        this.restoreMarks(file.path);
        this._dispatchNoteVocabTerms(file.path);
      });
    });

    console.log('Temperature Marker: loaded');
  }

  async onunload() {
    this.sqlDb?.flushAndClose();
    console.log('Temperature Marker: unloaded');
  }

  // ── 恢复某文件的标记到编辑器 ──
  restoreMarks(filePath: string, attempt = 0) {
    const view = this.getEditorView(filePath);
    if (!view) {
      if (attempt < 5) setTimeout(() => this.restoreMarks(filePath, attempt + 1), 200);
      else console.warn('[TempMarker] restoreMarks: EditorView not found', filePath);
      return;
    }
    const map = this.sqlDb.getFileMarks(filePath);
    view.dispatch({ effects: restoreTemps.of(map) });
    // 编辑器可能在首次 dispatch 后继续初始化并重置状态，300ms 后补发一次保险
    if (attempt === 0) setTimeout(() => this.restoreMarks(filePath, 1), 300);
  }

  // ── 获取当前活跃的 CM6 EditorView ──
  private getEditorView(filePath?: string): EditorView | null {
    // 按文件路径找对应的 markdown leaf，避免焦点在侧边栏时拿错 leaf
    const leaves = this.app.workspace.getLeavesOfType('markdown');
    const target = filePath
      ? leaves.find(l => (l.view as MarkdownView).file?.path === filePath)
      : leaves.find(l => (l.view as MarkdownView).file?.path === this.app.workspace.getActiveFile()?.path)
        ?? leaves[0];
    if (!target) return null;
    const v = target.view as any;
    return v?.editor?.cm ?? v?.editMode?.editor?.cm ?? v?.sourceMode?.cmEditor?.cm ?? null;
  }

  // ── 保存一次标记变更 ──
  saveMark(filePath: string, line: number, temp: Temperature | null) {
    this.sqlDb.setMark(filePath, line, temp);
    if (temp !== null) this.sqlDb.addHistory(filePath, line, temp, Date.now());
    this.refreshHistoryPanel();
  }

  // ── 删除历史条目并清除对应标记 ──
  deleteHistoryEntry(file: string, line: number, timestamp: number) {
    this.sqlDb.deleteHistoryEntry(file, line, timestamp);
    this.sqlDb.setMark(file, line, null);
    this.restoreMarks(file);
    this.refreshHistoryPanel();
  }

  // ── 切换词条收集模式 ──
  toggleHighlightMode() {
    if (this.highlightMode) {
      // 退出模式：如果有词条则生成 prompt 并复制
      if (this.vocabQueue.length > 0) {
        this.copyVocabPrompt();
      } else {
        new Notice(t('NOTICE_VOCAB_EMPTY_EXIT'));
      }
      this.exitHighlightMode();
    } else {
      this.highlightMode = true;
      document.body.classList.add('vocab-highlight-mode');
      this.updateStatusBar();
      this.activateVocabView();
      new Notice(t('NOTICE_VOCAB_MODE_ON'));
    }
  }

  private exitHighlightMode() {
    this.highlightMode = false;
    this.vocabQueue = [];
    document.body.classList.remove('vocab-highlight-mode');
    if (this.statusBarEl) this.statusBarEl.style.display = 'none';
    this.refreshVocabPanel();
  }

  // ── 将选中词语加入队列 ──
  addToVocabQueue(word: string, editor: Editor) {
    const cursor = editor.getCursor();
    const lineContent = editor.getLine(cursor.line);
    const file = this.app.workspace.getActiveFile();

    // 去重
    if (this.vocabQueue.some(v => v.word === word)) {
      new Notice(t('NOTICE_WORD_DUPLICATE', { word }));
      return;
    }

    this.vocabQueue.push({
      word,
      file: file?.path ?? t('UNKNOWN_FILE'),
      line: cursor.line + 1,
      context: lineContent.trim(),
    });

    this.updateStatusBar();
    this.refreshVocabPanel();
    new Notice(t('NOTICE_WORD_ADDED', { word, count: this.vocabQueue.length }));
  }

  // ── 更新状态栏显示 ──
  private updateStatusBar() {
    if (!this.statusBarEl) return;
    this.statusBarEl.style.display = '';
    this.statusBarEl.empty();

    const text = this.statusBarEl.createEl('span', {
      text: t('STATUS_BAR_COUNT', { count: this.vocabQueue.length }),
      cls: 'vocab-status-text',
    });

    const btn = this.statusBarEl.createEl('span', {
      text: t('STATUS_BAR_BTN'),
      cls: 'vocab-status-btn',
    });
    btn.addEventListener('click', () => this.toggleHighlightMode());
  }

  // ── 生成 prompt 并复制到剪贴板，同时把词条写入 SQLite ──
  private copyVocabPrompt() {
    for (const item of this.vocabQueue) {
      this.sqlDb.addNoteVocab(item.file, item.word);
    }

    const items = this.vocabQueue.map((v, i) =>
      t('VOCAB_PROMPT_ITEM', { index: i + 1, word: v.word, file: v.file, line: v.line, context: v.context })
    ).join('\n\n');

    const prompt = t('VOCAB_PROMPT_INTRO', { items });

    navigator.clipboard.writeText(prompt).then(() => {
      new Notice(t('NOTICE_PROMPT_COPIED', { count: this.vocabQueue.length }));
    }).catch(() => {
      new Notice(t('NOTICE_COPY_FAILED'));
      console.log(prompt);
    });
  }

  // ── scheduleSave：SQLite 版本直接由 DatabaseManager 定时 flush，此方法仅供面板调用 ──
  scheduleSave() { /* no-op：SQLite 自动 flush */ }

  // ── 打开全页历史视图 ──
  async activateFullHistoryView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_HISTORY_FULL);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getLeaf('tab');
    await leaf.setViewState({ type: VIEW_TYPE_HISTORY_FULL, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  // ── 打开词条收集面板 ──
  async activateVocabView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_VOCAB);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE_VOCAB, active: true });
      this.app.workspace.revealLeaf(leaf);
    }
  }

  // ── 刷新词条面板 ──
  refreshVocabPanel() {
    this.app.workspace.getLeavesOfType(VIEW_TYPE_VOCAB).forEach((leaf) => {
      (leaf.view as VocabQueueView).render();
    });
  }

  // ── 打开历史面板 ──
  async activateHistoryView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_HISTORY);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE_HISTORY, active: true });
      this.app.workspace.revealLeaf(leaf);
    }
  }

  // ── 刷新历史面板（如果已打开）──
  refreshHistoryPanel() {
    this.app.workspace.getLeavesOfType(VIEW_TYPE_HISTORY).forEach((leaf) => {
      (leaf.view as TempHistoryView).render();
    });
    this.app.workspace.getLeavesOfType(VIEW_TYPE_HISTORY_FULL).forEach((leaf) => {
      (leaf.view as FullHistoryView).render();
    });
  }

  // ── 创建 ViewPlugin（闭包捕获 this.saveMark）──
  private buildViewPlugin(): ReturnType<typeof ViewPlugin.fromClass> {
    const plugin = this;

    return ViewPlugin.fromClass(
      class {
        decorations: DecorationSet;

        constructor(view: EditorView) {
          this.decorations = buildDecorations(view);
        }

        update(update: ViewUpdate) {
          const tempChanged =
            update.state.field(tempField) !== update.startState.field(tempField);

          // 仅对用户操作（非 restoreTemps）触发保存
          for (const tr of update.transactions) {
            const isRestore = tr.effects.some(e => e.is(restoreTemps));
            if (isRestore) continue;

            const file = plugin.app.workspace.getActiveFile();
            if (!file) continue;

            for (const e of tr.effects) {
              if (e.is(setLineTemp)) {
                plugin.saveMark(file.path, e.value.line, e.value.temp);
              }
            }
          }

          if (update.docChanged || update.viewportChanged || tempChanged) {
            this.decorations = buildDecorations(update.view);
          }
        }
      },
      { decorations: v => v.decorations },
    );
  }

  // ── 词条链接 ViewPlugin（下划线 + hover 预览 + 点击跳转）──
  private buildVocabViewPlugin(): ReturnType<typeof ViewPlugin.fromClass> {
    const plugin = this;

    return ViewPlugin.fromClass(
      class {
        decorations: DecorationSet;

        constructor(view: EditorView) {
          this.decorations = buildVocabDecorations(view);
        }

        update(update: ViewUpdate) {
          const needsRebuild =
            update.docChanged
            || update.viewportChanged
            || update.transactions.some(t => t.effects.some(e => e.is(setNoteVocabTerms)));
          if (needsRebuild) {
            this.decorations = buildVocabDecorations(update.view);
          }
        }
      },
      {
        decorations: v => v.decorations,
        eventHandlers: {
          // 悬停：触发 Obsidian 原生 hover 预览
          // 悬停：显示自定义 Markdown 预览 tooltip
          mouseover(event: MouseEvent) {
            const target = event.target as HTMLElement;
            const el = target.classList.contains('vocab-link')
              ? target
              : (target.closest('.vocab-link') as HTMLElement | null);
            if (!el) return;

            const term = el.getAttribute('data-vocab-term');
            if (!term) return;

            plugin.showVocabTooltip(el, term);
          },

          mouseout(event: MouseEvent) {
            const target = event.target as HTMLElement;
            if (target.classList.contains('vocab-link') || target.closest('.vocab-link')) {
              plugin['_scheduleHideTooltip']();
            }
          },

          // 点击：跳转到词条笔记
          click(event: MouseEvent) {
            const target = event.target as HTMLElement;
            const el = target.classList.contains('vocab-link')
              ? target
              : (target.closest('.vocab-link') as HTMLElement | null);
            if (!el) return;

            const term = el.getAttribute('data-vocab-term');
            if (!term) return;

            const filePath = vocabLinkIndex.termToPath.get(term);
            if (!filePath) return;

            const file = plugin.app.vault.getAbstractFileByPath(filePath);
            if (!(file instanceof TFile)) return;

            plugin.app.workspace.getLeaf(false).openFile(file);
          },
        },
      },
    );
  }

  // ── 显示词条悬浮预览 ──
  async showVocabTooltip(anchor: HTMLElement, term: string) {
    if (this._tooltipHideTimer) {
      clearTimeout(this._tooltipHideTimer);
      this._tooltipHideTimer = null;
    }
    this.hideVocabTooltip();

    const filePath = vocabLinkIndex.termToPath.get(term);
    if (!filePath) return;
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) return;

    const content = await this.app.vault.read(file);
    // 只取前 20 行，避免内容过多
    const preview = content.split('\n').slice(0, 20).join('\n');

    const rect = anchor.getBoundingClientRect();
    const tooltip = document.createElement('div');
    tooltip.className = 'vocab-tooltip';
    // 定位到词条下方，水平对齐
    tooltip.style.left = `${Math.min(rect.left, window.innerWidth - 320)}px`;
    tooltip.style.top  = `${rect.bottom + 6}px`;

    const comp = new Component();
    comp.load();
    await MarkdownRenderer.render(this.app, preview, tooltip, filePath, comp);

    document.body.appendChild(tooltip);
    this._tooltipEl = tooltip;

    // 鼠标移入 tooltip 本身时保持显示
    tooltip.addEventListener('mouseenter', () => {
      if (this._tooltipHideTimer) clearTimeout(this._tooltipHideTimer);
    });
    tooltip.addEventListener('mouseleave', () => this._scheduleHideTooltip());
  }

  hideVocabTooltip() {
    if (this._tooltipEl) {
      this._tooltipEl.remove();
      this._tooltipEl = null;
    }
  }

  private _scheduleHideTooltip() {
    this._tooltipHideTimer = setTimeout(() => this.hideVocabTooltip(), 150);
  }

  // ── 把某笔记的词条列表发到编辑器 state，触发重新装饰 ──
  _dispatchNoteVocabTerms(filePath: string) {
    const view = this.getEditorView(filePath);
    if (!view) return;
    const terms = this.sqlDb.getNoteVocab(filePath);
    const termMap = new Map<string, string>();
    for (const term of terms) {
      const p = vocabLinkIndex.termToPath.get(term);
      if (p) termMap.set(term, p);
    }
    view.dispatch({ effects: setNoteVocabTerms.of(termMap) });
  }
}

// ─────────────────────────────────────────────
// 日期工具
// ─────────────────────────────────────────────

function localDateStr(d: Date): string {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dy}`;
}

function parseDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// ─────────────────────────────────────────────
// 历史条目悬浮预览
// ─────────────────────────────────────────────

class HoverPreview {
  private el: HTMLDivElement;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private app: App;

  constructor(app: App) {
    this.app = app;
    this.el  = document.createElement('div');
    this.el.className = 'temp-hover-preview';
    document.body.appendChild(this.el);
    // 鼠标移入预览窗口时取消隐藏计时
    this.el.addEventListener('mouseenter', () => this._cancelHide());
    this.el.addEventListener('mouseleave', () => this.hide());
  }

  async show(mouseX: number, mouseY: number, filePath: string, line: number) {
    this._cancelHide();

    const tfile = this.app.vault.getAbstractFileByPath(filePath);
    if (!(tfile instanceof TFile)) return;

    let lines: string[];
    try {
      lines = (await this.app.vault.cachedRead(tfile)).split('\n');
    } catch { return; }

    // 上下各 4 行的上下文
    const CONTEXT  = 4;
    const startIdx = Math.max(0, line - 1 - CONTEXT);
    const endIdx   = Math.min(lines.length - 1, line - 1 + CONTEXT);

    this.el.innerHTML = '';

    // 标题：文件名 · 行号
    const title = document.createElement('div');
    title.className   = 'thp-title';
    title.textContent = t('PREVIEW_TITLE', { filename: filePath.split('/').pop()?.replace(/\.md$/, '') ?? '', line });
    this.el.appendChild(title);

    // 代码行
    const body = document.createElement('div');
    body.className = 'thp-lines';
    for (let i = startIdx; i <= endIdx; i++) {
      const row = document.createElement('div');
      row.className = i === line - 1 ? 'thp-line thp-line-target' : 'thp-line';

      const num = document.createElement('span');
      num.className   = 'thp-linenum';
      num.textContent = String(i + 1);

      const txt = document.createElement('span');
      txt.className   = 'thp-linetext';
      txt.textContent = lines[i] ?? '';

      row.appendChild(num);
      row.appendChild(txt);
      body.appendChild(row);
    }
    this.el.appendChild(body);

    // 定位：默认出现在鼠标右侧，空间不足则左侧
    this.el.style.display    = 'block';
    this.el.style.visibility = 'hidden';

    const pw = this.el.offsetWidth  || 520;
    const ph = this.el.offsetHeight || 160;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const GAP = 16;
    let left = mouseX + GAP;
    if (left + pw > vw - 8) left = mouseX - pw - GAP;
    if (left < 8)           left = 8;

    let top = mouseY - Math.floor(ph / 2);
    if (top + ph > vh - 8) top = vh - ph - 8;
    if (top < 8)           top = 8;

    this.el.style.left       = `${left}px`;
    this.el.style.top        = `${top}px`;
    this.el.style.visibility = 'visible';
  }

  hide(delay = 180) {
    this._cancelHide();
    this.hideTimer = setTimeout(() => { this.el.style.display = 'none'; }, delay);
  }

  private _cancelHide() {
    if (this.hideTimer) { clearTimeout(this.hideTimer); this.hideTimer = null; }
  }

  destroy() { this.el.remove(); }
}

// ─────────────────────────────────────────────
// 历史面板 View
// ─────────────────────────────────────────────


class TempHistoryView extends ItemView {
  private plugin: TemperatureMarkerPlugin;
  private preview!: HoverPreview;

  constructor(leaf: WorkspaceLeaf, plugin: TemperatureMarkerPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType()    { return VIEW_TYPE_HISTORY; }
  getDisplayText() { return '学习温度记录'; }
  getIcon()        { return 'list-checks'; }

  async onOpen()  { this.preview = new HoverPreview(this.app); this.render(); }
  async onClose() { this.preview?.destroy(); }

  render() { this._doRender(); }

  private async _doRender() {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass('temp-panel');
    root.createEl('div', { text: t('PANEL_HISTORY_TITLE'), cls: 'temp-panel-title' });

    const history = this.plugin.sqlDb.getHistory({ limit: 200 });
    if (history.length === 0) {
      root.createEl('div', { text: t('PANEL_HISTORY_EMPTY'), cls: 'temp-panel-empty' });
      return;
    }

    // 加载所有当前标记（用于状态变化对比）
    const allCurrentMarks = this.plugin.sqlDb.getAllCurrentMarks();

    // 按文件分组（history 已按 timestamp DESC）
    const fileGroups = new Map<string, { entries: typeof history; maxTs: number }>();
    for (const entry of history) {
      if (!fileGroups.has(entry.file)) {
        fileGroups.set(entry.file, { entries: [], maxTs: 0 });
      }
      const g = fileGroups.get(entry.file)!;
      g.entries.push(entry);
      if (entry.timestamp > g.maxTs) g.maxTs = entry.timestamp;
    }

    // 按文件最新标记时间排序（新→旧）
    const sorted = [...fileGroups.entries()].sort((a, b) => b[1].maxTs - a[1].maxTs);

    for (const [filePath, { entries }] of sorted) {
      // 读取文件内容以获取行文本
      const tfile = this.app.vault.getAbstractFileByPath(filePath);
      let lines: string[] = [];
      if (tfile instanceof TFile) {
        try { lines = (await this.app.vault.cachedRead(tfile)).split('\n'); } catch {}
      }

      const shortName = filePath.split('/').pop()?.replace(/\.md$/, '') ?? filePath;
      const details = root.createEl('details', { cls: 'temp-file-section' });
      details.setAttribute('open', '');

      // 标题行：文件名 + 颜色统计
      const summary = details.createEl('summary', { cls: 'temp-file-summary' });
      summary.createEl('span', { text: shortName, cls: 'temp-file-name' });
      const counts = { green: 0, orange: 0, red: 0 };
      entries.forEach(e => counts[e.color]++);
      const statsEl = summary.createEl('span', { cls: 'temp-panel-stats' });
      (['red', 'orange', 'green'] as Temperature[]).forEach(color => {
        if (!counts[color]) return;
        const chip = statsEl.createEl('span', { cls: 'temp-stat-chip' });
        chip.createEl('span', { cls: `temp-panel-dot temp-dot-${color}` });
        chip.createEl('span', { text: String(counts[color]), cls: 'temp-stat-count' });
      });

      // 条目（已按时间倒序）
      for (const entry of entries) {
        const item = details.createEl('div', { cls: 'temp-panel-item' });

        // 状态变化指示器
        const curColor = allCurrentMarks.get(`${entry.file}\0${entry.line}`) ?? null;
        const changed  = curColor !== entry.color;
        const dotWrap  = item.createEl('span', { cls: 'fh-dot-wrap' });
        dotWrap.createEl('span', { cls: `temp-panel-dot temp-dot-${entry.color}` });
        if (changed) {
          dotWrap.createEl('span', { text: '→', cls: 'fh-dot-arrow' });
          if (curColor) {
            dotWrap.createEl('span', { cls: `temp-panel-dot temp-dot-${curColor}` });
          } else {
            dotWrap.createEl('span', { cls: 'temp-panel-dot fh-dot-cleared' });
          }
        }

        const lineText = (lines[entry.line - 1] ?? '').trim() || t('PREVIEW_TITLE', { filename: shortName, line: entry.line });
        item.createEl('span', { text: lineText, cls: 'temp-panel-loc' });
        const timeStr = new Date(entry.timestamp).toLocaleTimeString(t('DATE_LOCALE'), {
          hour: '2-digit', minute: '2-digit',
        });
        item.createEl('span', { text: timeStr, cls: 'temp-panel-time' });
        const del = item.createEl('span', { text: '×', cls: 'temp-entry-del' });
        del.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(t('CONFIRM_DELETE', { filename: shortName, line: entry.line }))) {
            this.plugin.deleteHistoryEntry(entry.file, entry.line, entry.timestamp);
            this.render();
          }
        });
        item.addEventListener('click', () => this.navigateTo(entry.file, entry.line));
        item.addEventListener('mouseenter', (e) => this.preview.show(e.clientX, e.clientY, entry.file, entry.line));
        item.addEventListener('mouseleave', () => this.preview.hide());
      }
    }
  }

  private async navigateTo(filePath: string, line: number) {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) return;

    const existing = this.app.workspace.getLeavesOfType('markdown')
      .find(l => (l.view as MarkdownView).file?.path === filePath);
    const leaf = existing ?? this.app.workspace.getLeaf('tab');
    if (!existing) await leaf.openFile(file);
    this.app.workspace.revealLeaf(leaf);

    // openFile 完成后显式恢复标记和词条（file-open 事件时序不可靠）
    requestAnimationFrame(() => {
      this.plugin.restoreMarks(filePath);
      this.plugin._dispatchNoteVocabTerms(filePath);
      const view = leaf.view as MarkdownView;
      if (!view?.editor) return;
      const pos = { line: line - 1, ch: 0 };
      view.editor.setCursor(pos);
      view.editor.scrollIntoView({ from: pos, to: pos }, true);
    });
  }
}

// ─────────────────────────────────────────────
// 词条收集面板
// ─────────────────────────────────────────────

class VocabQueueView extends ItemView {
  private plugin: TemperatureMarkerPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: TemperatureMarkerPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType()    { return VIEW_TYPE_VOCAB; }
  getDisplayText() { return '词条收集清单'; }
  getIcon()        { return 'book-plus'; }

  async onOpen()  { this.render(); }
  async onClose() {}

  render() {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass('vocab-panel');

    const activeFile = this.plugin.app.workspace.getActiveFile();

    // ── 区域一：当前笔记已关联词条 ──────────────────
    root.createEl('div', { text: t('SECTION_LINKED_TERMS'), cls: 'vocab-section-title' });

    if (!activeFile) {
      root.createEl('div', { text: t('HINT_OPEN_NOTE'), cls: 'vocab-panel-hint' });
    } else {
      const linked = this.plugin.sqlDb.getNoteVocab(activeFile.path);

      // 搜索添加已有词条
      const addRow = root.createEl('div', { cls: 'vocab-add-row' });
      const input = addRow.createEl('input', {
        type: 'text',
        placeholder: t('BTN_LINK') + '…',
        cls: 'vocab-add-input',
      });
      const addBtn = addRow.createEl('button', { text: t('BTN_LINK'), cls: 'vocab-add-btn' });

      // 输入时过滤已有词条，显示候选列表
      const suggestions = root.createEl('div', { cls: 'vocab-suggestions' });
      suggestions.style.display = 'none';

      const refreshSuggestions = (query: string) => {
        suggestions.empty();
        if (!query) { suggestions.style.display = 'none'; return; }
        const allTerms = [...vocabLinkIndex.termToPath.keys()];
        const matched = allTerms.filter(term =>
          term.toLowerCase().includes(query.toLowerCase()) && !linked.includes(term)
        ).slice(0, 8);
        if (matched.length === 0) { suggestions.style.display = 'none'; return; }
        suggestions.style.display = '';
        for (const term of matched) {
          const item = suggestions.createEl('div', { text: term, cls: 'vocab-suggestion-item' });
          item.addEventListener('click', () => {
            input.value = term;
            suggestions.style.display = 'none';
          });
        }
      };

      input.addEventListener('input', () => refreshSuggestions(input.value));

      const doAdd = () => {
        const term = input.value.trim();
        if (!term) return;
        this.plugin.sqlDb.addNoteVocab(activeFile.path, term);
        this.plugin._dispatchNoteVocabTerms(activeFile.path);
        input.value = '';
        suggestions.style.display = 'none';
        this.render();
      };
      addBtn.addEventListener('click', doAdd);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doAdd(); });

      // 已关联词条列表
      if (linked.length === 0) {
        root.createEl('div', { text: t('HINT_NO_LINKED'), cls: 'vocab-panel-hint' });
      } else {
        const list = root.createEl('div', { cls: 'vocab-linked-list' });
        for (const term of linked) {
          const chip = list.createEl('div', { cls: 'vocab-linked-chip' });
          const hasNote = vocabLinkIndex.termToPath.has(term);
          chip.createEl('span', {
            text: term,
            cls: hasNote ? 'vocab-chip-term' : 'vocab-chip-term vocab-chip-missing',
          });
          if (!hasNote) {
            chip.createEl('span', { text: t('VOCAB_NO_NOTE'), cls: 'vocab-chip-warn' });
          }
          const del = chip.createEl('span', { text: '×', cls: 'vocab-card-del' });
          del.addEventListener('click', () => {
            this.plugin.sqlDb.removeNoteVocab(activeFile.path, term);
            this.plugin._dispatchNoteVocabTerms(activeFile.path);
            this.render();
          });
        }
      }
    }

    // ── 区域二：收集队列 ──────────────────────────
    root.createEl('div', { text: t('SECTION_QUEUE'), cls: 'vocab-section-title vocab-section-gap' });

    const titleRow = root.createEl('div', { cls: 'vocab-panel-title-row' });
    titleRow.createEl('span', {
      text: this.plugin.highlightMode ? t('TAG_COLLECTING') : t('TAG_INACTIVE'),
      cls: `vocab-mode-tag ${this.plugin.highlightMode ? 'vocab-mode-active' : 'vocab-mode-inactive'}`,
    });

    const queue = this.plugin.vocabQueue;
    if (queue.length > 0) {
      const btnRow = root.createEl('div', { cls: 'vocab-panel-btn-row' });
      const copyBtn = btnRow.createEl('button', { text: t('BTN_COPY_PROMPT'), cls: 'mod-cta vocab-copy-btn' });
      copyBtn.addEventListener('click', () => this.plugin.toggleHighlightMode());
      const clearBtn = btnRow.createEl('button', { text: t('BTN_CLEAR'), cls: 'vocab-clear-btn' });
      clearBtn.addEventListener('click', () => {
        this.plugin.vocabQueue = [];
        this.plugin.updateStatusBar();
        this.render();
      });
    } else {
      root.createEl('div', {
        text: this.plugin.highlightMode ? t('HINT_HOW_TO_COLLECT') : t('HINT_OPEN_NOTE'),
        cls: 'vocab-panel-hint',
      });
    }

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      const card = root.createEl('div', { cls: 'vocab-card' });
      const wordRow = card.createEl('div', { cls: 'vocab-card-word-row' });
      wordRow.createEl('span', { text: `${i + 1}`, cls: 'vocab-card-index' });
      wordRow.createEl('span', { text: item.word, cls: 'vocab-card-word' });
      const delBtn = wordRow.createEl('span', { text: '×', cls: 'vocab-card-del' });
      delBtn.addEventListener('click', () => {
        this.plugin.vocabQueue.splice(i, 1);
        this.plugin.updateStatusBar();
        this.render();
      });
      card.createEl('div', { text: item.context, cls: 'vocab-card-context' });
      const shortFile = item.file.split('/').pop() ?? item.file;
      card.createEl('div', { text: t('PREVIEW_TITLE', { filename: shortFile, line: item.line }), cls: 'vocab-card-source' });
    }
  }
}

// ─────────────────────────────────────────────
// 全页学习历史视图
// ─────────────────────────────────────────────

class FullHistoryView extends ItemView {
  private plugin: TemperatureMarkerPlugin;
  private filterDays  = 30;
  private selectedDate: string = localDateStr(new Date()); // 默认今天
  private heatmapMode: 'count' | 'status' = 'count';      // 热力图模式
  private preview!: HoverPreview;

  constructor(leaf: WorkspaceLeaf, plugin: TemperatureMarkerPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType()    { return VIEW_TYPE_HISTORY_FULL; }
  getDisplayText() { return t('PANEL_FULL_TITLE'); }
  getIcon()        { return 'list-checks'; }

  async onOpen()  { this.preview = new HoverPreview(this.app); this.render(); }
  async onClose() { this.preview?.destroy(); }

  render() { this._doRender(); }

  private async _doRender() {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass('full-history');

    // ── 标题 ──
    root.createEl('h2', { text: t('PANEL_FULL_TITLE'), cls: 'fh-title' });

    // ── 热力图 ──
    const stats        = this.plugin.sqlDb.getDailyStats();
    const currentStats = this.plugin.sqlDb.getDailyCurrentStats();
    this._renderHeatmap(root, stats, currentStats);

    // ── 汇总数字 ──
    const total   = stats.reduce((s, d) => s + d.green + d.orange + d.red, 0);
    const greens  = stats.reduce((s, d) => s + d.green, 0);
    const oranges = stats.reduce((s, d) => s + d.orange, 0);
    const reds    = stats.reduce((s, d) => s + d.red, 0);

    const summaryEl = root.createEl('div', { cls: 'fh-summary' });
    const chips: [string, number, string][] = [
      [t('CHIP_TOTAL'),  total,   'fh-chip-total'],
      [t('CHIP_GREEN'),  greens,  'fh-chip-green'],
      [t('CHIP_ORANGE'), oranges, 'fh-chip-orange'],
      [t('CHIP_RED'),    reds,    'fh-chip-red'],
    ];
    for (const [label, count, cls] of chips) {
      const chip = summaryEl.createEl('div', { cls: `fh-chip ${cls}` });
      chip.createEl('div', { text: String(count), cls: 'fh-chip-num' });
      chip.createEl('div', { text: label, cls: 'fh-chip-label' });
    }

    // ── 历史条目：按选中日期过滤 ──
    const dayStart = parseDateStr(this.selectedDate).getTime();
    const dayEnd   = dayStart + 86_400_000;
    const history  = this.plugin.sqlDb.getHistory({ since: dayStart, until: dayEnd, limit: 1000 });

    const today = localDateStr(new Date());
    const dateLabel = this.selectedDate === today
      ? new Date().toLocaleDateString(t('DATE_LOCALE'), { month: 'short', day: 'numeric' })
      : this.selectedDate;
    root.createEl('div', {
      text: `${dateLabel}  ·  ${history.length}`,
      cls: 'fh-list-title',
    });

    // 加载所有当前标记（用于状态变化对比）
    const allCurrentMarks = this.plugin.sqlDb.getAllCurrentMarks();

    // 按文件分组（history 已按 timestamp DESC）
    const fileGroups = new Map<string, { entries: typeof history; maxTs: number }>();
    for (const entry of history) {
      if (!fileGroups.has(entry.file)) {
        fileGroups.set(entry.file, { entries: [], maxTs: 0 });
      }
      const g = fileGroups.get(entry.file)!;
      g.entries.push(entry);
      if (entry.timestamp > g.maxTs) g.maxTs = entry.timestamp;
    }

    // 按文件最新时间排序
    const sorted = [...fileGroups.entries()].sort((a, b) => b[1].maxTs - a[1].maxTs);

    const list = root.createEl('div', { cls: 'fh-list' });

    for (const [filePath, { entries }] of sorted) {
      const tfile = this.app.vault.getAbstractFileByPath(filePath);
      let lines: string[] = [];
      if (tfile instanceof TFile) {
        try { lines = (await this.app.vault.cachedRead(tfile)).split('\n'); } catch {}
      }

      const shortName = filePath.split('/').pop()?.replace(/\.md$/, '') ?? filePath;
      const details = list.createEl('details', { cls: 'fh-file-section' });
      details.setAttribute('open', '');

      const summary = details.createEl('summary', { cls: 'fh-file-summary' });
      summary.createEl('span', { text: shortName, cls: 'fh-file-name' });
      const counts = { green: 0, orange: 0, red: 0 };
      entries.forEach(e => counts[e.color]++);
      const statsEl = summary.createEl('span', { cls: 'temp-panel-stats' });
      (['red', 'orange', 'green'] as Temperature[]).forEach(color => {
        if (!counts[color]) return;
        const chip = statsEl.createEl('span', { cls: 'temp-stat-chip' });
        chip.createEl('span', { cls: `temp-panel-dot temp-dot-${color}` });
        chip.createEl('span', { text: String(counts[color]), cls: 'temp-stat-count' });
      });

      for (const entry of entries) {
        const row = details.createEl('div', { cls: 'fh-row' });

        // 状态指示器：若当前状态与记录时不同，显示 旧→新
        const curColor = allCurrentMarks.get(`${entry.file}\0${entry.line}`) ?? null;
        const changed  = curColor !== entry.color;
        const dotWrap  = row.createEl('span', { cls: 'fh-dot-wrap' });
        dotWrap.createEl('span', { cls: `fh-dot temp-dot-${entry.color}` });
        if (changed) {
          dotWrap.createEl('span', { text: '→', cls: 'fh-dot-arrow' });
          if (curColor) {
            dotWrap.createEl('span', { cls: `fh-dot temp-dot-${curColor}` });
          } else {
            dotWrap.createEl('span', { cls: 'fh-dot fh-dot-cleared' });
          }
        }

        const lineText = (lines[entry.line - 1] ?? '').trim() || t('PREVIEW_TITLE', { filename: shortName, line: entry.line });
        row.createEl('span', { text: lineText, cls: 'fh-row-loc' });
        const d = new Date(entry.timestamp);
        row.createEl('span', {
          text: d.toLocaleTimeString(t('DATE_LOCALE'), { hour: '2-digit', minute: '2-digit' }),
          cls: 'fh-row-time',
        });
        const del = row.createEl('span', { text: '×', cls: 'temp-entry-del' });
        del.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(t('CONFIRM_DELETE', { filename: shortName, line: entry.line }))) {
            this.plugin.deleteHistoryEntry(entry.file, entry.line, entry.timestamp);
            this.render();
          }
        });
        row.addEventListener('click', () => this._navigateTo(entry.file, entry.line));
        row.addEventListener('mouseenter', (e) => this.preview.show(e.clientX, e.clientY, entry.file, entry.line));
        row.addEventListener('mouseleave', () => this.preview.hide());
      }
    }
  }

  private _renderHeatmap(
    root: HTMLElement,
    stats:        Array<{ date: string; green: number; orange: number; red: number }>,
    currentStats: Array<{ date: string; green: number; orange: number; red: number }>,
  ) {
    const wrap = root.createEl('div', { cls: 'fh-heatmap-wrap' });

    // ── 模式切换按钮 ──
    const modeBar = wrap.createEl('div', { cls: 'fh-heatmap-mode-bar' });
    const btnCount  = modeBar.createEl('button', { text: t('HEATMAP_COUNT'),  cls: 'fh-mode-btn' });
    const btnStatus = modeBar.createEl('button', { text: t('HEATMAP_STATUS'), cls: 'fh-mode-btn' });
    const setActive = () => {
      btnCount .classList.toggle('fh-mode-btn-active', this.heatmapMode === 'count');
      btnStatus.classList.toggle('fh-mode-btn-active', this.heatmapMode === 'status');
    };
    setActive();
    btnCount .addEventListener('click', () => { this.heatmapMode = 'count';  this.render(); });
    btnStatus.addEventListener('click', () => { this.heatmapMode = 'status'; this.render(); });

    // ── 数据准备 ──
    const dateMap        = new Map(stats.map(d => [d.date, d]));
    const currentDateMap = new Map(currentStats.map(d => [d.date, d]));

    // 从最早有记录的一天开始，到今天
    const todayStr   = localDateStr(new Date());
    const endDate    = parseDateStr(todayStr);
    const earliestTs = this.plugin.sqlDb.getEarliestTimestamp();
    const startDate  = earliestTs ? parseDateStr(localDateStr(new Date(earliestTs))) : endDate;

    // 对齐到起点所在周的周一
    const weekStart = new Date(startDate);
    const dowMon    = (weekStart.getDay() + 6) % 7;
    weekStart.setDate(weekStart.getDate() - dowMon);

    const totalDays = Math.floor((endDate.getTime() - weekStart.getTime()) / 86_400_000) + 1;

    // 按周分组，每周 7 格
    type Cell = { key: string; total: number } | null;
    const weeks: Cell[][] = [];
    let week: Cell[] = [];
    for (let i = 0; i < totalDays; i++) {
      const date    = new Date(weekStart.getTime() + i * 86_400_000);
      const key     = localDateStr(date);
      const inRange = key >= localDateStr(startDate) && key <= todayStr;
      if (inRange) {
        const d     = dateMap.get(key);
        const total = d ? d.green + d.orange + d.red : 0;
        week.push({ key, total });
      } else {
        week.push(null);
      }
      if (week.length === 7) { weeks.push(week); week = []; }
    }
    if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }

    // 按月分组
    type MonthGroup = { label: string; weeks: Cell[][] };
    const monthGroups: MonthGroup[] = [];
    for (const w of weeks) {
      const firstCell = w.find(c => c !== null);
      if (!firstCell) continue;
      const mo    = parseInt(firstCell.key.slice(5, 7)) - 1;
      const label = new Date(parseInt(firstCell.key.slice(0, 4)), mo, 1)
        .toLocaleDateString(t('DATE_LOCALE'), { month: 'short' });
      const last  = monthGroups[monthGroups.length - 1];
      if (last && last.label === label) last.weeks.push(w);
      else monthGroups.push({ label, weeks: [w] });
    }

    // ── 布局：左侧星期标签 + 右侧月份组 ──
    const container = wrap.createEl('div', { cls: 'fh-heatmap-container' });

    const dayCol    = container.createEl('div', { cls: 'fh-heatmap-days' });
    const DOW_LABELS = ['一', '二', '三', '四', '五', '六', '日'];
    for (let dow = 0; dow < 7; dow++) {
      dayCol.createEl('div', {
        text: [0, 2, 4].includes(dow) ? DOW_LABELS[dow] : '',
        cls: 'fh-day-label',
      });
    }

    const monthsRow = container.createEl('div', { cls: 'fh-heatmap-months-row' });
    requestAnimationFrame(() => { monthsRow.scrollLeft = monthsRow.scrollWidth; });

    for (const group of monthGroups) {
      const monthEl = monthsRow.createEl('div', { cls: 'fh-heatmap-month' });
      monthEl.createEl('div', { text: group.label, cls: 'fh-month-header' });

      const weeksEl = monthEl.createEl('div', { cls: 'fh-heatmap-weeks' });
      for (const w of group.weeks) {
        const weekEl = weeksEl.createEl('div', { cls: 'fh-heatmap-week' });
        for (const cell of w) {
          if (!cell) { weekEl.createEl('div', { cls: 'fh-cell fh-cell-empty' }); continue; }

          const isSelected = cell.key === this.selectedDate;
          const el = weekEl.createEl('div', {
            cls: `fh-cell${isSelected ? ' fh-cell-selected' : ''}`,
          });

          if (this.heatmapMode === 'count') {
            // ── 模式一：记录数量，以 100 条为满绿 ──
            if (cell.total === 0) {
              el.style.background = 'transparent';
              el.style.border = '1px solid var(--background-modifier-border)';
            } else {
              const alpha = 0.15 + 0.85 * Math.min(cell.total / 100, 1);
              el.style.background = `rgba(76, 175, 80, ${alpha.toFixed(3)})`;
            }
            el.title = `${cell.key}：${cell.total} 条`;
          } else {
            // ── 模式二：当前状态分布，渐变填充 ──
            const cur   = currentDateMap.get(cell.key);
            const cg    = cur?.green  ?? 0;
            const co    = cur?.orange ?? 0;
            const cr    = cur?.red    ?? 0;
            const ctot  = cg + co + cr;
            if (ctot === 0) {
              el.style.background = 'transparent';
              el.style.border = '1px solid var(--background-modifier-border)';
              el.title = `${cell.key}：无当前标记`;
            } else {
              const gPct = (cg / ctot) * 100;
              const oPct = (co / ctot) * 100;
              // 从下到上：绿 → 橙 → 红
              el.style.background = `linear-gradient(to top,
                rgba(76,175,80,0.85)  0%   ${gPct.toFixed(1)}%,
                rgba(255,152,0,0.85)  ${gPct.toFixed(1)}%  ${(gPct + oPct).toFixed(1)}%,
                rgba(244,67,54,0.85)  ${(gPct + oPct).toFixed(1)}%  100%
              )`;
              el.title = `${cell.key}  当前：绿${cg} 橙${co} 红${cr}`;
            }
          }

          el.addEventListener('click', () => { this.selectedDate = cell.key; this.render(); });
        }
      }
    }
  }

  private async _navigateTo(filePath: string, line: number) {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) return;
    const existing = this.app.workspace.getLeavesOfType('markdown')
      .find(l => (l.view as MarkdownView).file?.path === filePath);
    const leaf = existing ?? this.app.workspace.getLeaf('tab');
    if (!existing) await leaf.openFile(file);
    this.app.workspace.revealLeaf(leaf);
    requestAnimationFrame(() => {
      this.plugin.restoreMarks(filePath);
      this.plugin._dispatchNoteVocabTerms(filePath);
      const view = leaf.view as MarkdownView;
      if (!view?.editor) return;
      const pos = { line: line - 1, ch: 0 };
      view.editor.setCursor(pos);
      view.editor.scrollIntoView({ from: pos, to: pos }, true);
    });
  }
}
