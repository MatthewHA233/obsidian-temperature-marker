import type { Translations } from './en';

const zh: Translations = {
  // Ribbon
  RIBBON_HISTORY:  '学习温度记录',
  RIBBON_VOCAB:    '词条收集模式',

  // Context menu
  MENU_ADD_VOCAB:  '加入词条清单：{word}',

  // Notices
  NOTICE_VOCAB_EMPTY_EXIT:   '词条清单为空，已退出收集模式',
  NOTICE_VOCAB_MODE_ON:      '已进入词条收集模式，选中文字后按 Ctrl+Q 或右键加入清单',
  NOTICE_WORD_DUPLICATE:     '「{word}」已在清单中',
  NOTICE_WORD_ADDED:         '已加入：{word}（共 {count} 个）',
  NOTICE_PROMPT_COPIED:      '已复制 {count} 个词条的 prompt，粘贴给 Claude Code 即可',
  NOTICE_COPY_FAILED:        '复制失败，请手动复制控制台输出',

  // Status bar
  STATUS_BAR_COUNT:          '词条收集：{count} 个',
  STATUS_BAR_BTN:            '  结束并复制',

  // Unknown file fallback
  UNKNOWN_FILE:              '未知文件',

  // Vocab prompt template
  VOCAB_PROMPT_INTRO:
`请根据以下生词清单，在笔记仓库的 \`_词汇表/\` 目录下为每个词条创建笔记。

要求：
1. 自行判断合适的分类（TypeScript概念 / Node.js概念 / React与Ink概念 / 架构模式 / AI与LLM概念 / Claude专有概念 / 或你认为更合适的新分类）
2. 创建路径：\`_词汇表/{分类}/{词条名}.md\`
3. 每篇笔记填写：一句话定义、在 Claude Code 里的体现、延伸理解、相关词条

生词清单：

{items}`,

  VOCAB_PROMPT_ITEM:         '【{index}】{word}\n来源：{file} 第 {line} 行\n上下文：{context}',

  // History sidebar panel
  PANEL_HISTORY_TITLE:       '学习温度记录',
  PANEL_HISTORY_EMPTY:       '暂无记录',

  // Full history panel
  PANEL_FULL_TITLE:          '学习历史',
  PANEL_FULL_LIST_TITLE:     '历史记录',
  CHIP_TOTAL:                '共标记',
  CHIP_GREEN:                '舒适区',
  CHIP_ORANGE:               '学习区',
  CHIP_RED:                  '恐慌区',
  HEATMAP_COUNT:             '记录数量',
  HEATMAP_STATUS:            '当前状态',

  // Vocab panel
  SECTION_LINKED_TERMS:      '当前笔记词条',
  SECTION_QUEUE:             '收集队列',
  HINT_OPEN_NOTE:            '请先打开一篇笔记',
  HINT_NO_LINKED:            '尚无关联词条',
  HINT_HOW_TO_COLLECT:       '选中文字后按 Ctrl+Q 或右键加入清单',
  BTN_LINK:                  '关联',
  BTN_COPY_PROMPT:           '复制 prompt 并结束',
  BTN_CLEAR:                 '清空',
  TAG_COLLECTING:            '收集中',
  TAG_INACTIVE:              '未激活',
  VOCAB_NO_NOTE:             '(无笔记)',

  // Delete confirmation
  CONFIRM_DELETE:            '删除此记录并清除该行标记？\n{filename} · 第 {line} 行',

  // Hover preview
  PREVIEW_TITLE:             '{filename}  ·  第 {line} 行',

  // Date / time locale
  DATE_LOCALE:               'zh-CN',
};

export default zh;
