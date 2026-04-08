# Obsidian Temperature Marker

An [Obsidian](https://obsidian.md) plugin for marking each line with a **learning temperature** and tracking your understanding over time.

---

## What is "Learning Temperature"?

Inspired by the concept of the *Zone of Proximal Development*, this plugin lets you tag every line in your notes with one of three states:

| Temperature | Color | Meaning |
|---|---|---|
| Comfort Zone | 🟢 Green | Already understood — ready to teach |
| Learning Zone | 🟠 Orange | Partially understood — active learning area |
| Panic Zone | 🔴 Red | Not understood yet — needs focused attention |

Over time, watching lines shift from red → orange → green gives you a concrete picture of your learning progress.

---

## Features

- **Line-level temperature marking** — hover any line to reveal color dots; click to mark
- **Persistent SQLite storage** — marks survive vault restarts, stored per-file per-line
- **Learning history heatmap** — calendar heatmap showing daily activity, with two display modes:
  - **Count mode**: how many lines you marked that day (deeper green = more active)
  - **Status mode**: current temperature distribution of lines marked that day
- **Status-change indicator** — history entries show an arrow when a line's current temperature differs from when it was recorded
- **Vocabulary collection** — select text, press `Ctrl+Q` to collect terms into a glossary queue
- **Vocabulary highlighting** — registered terms are highlighted inline with tooltip previews (dot-underline style)
- **Two-way link support** — vocabulary entries link back to the notes where they appear

---

## Installation

### Manual

1. Download the latest release from the [Releases](../../releases) page
2. Extract and copy `main.js`, `manifest.json`, `styles.css`, and `sql-wasm.wasm` into your vault's plugin folder:  
   `<vault>/.obsidian/plugins/temperature-marker/`
3. Reload Obsidian and enable the plugin in Settings → Community Plugins

### BRAT (Beta Reviewer's Auto-update Tool)

1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat)
2. Add this repo: `MatthewHA233/obsidian-temperature-marker`

---

## Usage

### Marking Lines

Hover over any line in a note → three colored dots appear on the right → click to set the temperature.

You can also drag across multiple lines to batch-mark.

### History Panel

Click the **clock icon** in the left ribbon to open the learning history panel. It shows:
- A calendar heatmap of your daily activity
- A list of recent mark events, grouped by date

Toggle between **Count** and **Status** heatmap modes with the buttons above the calendar.

### Vocabulary Collection

1. Click the **book-plus icon** in the left ribbon to enter collection mode
2. Select text in any note → `Ctrl+Q` (or right-click → "Add to vocabulary queue")
3. Review the queue in the right panel → click "Copy prompt & finish" to generate an AI prompt
4. The collected terms are saved and highlighted in associated notes

---

## Development

```bash
git clone https://github.com/MatthewHA233/obsidian-temperature-marker
cd obsidian-temperature-marker
npm install

# Optional: set your vault plugin dir for hot-reload
export OBSIDIAN_PLUGIN_DIR="/path/to/vault/.obsidian/plugins/temperature-marker"

npm run dev    # watch mode
npm run build  # production build
```

The build outputs `main.js` and `sql-wasm.wasm` to the project root.  
For development, set `OBSIDIAN_PLUGIN_DIR` to auto-sync files to your vault.

---

## License

[MIT](LICENSE)

---

## 中文说明

**温度标记**插件让你为笔记的每一行标注学习状态：

- 🟢 **舒适区**：已经理解，可以费曼检验
- 🟠 **学习区**：部分理解，主动学习中
- 🔴 **恐慌区**：尚未理解，需要重点攻克

配合热力图和词条收集功能，形成完整的主动学习闭环。

详细使用方式见上方英文文档，操作一致。
