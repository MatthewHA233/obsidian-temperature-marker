import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import fs from "fs";
import path from "path";

const prod = process.argv[2] === "production";

// 从环境变量读取 vault 插件路径（开发时可选），格式如：
//   OBSIDIAN_PLUGIN_DIR=/path/to/vault/.obsidian/plugins/temperature-marker
const vaultPluginDir = process.env.OBSIDIAN_PLUGIN_DIR;

const context = await esbuild.context({
  entryPoints: ["main.ts"],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...builtins,
  ],
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
});

function copyWasm() {
  const src = path.resolve("node_modules/sql.js/dist/sql-wasm.wasm");

  // 始终复制到项目根目录（发布时一并上传）
  const destRoot = path.resolve("sql-wasm.wasm");
  fs.copyFileSync(src, destRoot);
  console.log("[build] copied sql-wasm.wasm →", destRoot);

  // 如果设置了 vault 插件目录，也同步过去（开发模式热更新用）
  if (vaultPluginDir) {
    const destVault = path.join(vaultPluginDir, "sql-wasm.wasm");
    fs.mkdirSync(vaultPluginDir, { recursive: true });
    fs.copyFileSync(src, destVault);
    console.log("[build] copied sql-wasm.wasm →", destVault);
  }
}

if (prod) {
  await context.rebuild();
  copyWasm();
  process.exit(0);
} else {
  copyWasm();
  await context.watch();
}
