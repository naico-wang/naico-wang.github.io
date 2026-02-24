---
title: AGENTS.md
position: 4
---

# AGENTS.md 规范

> AGENTS.md 不是提示词，而是 Contract。不是表达模型应该如何思考，而是规定它如何工作、如何输出、如何被审计、如何被回滚。

AGENTS.md 是用于智能体定义“角色、能力、工具、边界、工作流”的工程化规范文档。它不是提示词，而是可执行的操作手册，确保智能体行为可控、可复现、可测试。

高质量 AGENTS.md 必须覆盖六个核心工程要素，以下内容将逐一介绍。

**六大工程要素**

- Commands（可执行命令）
- Testing（测试能力）
- Project Structure（项目结构）
- Code Style（代码示例）
- Git Workflow（版本与提交规范）
- Boundaries（操作边界）

## 身份定义（Identity）

本节用于明确智能体的身份信息，包括名称、角色、专长、技术栈和服务对象。

- name:
- role:
- specialization:
- tech-stack:
- audience:

例如：

```text
你是一个 React 18 + TypeScript + Vite 项目的测试工程师，负责产出高覆盖率的 Jest 与 Playwright 测试。
```

## 可执行命令（Commands）

智能体依赖可执行命令完成任务，是最重要的工程化规范。下方列举常见命令，实际项目需根据需求补充。

- `npm test --silent`
- `pytest -v`
- `npm run build`
- `npx markdownlint docs/`
- `npm run dev`

## 项目知识（Project Knowledge）

本节介绍智能体需了解的项目结构和技术栈。

### 文件结构（File Structure）

以下是常见的项目目录及其用途：

- `src/` – 读取源代码
- `tests/` – 写入测试
- `docs/` – 写入文档
- `scripts/` – 项目辅助脚本
- `config/` – 禁止修改

### 框架与版本（Framework & Versions）

智能体需知晓项目所用技术及版本：

- React 18
- TypeScript 5.x
- Vite 5
- Tailwind CSS 3.x
- Jest + Playwright

## 职责范围（Responsibilities）

智能体必须清楚自身职责边界，确保输出内容规范且高效。

- 阅读与分析代码
- 生成文档或测试
- 根据命令校验生成内容
- 提供优化建议
- 遵循统一风格规范
- 保持输出一致性、结构化

## 输出风格（Output Style）

本节通过示例说明智能体输出内容的格式要求。

**文档 Agent 示例**

以下代码块展示如何编写 API 文档：

```markdown
## fetchUserById

获取用户信息。

### 示例
```ts
const user = await fetchUserById("123");
```

### 参数

- id: string – 用户 ID

### 返回

- Promise
~~~

**测试 Agent 示例**

以下代码块展示测试用例的标准格式：

```ts
test("should return the correct total", () => {
  const total = calculateTotal([1, 2, 3]);
  expect(total).toBe(6);
});
```

## 三层边界模型（Boundaries）

智能体操作需遵循三层边界模型，确保安全与规范。

### 必须执行（Always do）

- 写入 docs/ 或 tests/
- 使用命令验证输出
- 严格按照代码示例格式化

### 需先询问（Ask first）

- 增加新依赖
- 修改项目配置
- 重写已有文档的大段内容

### 禁止操作（Never do）

- 修改 src/（如果 agent 非开发 agent）
- 删除 failing tests
- 修改 config/ 与 CI/CD
- 提交 secrets

## 错误处理（Error Handling）

智能体遇到异常情况时需采取安全措施，避免误操作。

- 遇到不确定情况返回最小安全行动
- 不强行猜测未知依赖或 API
- 错误输出必须包含解释与替代方案
- 路径不存在时必须中止并提示

## Git 工作流（Git Workflow）

智能体需遵循规范的 Git 工作流，保证协作与代码质量。

- 所有写入必须通过 PR
- 使用原子提交
- 分支规范：
  - `feature/docs-xxx`
  - `test/fix-xxx`

## 智能体定义完整示例（Example Agent Definition）

以下 YAML 代码块展示了一个文档智能体的完整定义：

```yaml
name: docs_agent
description: Expert documentation writer for this repository
```

**Persona**

- 精通 Markdown
- 理解 TypeScript
- 从 src/ 读取代码生成 docs/ 文档

**Commands**

- `npm run docs:build`
- `npx markdownlint docs/`

**File Structure**

- 读取：src/
- 写入：docs/
- 禁止：config/

**Boundaries**

- Always：写入 docs/，运行 lint
- Ask first：结构性重写
- Never：修改 src/

## 质量检查清单（Quality Checklist）

本节列出 AGENTS.md 规范的检查要点，确保文档工程化标准。

- 是否定义了专精 persona？
- 是否提供明确可执行命令？
- 是否包含真实代码示例？
- 是否标注边界与禁区？
- 是否声明项目结构？
- 是否覆盖六大工程要素？

满足以上所有条件的 AGENTS.md 才能作为生产级规范使用。

## 总结

AGENTS.md 规范为智能体开发提供了结构化、可执行的工程标准，确保团队协作高效、输出一致。通过明确定义身份、命令、项目知识、职责、输出风格、边界、错误处理与 Git 工作流，智能体行为变得可控且易于维护，是智能体工程化的核心基础。