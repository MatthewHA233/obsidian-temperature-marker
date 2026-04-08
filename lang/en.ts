const en = {
  // Ribbon
  RIBBON_HISTORY:  'Learning History',
  RIBBON_VOCAB:    'Vocabulary Collection',

  // Context menu
  MENU_ADD_VOCAB:  'Add to vocab queue: {word}',

  // Notices
  NOTICE_VOCAB_EMPTY_EXIT:   'Vocab queue is empty. Exited collection mode.',
  NOTICE_VOCAB_MODE_ON:      'Vocab collection mode: select text, then Ctrl+Q or right-click to add.',
  NOTICE_WORD_DUPLICATE:     '"{word}" is already in the queue.',
  NOTICE_WORD_ADDED:         'Added: {word} ({count} total)',
  NOTICE_PROMPT_COPIED:      'Copied prompt for {count} term(s). Paste to Claude Code.',
  NOTICE_COPY_FAILED:        'Copy failed. Check the console for the prompt.',

  // Status bar
  STATUS_BAR_COUNT:          'Vocab: {count}',
  STATUS_BAR_BTN:            'Finish & copy',

  // Unknown file fallback
  UNKNOWN_FILE:              'unknown file',

  // Vocab prompt template (AI-facing, adjust categories to match your vault)
  VOCAB_PROMPT_INTRO:
`Please create a vocabulary note for each term listed below under the \`_glossary/\` directory in the vault.

Instructions:
1. Choose an appropriate category (TypeScript / Node.js / React & Ink / Architecture Patterns / AI & LLM / Claude-specific / or a new category you deem appropriate)
2. Create path: \`_glossary/{category}/{term}.md\`
3. Each note should include: one-line definition, how it appears in Claude Code, extended understanding, related terms

Term list:

{items}`,

  VOCAB_PROMPT_ITEM:         '[{index}] {word}\nSource: {file} line {line}\nContext: {context}',

  // History sidebar panel
  PANEL_HISTORY_TITLE:       'Learning History',
  PANEL_HISTORY_EMPTY:       'No records yet.',

  // Full history panel
  PANEL_FULL_TITLE:          'Learning History',
  PANEL_FULL_LIST_TITLE:     'History',
  CHIP_TOTAL:                'Total',
  CHIP_GREEN:                'Comfort',
  CHIP_ORANGE:               'Learning',
  CHIP_RED:                  'Panic',
  HEATMAP_COUNT:             'Count',
  HEATMAP_STATUS:            'Status',

  // Vocab panel
  SECTION_LINKED_TERMS:      'Terms in this note',
  SECTION_QUEUE:             'Collection queue',
  HINT_OPEN_NOTE:            'Open a note to see its linked terms.',
  HINT_NO_LINKED:            'No linked terms.',
  HINT_HOW_TO_COLLECT:       'Select text, then Ctrl+Q or right-click to add.',
  BTN_LINK:                  'Link',
  BTN_COPY_PROMPT:           'Copy prompt & finish',
  BTN_CLEAR:                 'Clear',
  TAG_COLLECTING:            'Collecting',
  TAG_INACTIVE:              'Inactive',
  VOCAB_NO_NOTE:             '(no note)',

  // Delete confirmation
  CONFIRM_DELETE:            'Delete this record and clear the mark?\n{filename} · Line {line}',

  // Hover preview
  PREVIEW_TITLE:             '{filename}  ·  Line {line}',

  // Date / time locale string passed to toLocaleTimeString / toLocaleDateString
  DATE_LOCALE:               'en-US',
};

export default en;
export type Translations = typeof en;
