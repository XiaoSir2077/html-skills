---
name: research-report
description: 围绕市场、产品、竞品、方案或商业问题进行证据型调研，输出可支持决策的浅色单文件 HTML 报告。用户说「调研一下」「竞品分析」「方案比较」「帮我决策」「给老板看的报告」时调用。读书笔记、概念理解、费曼学习不要用这个。
---

# Research Report · 契约卡

帮助用户围绕一个商业、产品、市场或方案问题进行证据型调研，并在阅读后能够做出判断或采取行动。

## 触发条件

- 用户明确提到：调研、报告、方案比较、竞品分析、市场分析、商业决策
- 用户要求：给老板看、支持决策、选哪个、能不能做、值不值得做
- 用户提供：问题、方案、竞品、数据片段，需要整理成判断依据

## 不适用边界

- 读书、课程、讲座、概念理解 → 用 deep-notes
- 会议纪要整理 → 用 meeting-notes
- 两种目标都合理且无法判断主目标时，问用户：「你最终更希望理解这个主题，还是据此做出决策？」

## 核心 Job

围绕一个明确的调研问题，收集并验证证据，区分事实/推断/假设/建议，最终给出可执行的判断。

## 事实与证据规则（违反即为不合格）

1. **明确调研问题**：开头必须写出用户真正想问的问题，不是主题名词。
2. **区分四类陈述**：
   - 事实：有来源的关键数据、官方声明、可验证信息
   - 推断：基于事实的合理推论，明确标注「推断」
   - 假设：尚未验证的前提，明确标注「假设」
   - 建议：基于前三种信息的行动建议，明确标注「建议」
3. **不编造**：没来源的精确数字、人名、年份、政策名称不写精确值；写范围或标注「待确认」。
4. **来源可见**：关键事实必须列出来源或搜索依据；内部文档/截图单独标注。

## 输出结构契约

单文件 HTML，浅色主题，结构固定为：

1. **Hero**：调研问题（一句话）、日期、方法、阅读时长
2. **三问法导航**：是什么 / 为什么 / 怎么做（锚点跳转）
3. **关键指标**：3-4 个核心数字卡片
4. **是什么**：概念/方案/竞品定义、组成、分类
5. **为什么**：背景、痛点、不做/不选的后果、时机
6. **怎么做**：具体方案、步骤、资源、成本、时间
7. **方案比较**（如适用）：多方案并列对比，含优劣势
8. **风险、限制与未知项**：明确列出不确定性和风险
9. **决策卡**：推荐结论 + 核心理由 + 关键指标 + 行动按钮（装饰）
10. **参考来源**

## HTML 资产和构建方式

模板和公共资产在 `assets/`，运行时不读取 `deep-notes` 或其他 skill。

构建四步：

1. `Copy-Item assets\template.html x.draft.html`
2. 填 `<title>`、data-theme（默认 `green`，可选 `purple|blue|orange|gold|pink`），正文写进 `<main>`；两个哨兵 `/*__DN_CSS__*/`、`/*__DN_JS__*/` 原样保留、各一次
3. `node assets\build.js x.draft.html` → 产出 `x.html`
4. 仅在没有 Node 时，手工把两个哨兵替换为 `components.css`、`components.js` 全文

**禁止**：手写 CSS/JS 覆盖公共样式；自创 `.hero-tag`、`.hero-stats` 等替代类名；把读书笔记式自测塞进来。

## 组件类名契约（猜不出来，必须照抄）

- 结构：`hero` / `hero__inner` / `hero__eyebrow` / `hero__title` / `hero__summary` / `hero__meta`、`three-qs`、`main`、`section`
- 指标：`stats` / `stat` / `stat__num` / `stat__label`
- 提示框：`callout callout--insight|warn|danger|info`
- 表格：`table-wrap` + `<table>`
- 徽章：`badge badge--green|orange|red|blue|gray|purple`
- 对比：`comparison` / `comparison__card`
- 时间线：`timeline` / `timeline__item` / `timeline__time` / `timeline__title` / `timeline__desc`
- 可折叠：`collapsible` / `collapsible__head` / `collapsible__arrow` / `collapsible__body`（只用于非核心细节，正文主线默认展开）
- 待办：`todo` / `todo__item` / `todo__box` / `todo__text` / `todo__meta`
- 决策卡：`decision-card` / `decision-card__label` / `decision-card__reasons` / `decision-card__reason` / `decision-card__reason-num` / `decision-card__reason-text` / `decision-card__metrics` / `decision-card__metric` / `decision-card__actions` / `decision-card__btn`
- 页脚：`footer`

## 交付前自查（5 条）

- 调研问题是否在 Hero 第一屏就明确写出？
- 是否区分了事实、推断、假设和建议？
- 是否有方案比较、风险和决策卡？
- 是否没有加入 deep-notes 式自测、九拍框架或为了高级感的交互？
- 成品是单个 HTML、无哨兵残留、双击能开吗？
