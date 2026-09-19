# Steven Skills

个人 TRAE Skill Package，用于本地生成高质量内容产物。

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

当前 TRAE 没有 Skill 商店，安装方式为手动复制：

```bash
# 1. 把本仓库 clone 到本地任意位置
git clone https://github.com/yourname/steven-skills.git

# 2. 复制到目标项目的 .trae/skills/ 目录下
cp -r steven-skills/skills/* <你的项目>/.trae/skills/
```

更新时重复第 2 步即可。

## 性能基线

见 [BASELINE.md](BASELINE.md)。

## 注意

- 本仓库中的 Skill 设计为**本地运行**，Agent 不会远程读取 GitHub。
- 不要把敏感的公司内部信息写进 Skill 的示例或文档里。
