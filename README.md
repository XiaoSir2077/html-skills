# HTML Skills

个人 TRAE HTML Skill Package，用于本地生成高质量内容产物。

## 包含的 Skill

| Skill | Job | 触发场景 |
|---|---|---|
| [deep-notes](skills/deep-notes/) | 帮助理解 | 读书、课程、文章、概念讲解、费曼笔记 |
| [research-report](skills/research-report/) | 帮助决策 | 市场调研、竞品分析、方案比较、商业报告 |

## 设计原则

- **轻量契约卡**：每个 SKILL.md 只保留会改变 Agent 行为的默认值、项目契约和硬边界。
- **自包含**：每个 Skill 内部有完整的 `SKILL.md + assets`，不依赖共享目录或安装脚本。
- **确定性构建**：CSS/JS 通过 `build.js` 注入，Agent 不手写、不复写公共样式。
- **按需读取**：参考资料和示例不进入默认运行路径。

## 安装方式

### npx skills 一键安装（推荐）

前置条件：本机已安装 Node.js 18+。本仓库遵循开放 [Agent Skills 规范](https://skills.sh/)，用通用安装器 [`skills`](https://www.npmjs.com/package/skills) 安装，会自动识别 Trae CN（`~/.trae-cn/skills`）等 70+ 种 Agent。

```bash
# 交互式：自动检测已安装的 Agent，选择装哪些 skill
npx skills add XiaoSir2077/html-skills

# Trae CN 用户一条命令搞定（-g 全局安装，所有项目可用；-y 跳过确认）
npx skills add XiaoSir2077/html-skills -a trae-cn -g -y

# 只装到当前项目（随项目 git 提交，去掉 -g）
npx skills add XiaoSir2077/html-skills -a trae-cn -y

# 先看看仓库里有哪些 skill，不安装
npx skills add XiaoSir2077/html-skills --list
```

安装后重启或重载 TRAE 即可生效。以后更新：

```bash
npx skills update        # 更新所有已安装 skill
npx skills list          # 查看已安装 skill
npx skills remove deep-notes research-report  # 卸载
```

### 手动复制

```bash
# 1. 把本仓库 clone 到本地任意位置
git clone https://github.com/XiaoSir2077/html-skills.git

# 2. 复制到全局或项目级 skill 目录
cp -r html-skills/skills/* ~/.trae-cn/skills/        # 全局（Trae CN）
cp -r html-skills/skills/* <你的项目>/.trae/skills/  # 当前项目
```

## 性能基线

见 [BASELINE.md](BASELINE.md)。

## 注意

- 本仓库中的 Skill 设计为**本地运行**，Agent 不会远程读取 GitHub。
- 不要把敏感的公司内部信息写进 Skill 的示例或文档里。
