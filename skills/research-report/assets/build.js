#!/usr/bin/env node
/* ============================================================
   Deep Notes · 确定性组装脚本（零依赖，Node >= 12）
   ------------------------------------------------------------
   用法：
     node assets/build.js <草稿.html> [输出.html]
   作用：
     把草稿槽位 A / C 里的两个哨兵（正文中是包着块注释符的
       __DN_CSS__ 与 __DN_JS__ 两个标记；此处不能照写字面量，
       否则星号斜杠会提前闭合本注释）
     替换为同目录 components.css / components.js 全文，
     产出 CSS/JS 全内联、可离线打开的单文件 HTML。
   约定：
     - 草稿从 assets/template.html 复制，只填正文，不粘贴公共资产；
     - 哨兵必须各出现且只出现一次，缺失/重复直接报错中止；
     - 输出文件名省略时：x.draft.html -> x.html，否则追加 .built.html；
     - 资产按本脚本所在目录定位，从任何工作目录调用均可。
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const CSS_TOKEN = '/*__DN_CSS__*/';
const JS_TOKEN = '/*__DN_JS__*/';

function fail(message) {
  console.error('[build] 中止：' + message);
  process.exit(1);
}

function countOccurrences(text, token) {
  return text.split(token).length - 1;
}

function main() {
  const [draftArg, outArg] = process.argv.slice(2);
  if (!draftArg) {
    fail('用法：node assets/build.js <草稿.html> [输出.html]');
  }

  const assetsDir = __dirname;
  const cssPath = path.join(assetsDir, 'components.css');
  const jsPath = path.join(assetsDir, 'components.js');
  const draftPath = path.resolve(draftArg);

  if (!fs.existsSync(draftPath)) fail('找不到草稿：' + draftPath);
  if (!fs.existsSync(cssPath)) fail('找不到公共样式：' + cssPath);
  if (!fs.existsSync(jsPath)) fail('找不到公共脚本：' + jsPath);

  let html = fs.readFileSync(draftPath, 'utf8');

  [[CSS_TOKEN, 'components.css'], [JS_TOKEN, 'components.js']].forEach(([token, name]) => {
    const n = countOccurrences(html, token);
    if (n === 0) {
      fail('草稿缺少哨兵 ' + token + '（槽位应为 ' + name + ' 保留）。请从 template.html 复制骨架，不要手工粘贴公共资产。');
    }
    if (n > 1) fail('哨兵 ' + token + ' 出现 ' + n + ' 次，只能保留 1 处。');
  });

  const css = fs.readFileSync(cssPath, 'utf8');
  const js = fs.readFileSync(jsPath, 'utf8');
  // 用函数作替换值，避免资产文本里的 $ 序列被当作替换模式
  html = html.replace(CSS_TOKEN, () => css).replace(JS_TOKEN, () => js);

  let outPath;
  if (outArg) {
    outPath = path.resolve(outArg);
  } else if (/\.draft\.html$/i.test(draftPath)) {
    outPath = draftPath.replace(/\.draft\.html$/i, '.html');
  } else {
    outPath = draftPath.replace(/\.html$/i, '') + '.built.html';
  }

  fs.writeFileSync(outPath, html, 'utf8');

  console.log(
    '[build] 完成：' + path.basename(outPath) +
    '  ' + (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1) + ' KB' +
    '（已注入 components.css ' + (Buffer.byteLength(css, 'utf8') / 1024).toFixed(1) +
    ' KB + components.js ' + (Buffer.byteLength(js, 'utf8') / 1024).toFixed(1) + ' KB）'
  );
}

main();
