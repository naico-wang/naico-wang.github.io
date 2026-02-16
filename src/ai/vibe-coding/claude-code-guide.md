---
title: Claude Code 使用指南
---

# Claude Code 完整使用指南

:::info 文档说明
本文档提供了 Claude Code 的完整使用指南，包括安装配置、基础使用、高级功能以及最佳实践。Claude Code 是一个智能化的编程助手工具，可以通过自然语言命令帮助开发者更高效地完成编程任务。
:::

## 1. 简介

Claude Code 是一个智能化的编程助手工具，运行在终端中，能够理解您的代码库，并通过执行常规任务、解释复杂代码和处理 Git 工作流来帮助您更快地编写代码——所有这些都通过自然语言命令完成。

### 核心能力

- **代码理解**：深度理解项目结构和上下文
- **任务执行**：自动化执行常见的开发任务
- **Git 集成**：无缝的 Git 工作流管理
- **自然语言界面**：使用纯中文或英文进行交互
- **可扩展性**：通过技能、插件和 MCP 服务器实现自定义功能

## 2. Claude Code 概述

### 核心概念

Claude Code 基于以下核心概念运行：

| 概念              | 描述                                        |
|------------------|----------------------------------------------|
| **工具 (Tools)**   | 内置功能，如读取文件、运行命令、编辑代码             |
| **技能 (Skills)**  | 领域特定的知识和模式，指导 Claude 的行为                     |
| **代理 (Agents)**  | 处理复杂多步骤任务的自主子进程                              |
| **插件 (Plugins)** | 包含命令、代理、技能和钩子的可扩展包                           |
| **MCP 服务器**      | 通过模型上下文协议 (Model Context Protocol) 进行的外部服务集成 |

### 工作流程

```mermaid
flowchart TD
    A[用户输入] --> B[Claude Code<br/>主代理]
    B --> C[工具执行<br/>读取、编辑、Bash 等]
    C --> D[技能/插件指导]
    D --> E{MCP 服务器<br/>已配置?}
    E -->|是| F[MCP 服务器集成]
    E -->|否| G[输出给用户]
    F --> G
```

## 3. 安装与配置

### 安装方法

#### macOS/Linux (推荐)

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

#### Homebrew

```bash
brew install --cask claude-code
```

#### Windows (推荐)

```powershell
irm https://claude.ai/install.ps1 | iex
```

#### WinGet

```powershell
winget install Anthropic.ClaudeCode
```

### 初始配置

创建 `~/.claude/settings.json` 文件进行全局配置：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-api-token-here",
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
    "API_TIMEOUT_MS": "300000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  },
  "hasCompletedOnboarding": true
}
```

:::warning 重要提示
请将 `your-api-token-here` 替换为您的实际 API 令牌。您可以从 Anthropic 官网获取 API 密钥。
:::

### 环境变量

| 变量名 | 用途 | 默认值 |
|--------|------|--------|
| `ANTHROPIC_AUTH_TOKEN` | API 认证令牌 | 必需 |
| `ANTHROPIC_BASE_URL` | API 端点 URL | `https://api.anthropic.com` |
| `API_TIMEOUT_MS` | 请求超时时间（毫秒） | `120000` |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 禁用分析统计 | `0` |

## 4. 基础使用

### 启动 Claude Code

```bash
# 进入您的项目目录
cd /path/to/your/project

# 启动 Claude Code
claude
```

### 常用命令

#### 文件操作

```bash
# 读取文件
"读取 README.md 文件"

# 编辑文件
"将 package.json 中的版本更新为 2.0.0"

# 创建新文件
"创建一个名为 utils/helpers.js 的新文件"
```

#### 代码分析

```bash
# 解释代码
"解释认证函数的工作原理"

# 查找代码
"查找代码库中所有的数据库查询"

# 代码审查
"审查拉取请求的更改，查找安全问题"
```

#### Git 操作

```bash
# 查看状态
"显示当前的 git 状态"

# 创建提交
"创建一个带有描述性消息的提交"

# 创建拉取请求
"为当前分支创建拉取请求"
```

#### 开发任务

```bash
# 运行测试
"运行测试套件并修复所有失败"

# 构建项目
"构建项目并解决所有错误"

# 安装依赖
"安装此项目所需的依赖"
```

### 斜杠命令

Claude Code 提供内置的斜杠命令：

| 命令                       | 描述       |
|--------------------------|----------|
| `/help`                  | 显示帮助信息   |
| `/clear`                 | 清除对话历史   |
| `/settings`              | 打开设置配置   |
| `/bug`                   | 报告错误或问题  |
| `/plugin install <name>` | 安装插件     |
| `/plugin list`           | 列出已安装的插件 |
| `/plugin remove <name>`  | 移除插件     |
| `/status`                | 查看当前模型状态 |

## 5. MCP 服务器集成

### 什么是 MCP？

**MCP（模型上下文协议，Model Context Protocol）** 是一个标准协议，用于将 Claude Code 连接到外部服务、API、数据库和工具。MCP 服务器暴露工具，使 Claude Code 可以在本地环境之外执行操作。

### MCP 服务器类型

| 类型 | 描述 | 使用场景 |
|------|------|----------|
| **stdio** | 标准输入/输出通信 | 本地工具、数据库 |
| **SSE** | 带 OAuth 的服务器发送事件 | 云服务（Asana、Google） |
| **HTTP** | REST API 端点 | 可通过 HTTP 访问的服务 |
| **WebSocket** | 实时双向通信 | 实时数据流 |

### 配置 MCP 服务器

#### 方法一：项目级 `.mcp.json`

在项目根目录创建 `.mcp.json` 文件：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/allowed/path"
      ],
      "disabled": false,
      "alwaysAllow": ["read_file", "write_file"]
    },
    "postgres": {
      "command": "uvx",
      "args": [
        "--from",
        "mcp-postgres",
        "mcp-postgres",
        "postgresql://user:password@localhost:5432/dbname"
      ],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:password@localhost:5432/dbname"
      },
      "disabled": false
    }
  }
}
```

#### 方法二：插件集成

在 `plugin.json` 中添加 MCP 服务器：

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "mcpServers": {
    "my-service": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/server/index.js"],
      "disabled": false
    }
  }
}
```

### MCP 服务器配置字段

| 字段 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `command` | string | 是* | 启动服务器的命令（stdio） |
| `args` | array | 是* | 命令的参数 |
| `url` | string | 是* | 服务器 URL（HTTP/SSE/WebSocket） |
| `env` | object | 否 | 环境变量 |
| `disabled` | boolean | 否 | 禁用服务器（默认：false） |
| `alwaysAllow` | array | 否 | 不需要批准的工具列表 |

:::tip 提示
`command`、`args` 和 `url` 字段中，根据传输类型（stdio、HTTP、SSE、WebSocket）至少需要提供一组。
:::

### 使用 MCP 工具

配置完成后，MCP 工具即可供 Claude Code 使用：

```bash
# 查询数据库
"查询 users 表中所有活跃账户"

# 从外部 API 读取
"从 GitHub API 获取最新问题"

# 访问项目外的文件系统
"从 /etc/myapp/config.json 读取配置文件"
```

### 环境变量扩展

Claude Code 支持在 MCP 配置中使用变量扩展：

| 变量 | 描述 |
|------|------|
| `${CLAUDE_PLUGIN_ROOT}` | 插件目录的绝对路径 |
| `${USER_DEFINED_VAR}` | 用户定义的环境变量 |

示例：

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/dist/server.js"],
      "env": {
        "API_KEY": "${MY_API_KEY}",
        "CONFIG_PATH": "${CLAUDE_PLUGIN_ROOT}/config.json"
      }
    }
  }
}
```

### MCP 服务器示例

#### stdio 服务器（本地数据库）

```json
{
  "postgres": {
    "command": "uvx",
    "args": [
      "--from",
      "mcp-postgres",
      "mcp-postgres",
      "postgresql://localhost/mydb"
    ],
    "disabled": false
  }
}
```

#### SSE 服务器（OAuth - Asana）

```json
{
  "asana": {
    "url": "https://mcp.asana.com/sse",
    "transport": "sse",
    "auth": {
      "type": "oauth",
      "provider": "asana",
      "client_id": "your-client-id"
    },
    "disabled": false
  }
}
```

#### HTTP 服务器（REST API）

```json
{
  "custom-api": {
    "url": "https://api.example.com/mcp",
    "transport": "http",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}"
    },
    "disabled": false
  }
}
```

### MCP 工具使用模式

当 MCP 工具可用时，Claude Code 可以：

1. **查询数据库**：通过 MCP 数据库服务器执行 SQL 查询
2. **访问外部 API**：通过 MCP API 服务器发起 HTTP 请求
3. **读写文件**：通过 MCP 文件系统服务器访问项目范围外的文件
4. **执行外部工具**：通过 MCP 工具服务器运行专用工具

### 集成 Language Server Protocol (LSP)

**LSP（Language Server Protocol）** 是一种协议，用于在开发工具（如编辑器或 IDE）和语言服务器之间通信，提供代码补全、诊断、定义跳转等功能。通过 MCP 集成 LSP，Claude Code 可以获得语言级别的代码理解能力。

#### LSP 的优点

| 优点 | 描述 |
|------|------|
| **精确代码分析** | 利用语言服务器的语法树和语义分析，精确理解代码结构 |
| **智能代码补全** | 基于上下文和类型信息提供准确的代码建议 |
| **实时错误检测** | 通过语言服务器的诊断功能发现潜在的代码问题 |
| **跨语言支持** | 支持多种编程语言（TypeScript、Python、Go、Rust 等） |
| **统一接口** | 使用标准的 LSP 协议，兼容各种语言服务器 |

#### 配置 LSP MCP 服务器

在 `.mcp.json` 中添加 LSP 服务器配置：

```json
{
  "mcpServers": {
    "typescript-lsp": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-typescript",
        "/path/to/your/project"
      ],
      "disabled": false
    },
    "pyright-lsp": {
      "command": "npx",
      "args": [
        "-y",
        "pyright-langserver",
        "--stdio"
      ],
      "disabled": false
    },
    "gopls": {
      "command": "gopls",
      "args": ["serve"],
      "disabled": false
    }
  }
}
```

#### 使用 LSP 功能

配置完成后，Claude Code 可以利用 LSP 提供的语言服务：

```bash
# 获取代码诊断
"检查 src/index.ts 文件中的类型错误和警告"

# 查找定义
"找到 User 接口的定义位置"

# 代码补全建议
"为这个函数提供实现建议"

# 重构建议
"建议如何重构这个复杂的函数"

# 符号查找
"列出当前文件中的所有导出符号"
```

#### 支持的语言服务器

| 语言 | 服务器 | MCP 包 |
|------|--------|--------|
| TypeScript/JavaScript | `typescript-language-server` | `@modelcontextprotocol/server-typescript` |
| Python | `pyright` | 自定义 MCP 包装器 |
| Go | `gopls` | 自定义 MCP 包装器 |
| Rust | `rust-analyzer` | 自定义 MCP 包装器 |
| Java | `jdt.ls` | 自定义 MCP 包装器 |
| C/C++ | `clangd` | 自定义 MCP 包装器 |

#### 最佳实践

1. **按需启用**：只为项目实际使用的语言启用相应的 LSP 服务器
2. **性能优化**：对于大型项目，配置 LSP 服务器的缓存和工作区限制
3. **版本管理**：确保语言服务器版本与项目依赖兼容
4. **环境隔离**：使用项目本地的语言服务器安装，避免全局污染

## 6. 技能系统 (Skills)

### 什么是技能？

技能是领域特定的知识包，为特定任务提供指导、模式和最佳实践。它们包含：

- **SKILL.md**：包含使用说明的核心文档
- **Rules/**：详细的实现模式
- **Examples/**：可运行的代码示例
- **References/**：补充文档

### 技能位置

技能从以下两个位置加载：

1. **系统技能**：`~/.claude/skills/` (`~/.cursor/skills/`)
2. **插件技能**：`~/.claude/plugins/*/skills/`

### 当前我们可用的 Agent Skills

:::info Gitlab 地址
[Technology-Coding-AgentSkills](https://gitlab.lululemon.cn/technology/coding/agent-skills)
:::

| 技能                           | 用途                 | 触发关键词                                     |
|------------------------------|--------------------|-------------------------------------------|
| `api-design-specialist`      | RESTful API 设计     | "API design", "OpenAPI", "REST API"       |
| `nodejs-service-builder`     | Node.js 后端开发       | "Node.js", "Express", "NestJS", "backend" |
| `react-best-practices`       | React/Next.js 性能优化 | "React", "Next.js", "performance"         |
| `vue-best-practices`         | Vue 3 最佳实践         | "Vue", "Vue 3", "component"               |
| `technical-document-writer`  | 技术文档编写             | "document", "design", "architecture"      |
| `web-application-builder`    | React 网站标准         | "web app", "React website"                |
| `web-interface-guidelines`   | UI/UX 指南           | "interface", "UI", "accessibility"        |
| `wechat-miniprogram-builder` | 微信小程序开发            | "miniprogram", "wechat", "wmp"            |

### 使用技能

技能会根据上下文自动加载：

```bash
# 触发 react-best-practices 技能
"优化这个 React 组件的性能"

# 触发 api-design-specialist 技能
"设计一个用户管理的 REST API"

# 触发 technical-document-writer 技能
"为这个系统创建架构设计文档"
```

### 创建自定义技能

#### 技能结构

```
my-skill/
├── SKILL.md                 # 主要技能文档
├── rules/                   # 详细的实现规则
│   ├── rule1.md
│   └── rule2.md
├── examples/                # 可运行的示例
│   └── example1.ts
└── references/              # 补充文档
    └── external-doc.md
```

#### SKILL.md 模板

```markdown
# 我的自定义技能

## 概述
简要描述此技能的作用和使用时机。

## 触发关键词
列出会触发此技能加载的关键词：
- "关键词1"
- "关键词2"
- "带 * 通配符的模式"

## 核心概念

### 概念 1
第一个核心概念的解释。

### 概念 2
第二个核心概念的解释。

## 使用指南

### 何时使用此技能
在以下情况下使用此技能：
- 条件 1
- 条件 2

### 常见模式

#### 模式 1
描述和代码示例。

#### 模式 2
描述和代码示例。

## 最佳实践

1. 实践 1
2. 实践 2
3. 实践 3

## 示例命令

## 参考资料

- [参考 1](链接)
- [参考 2](链接)
```

### 技能开发最佳实践

1. **强触发词**：使用能可靠指示技能相关性的特定短语
2. **渐进式披露**：从基础开始，按需提供详细信息
3. **可运行示例**：包含可直接复制粘贴的代码示例
4. **清晰结构**：使用一致的格式和组织方式
5. **第三人称**：使用第三人称编写技能描述（"此技能应在...时使用"）

## 7. 规则配置

### 什么是规则？

规则是技能提供的详细实现模式和指南。它们包含特定的代码模式、需要避免的反模式以及实现指导。

### 规则组织

规则存储在技能的 `rules/` 子目录中：

```
skill-name/
├── SKILL.md
└── rules/
    ├── pattern1.md
    ├── pattern2.md
    └── category/
        ├── subpattern1.md
        └── subpattern2.md
```

### 规则文件结构

```markdown
# 规则标题

**类别**： [类别名称]
**严重程度**： [必须 | 应该 | 可以]

## 问题
问题或反模式的描述。

## 解决方案
推荐的解决方案和代码示例。

### 之前
    ```javascript
    // 不好的代码示例
    ```

### 之后
    ```javascript
    // 好的代码示例
    ```

## 解释
为什么这种模式更好。

## 相关规则
- [相关规则 1](链接)
- [相关规则 2](链接)
```

### 规则示例（React 性能）

```markdown
# 记忆化昂贵计算

**类别**： JavaScript 优化
**严重程度**： 应该

## 问题
在渲染中重新计算昂贵的值会导致不必要的性能开销。

## 解决方案
使用 `useMemo` 缓存昂贵的计算。

### 之前
    ```javascript
    function ProductList({ products, filter }) {
      const filtered = products.filter(p =>
        p.category === filter.category &&
        p.price <= filter.maxPrice
      );
      return <div>{filtered.map(p => <Product key={p.id} {...p} />)}</div>;
    }
    ```

### 之后
    ```javascript
    function ProductList({ products, filter }) {
      const filtered = useMemo(() =>
        products.filter(p =>
          p.category === filter.category &&
          p.price <= filter.maxPrice
        ),
        [products, filter]
      );
      return <div>{filtered.map(p => <Product key={p.id} {...p} />)}</div>;
    }
    ```

## 解释
`useMemo` 只在依赖项改变时重新计算，避免在每次渲染时进行不必要的工作。

## 相关规则
- [缓存函数结果](cache-function-results.md)
- [合并迭代](combine-iterations.md)
```

### 加载规则

当检测到相关上下文时，技能会自动加载规则。您也可以显式引用规则：

```bash
"将 memoize-expensive-computations 规则应用到此组件"
```

### 创建自定义规则

1. **识别模式**：确定规则要解决的问题
2. **定义严重程度**：根据重要性使用 Must/Should/May
3. **提供示例**：展示前后代码对比
4. **解释原因**：帮助开发者理解原理
5. **链接相关规则**：连接到相关模式


## 8. 插件系统

### 什么是插件？

插件是可扩展的包，可以包含：

- **命令 (Commands)**：用于特定任务的斜杠命令
- **代理 (Agents)**：自主子进程
- **技能 (Skills)**：领域特定知识
- **钩子 (Hooks)**：事件驱动的自动化
- **MCP 服务器**：外部服务集成

### 安装插件

```bash
# 从市场安装
claude /plugin install plugin-name@claude-code-marketplace

# 列出已安装的插件
claude /plugin list

# 移除插件
claude /plugin remove plugin-name
```

### 插件结构

```
my-plugin/
├── plugin.json              # 插件清单
├── README.md                # 插件文档
├── commands/                # 斜杠命令
│   └── my-command.md
├── agents/                  # 自主代理
│   └── my-agent.md
├── skills/                  # 技能
│   └── my-skill/
│       └── SKILL.md
├── hooks/                   # 事件钩子
│   └── my-hook.sh
└── scripts/                 # 工具脚本
    └── validate.sh
```

### 插件清单 (plugin.json)

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "此插件功能的描述",
  "author": "作者名称",
  "license": "MIT",
  "commands": ["commands/my-command.md"],
  "agents": ["agents/my-agent.md"],
  "skills": ["skills/my-skill"],
  "hooks": ["hooks/hooks.json"],
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/server.js"]
    }
  }
}
```

### 热门插件

| 插件 | 描述 |
|------|------|
| `plugin-dev` | 插件开发工具包 |
| `code-review` | 自动化代码审查 |
| `feature-dev` | 功能开发工作流 |
| `commit-commands` | 增强的 Git 提交工具 |
| `pr-review-toolkit` | 拉取请求审查辅助工具 |

### 创建插件

使用 plugin-dev 工具包：

```bash
# 启动插件创建工作流
/plugin-dev:create-plugin

# 按照引导步骤操作
# 1. 发现 - 理解插件目的
# 2. 组件规划 - 确定所需组件
# 3. 详细设计 - 指定每个组件
# 4. 结构创建 - 设置目录
# 5. 组件实现 - 创建组件
# 6. 验证 - 运行验证检查
# 7. 测试 - 验证功能
# 8. 文档 - 完成文档编写
```

---

## 9. 效率最佳实践

### 有效的提示编写

#### 要具体明确

```bash
# 模糊
"让这段代码更好"

# 具体
"通过记忆化昂贵计算和减少重新渲染来优化这个 React 组件"
```

#### 提供上下文

```bash
# 好的
"使用 express-rate-limit 包更新认证中间件以包含速率限制"

# 更好的（带上下文）
"我们正在构建一个每分钟处理 10,000 个请求的 Express API。使用 express-rate-limit 更新 src/middleware/auth.ts 中的认证中间件以包含速率限制。设置为每个 IP 地址每 15 分钟 100 个请求。"
```

#### 使用示例

```bash
"按以下格式格式化响应：

## 摘要
[简要摘要]

## 所做的更改
- [更改 1]
- [更改 2]"
```

### 工作流优化

#### 1. 使用 /commands 处理重复任务

为常见工作流创建自定义命令：

```markdown
---
description: 运行完整测试套件并修复失败
argument-hint: [可选测试模式]
---
运行测试套件并修复所有失败。如果提供了模式，则仅运行匹配的测试。
```

#### 2. 适当利用技能

了解不同任务应使用哪些技能：

| 任务 | 使用技能 |
|------|----------|
| API 开发 | `api-design-specialist` |
| React 组件 | `react-best-practices` |
| Vue 组件 | `vue-best-practices` |
| 后端服务 | `nodejs-service-builder` |
| 文档编写 | `technical-document-writer` |

#### 3. 批量处理相似操作

```bash
# 不要这样做：
"更新所有导入以使用 barrel 文件"
"更新所有函数名称为 camelCase"
"更新所有类名称为 PascalCase"

# 应该这样做：
"重构此代码库：
1. 对所有本地模块使用 barrel 导入
2. 将所有函数名称转换为 camelCase
3. 将所有类名称转换为 PascalCase"
```

#### 4. 使用钩子实现自动化

创建钩子以自动化重复验证：

```bash
#!/bin/bash
# hooks/pre-tool-use/validate-file-path.sh
# 防止在项目目录外写入

FILE_PATH=$(echo "$CLAUDE_TOOL_INPUT" | jq -r '.file_path')
PROJECT_ROOT="$(git rev-parse --show-toplevel)"

if [[ "$FILE_PATH" != "$PROJECT_ROOT"* ]]; then
  echo '{"approved": false, "message": "无法在项目目录外写入"}'
  exit 0
fi

echo '{"approved": true}'
```

### 项目组织

#### 推荐的目录结构

```
project/
├── .claude/                 # Claude Code 配置
│   └── project.local.md     # 项目特定规则
├── src/                     # 源代码
├── docs/                    # 文档
└── .mcp.json                # MCP 服务器配置
```

#### 项目特定配置

创建 `.claude/project.local.md`：

```markdown
---
projectContext: |
  这是一个使用以下技术的 Next.js 电商应用：
  - 前端：Next.js 14, React 18, TypeScript
  - 后端：Node.js, Express
  - 数据库：PostgreSQL
  - 缓存：Redis

codeStyle: |
  - 使用带 hooks 的函数组件
  - 优先使用组合而非继承
  - 遵循 React 性能优化模式
  - 使用 @/ 前缀的绝对导入

testingGuidelines: |
  - 为所有工具函数编写单元测试
  - 为 API 端点编写集成测试
  - 为关键用户流程编写 E2E 测试
  - 目标代码覆盖率为 80%
---
```

### 协作

#### 共享 MCP 服务器配置

提交 `.mcp.json` 时排除敏感值：

```json
{
  "mcpServers": {
    "postgres": {
      "command": "uvx",
      "args": [
        "--from",
        "mcp-postgres",
        "mcp-postgres",
        "${DATABASE_URL}"
      ],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

#### 共享技能和插件

1. 用清晰的说明文档化自定义技能
2. 为插件使用语义化版本控制
3. 在 README 中提供使用示例
4. 包含用于验证的测试用例

### 性能提示

#### 1. 优化上下文使用

```bash
# 效率较低
"分析整个代码库的安全问题"

# 效率较高
"分析 src/auth/ 中的认证模块，查找 SQL 注入漏洞"
```

#### 2. 使用特定工具

```bash
# 不够精确
"查找所有返回用户数据的函数"

# 更精确（使用 Grep）
"使用 Grep 模式 'return.*user' 查找所有返回用户数据的函数"
```

#### 3. 缓存 MCP 连接

尽可能配置 MCP 服务器使用连接池，以避免重复的身份验证开销。

---

## 10. 高级功能

### 代理 (Agents)

代理是处理复杂多步骤任务的自主子进程：

#### 可用的代理类型

| 代理 | 用途 |
|------|------|
| `bash` | 命令执行专家 |
| `general-purpose` | 通用研究和编码任务 |
| `explore` | 快速代码库探索 |
| `plan` | 实现规划 |
| `claude-code-guide` | Claude Code 和 SDK 帮助 |

#### 使用代理

```bash
# 启动通用代理
启动一个代理来研究此代码库中的认证模式

# 启动探索代理
探索代码库以查找所有 API 端点

# 启动规划代理
进入规划模式以设计用户认证系统
```

#### 创建自定义代理

```markdown
---
name: my-agent
description: |
  专门处理数据库模式迁移的代理。
  当您需要分析、设计或执行数据库模式更改时使用此代理。
model: sonnet
color: blue
tools:
  - Read
  - Write
  - Bash
  - Edit
  - Grep
---

您是一个数据库迁移专家。您的职责是：

1. 分析现有数据库模式
2. 设计迁移脚本
3. 验证迁移安全性
4. 使用适当的回滚计划执行迁移

在处理迁移时，始终：
- 审查现有的模式更改
- 考虑数据完整性
- 创建回滚脚本
- 先在开发环境测试
```

### 钩子 (Hooks)

钩子允许您拦截和响应 Claude Code 事件：

#### 钩子事件

| 事件 | 描述 |
|------|------|
| `PreToolUse` | 工具执行之前 |
| `PostToolUse` | 工具完成之后 |
| `Stop` | Claude Code 停止时 |
| `SessionStart` | 会话开始时 |
| `SessionEnd` | 会话结束时 |
| `UserPromptSubmit` | 用户提交提示时 |

#### 钩子配置

创建 `hooks/hooks.json`：

```json
{
  "hooks": [
    {
      "name": "validate-file-writes",
      "event": "PreToolUse",
      "script": "hooks/validate-write.sh",
      "toolName": "Write"
    },
    {
      "name": "load-context",
      "event": "SessionStart",
      "script": "hooks/load-context.sh"
    }
  ]
}
```

#### 钩子脚本示例

```bash
#!/bin/bash
# hooks/validate-write.sh

TOOL_NAME=$(echo "$CLAUDE_TOOL_NAME" | jq -r '.')
FILE_PATH=$(echo "$CLAUDE_TOOL_INPUT" | jq -r '.file_path')

# 防止写入生产配置
if [[ "$FILE_PATH" == *"production"* && "$TOOL_NAME" == "Write" ]]; then
  echo '{"approved": false, "message": "无法直接写入生产配置文件"}'
  exit 0
fi

echo '{"approved": true}'
```

### 状态行配置

自定义 Claude Code 状态行：

```bash
# 启用状态行
/settings statusline.enabled true

# 设置格式
/settings statusline.format "{model} | {context}"

# 启用任务显示
/settings statusline.showTasks true
```

---

## 11. 故障排查

### 常见问题

#### 问题：MCP 服务器无法连接

**症状**：MCP 工具不可用，连接错误

**解决方案**：
1. 检查服务器是否运行：`ps aux | grep <server-name>`
2. 验证 `.mcp.json` 中的配置语法
3. 检查环境变量是否已设置
4. 启用调试模式：`claude --debug`

#### 问题：技能未加载

**症状**：预期的技能指导未出现

**解决方案**：
1. 验证技能是否在正确位置（`~/.claude/skills/`）
2. 检查 `SKILL.md` 是否有有效的 YAML 前置元数据
3. 显式使用触发关键词
4. 检查技能是否在设置中被禁用

#### 问题：工具权限被拒绝

**症状**："访问被拒绝" 或 "禁止" 错误

**解决方案**：
1. 检查文件权限
2. 验证您是否在正确的目录中
3. 检查是否有钩子阻止工具使用
4. 审查 `alwaysAllow` 配置

#### 问题：性能缓慢

**症状**：响应缓慢，等待时间长

**解决方案**：
1. 减少上下文窗口（提供更具体的提示）
2. 禁用不必要的 MCP 服务器
3. 使用特定工具而非通用搜索
4. 检查网络连接
5. 如需要，增加 `API_TIMEOUT_MS`

### 调试模式

以调试输出运行 Claude Code：

```bash
claude --debug
```

这将显示：
- 工具执行详情
- MCP 服务器通信
- 技能加载信息
- 错误堆栈跟踪

### 获取帮助

1. **内置帮助**：运行 `/help` 查看命令参考
2. **错误报告**：使用 `/bug` 报告问题
3. **社区**：加入 Claude Developers Discord
4. **文档**：访问 [code.claude.com/docs](https://code.claude.com/docs)

### 日志位置

| 平台 | 日志位置 |
|------|----------|
| macOS/Linux | `~/.claude/logs/` |
| Windows | `%APPDATA%\claude\logs\` |

## 12. 个人推荐

:::danger 【免责声明】
以下内容为作者个人观点和建议，非商业推广，作者与推荐内容无任何商业利益关系。用户可根据自身需求自主选择使用，作者不对推荐内容的准确性、适用性或合规性作任何保证。如因使用推荐内容产生任何问题、损失或违反相关政策法规，作者不承担任何责任。
:::

### BIGMODEL GLM-4.7

用8个字概括：量大管饱，便宜实惠。

### 简介

**智谱AI开放平台**（bigmodel.cn）是一个一站式大模型开发平台，提供功能丰富、灵活易用、高性价比的大模型 API 服务。平台支持智能体开发与模型精调、推理、评测等功能，致力于构建高效通用的"一站式模型即服务" AI 开发新范式。

**GLM-4.7** 是智谱AI最新发布的语言模型，基于自回归填空的预训练语言模型架构，支持相对复杂的自然语言指令，并能够解决困难的推理类问题。

### 平台优势

- **模型矩阵**：全模态、全尺寸、低幻觉、高精度
- **开发套件**：覆盖模型与 AI 应用开发，全链路开箱即用
- **深耕场景**：深度耦合业务的应用级 Agent，直达生产力
- **服务保障**：充沛高并发算力资源，多层次安全防护机制

### 在 Claude Code 中接入 GLM Coding Plan

**GLM Coding Plan** 是智谱AI为 Claude Code 提供的编码套餐，搭配使用可以以更低价格获得 **3 倍用量**，让您在编码、调试和工作流管理中更高效、更稳定。

:::info 模型升级提示
在 2025-12-22 日期前已使用的用户请注意：GLM Coding Plan 的默认模型已升级至 GLM-4.7。使用最新配置方式的用户无感知升级。但若您之前在 `settings.json` 中配置过 GLM-4.5 的固定模型映射，请参考下方「常见问题」章节进行调整，以确保使用最新的 GLM-4.7 模型。
:::

#### 步骤一：安装 Claude Code

**前提条件**：
- 需要安装 Node.js 18 或更新版本
- Windows 用户还需安装 Git for Windows

**安装方式**：

```bash
# 在命令行中执行安装命令
npm install -g @anthropic-ai/claude-code

# 验证安装是否成功
claude --version
```

:::tip Cursor 用户
如果您使用 Cursor IDE，可以在 Cursor 中输入以下命令，Cursor 会引导您完成 Claude Code 的安装：
```
https://docs.anthropic.com/zh-CN/docs/claude-code/overview Help me install Claude Code
```
:::

:::warning 权限问题
如果安装过程中遇到权限问题，请尝试：
- macOS/Linux：使用 `sudo` 重新执行安装命令
- Windows：以管理员身份运行命令提示符
:::

#### 步骤二：配置 GLM Coding Plan

**1. 注册账号并获取 API Key**

- 访问 [智谱AI开放平台](https://bigmodel.cn)，点击右上角「注册/登录」完成账号注册
- 登录后，在个人中心页面点击 **API Keys**，创建一个新的 API Key
- 请妥善保管您的 API Key，不要泄露给他人

**2. 配置环境变量**

选择以下**一种方式**进行配置：

**方式一：自动化助手（推荐）**

```bash
# 运行 Coding Tool Helper，按界面提示操作即可自动完成配置
npx @z_ai/coding-helper
```

Coding Tool Helper 是一个编码工具助手，可以快速将您的 GLM 编码套餐加载到编码工具中，自动完成工具安装、套餐配置、MCP 服务器管理等。

**方式二：自动化脚本（仅支持 macOS/Linux）**

```bash
curl -O "https://cdn.bigmodel.cn/install/claude_code_env.sh" && bash ./claude_code_env.sh
```

脚本会自动修改 `~/.claude/settings.json` 配置文件。

**方式三：手动配置（支持所有系统）**

编辑或创建配置文件：

**macOS/Linux**：`~/.claude/settings.json`  
**Windows**：`用户目录/.claude/settings.json`

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your_zhipu_api_key",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  }
}
```

同时编辑或创建 `.claude.json` 文件：

**macOS/Linux**：`~/.claude.json`  
**Windows**：`用户目录/.claude.json`

```json
{
  "hasCompletedOnboarding": true
}
```

:::warning 重要提示
- 请将 `your_zhipu_api_key` 替换为您实际获取的 API Key
- 确保 JSON 文件格式正确（注意逗号、引号等）
- 配置完成后，请重新打开一个新的终端窗口，以便环境配置生效
:::

#### 步骤三：开始使用 Claude Code

1. 进入您的代码工作目录
2. 在终端中执行 `claude` 命令启动 Claude Code
3. 若遇到「Do you want to use this API key」提示，选择 **Yes**
4. 启动后选择信任 Claude Code 访问文件夹里的文件

现在就可以正常使用 Claude Code 进行开发了！

#### 常见问题

**如何切换使用模型**

Claude Code 内部模型环境变量与 GLM 模型对应关系（默认配置）：

| Claude Code 模型 | GLM 模型 |
|----------------|----------|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | `GLM-4.7` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | `GLM-4.7` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | `GLM-4.5-Air` |

如需调整，可在 `~/.claude/settings.json` 中添加：

```json
{
  "env": {
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7"
  }
}
```

:::tip 建议
一般不建议手动调整模型映射，因为硬编码模型映射后，当 GLM Coding Plan 的模型更新升级时，不方便自动更新到最新模型。若想使用最新默认映射，删除 `settings.json` 中的模型映射配置即可。
:::

启动 Claude Code 后，输入 `/status` 命令可确认当前使用的模型状态。

**视觉和搜索 MCP 服务器**

参考以下文档配置 MCP 服务器，配置完成后即可在 Claude Code 中使用：
- [视觉理解 MCP 服务器](https://docs.bigmodel.cn/cn/coding-plan/tool/mcp/vision)
- [联网搜索 MCP 服务器](https://docs.bigmodel.cn/cn/coding-plan/tool/mcp/search)
- [网页读取 MCP 服务器](https://docs.bigmodel.cn/cn/coding-plan/tool/mcp/web-reader)

**手工修改配置不生效**

如果手动修改了配置文件但配置没有生效，请尝试：
1. 关闭所有 Claude Code 窗口，重新打开一个新的命令行窗口，再次运行 `claude` 启动
2. 如果问题仍然存在，可以尝试删除 `~/.claude/settings.json` 文件，然后重新配置环境变量
3. 确认配置文件的 JSON 格式是否正确，可以使用在线 JSON 校验工具进行检查

**推荐的 Claude Code 版本**

建议使用最新版本的 Claude Code：

```bash
# 检查当前版本
claude --version

# 升级到最新版本
claude update
```

:::tip 版本建议
我们在 Claude Code 2.0.14 等版本验证通过，建议使用最新版本以获得最佳体验。
:::

#### 相关资源

- **官方文档**：[智谱AI开放平台文档](https://docs.bigmodel.cn)
- **Claude Code 接入指南**：[在 Claude Code 中使用 GLM Coding Plan](https://docs.bigmodel.cn/cn/coding-plan/tool/claude)
- **体验中心**：[在线体验模型能力](https://bigmodel.cn)
- **模型概览**：查看所有模型的功能定位、价格、上下文长度等信息

---

## 附录 A：配置文件参考

### settings.json

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "string",
    "ANTHROPIC_BASE_URL": "string",
    "API_TIMEOUT_MS": "number",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "number"
  },
  "hasCompletedOnboarding": "boolean",
  "statusline": {
    "enabled": "boolean",
    "format": "string",
    "showTasks": "boolean"
  }
}
```

### .mcp.json

```json
{
  "mcpServers": {
    "serverName": {
      "command": "string",
      "args": ["string"],
      "url": "string",
      "transport": "stdio|sse|http|websocket",
      "env": {
        "VAR": "value"
      },
      "disabled": "boolean",
      "alwaysAllow": ["toolName"]
    }
  }
}
```

### plugin.json

```json
{
  "name": "string",
  "version": "string",
  "description": "string",
  "author": "string",
  "license": "string",
  "commands": ["string"],
  "agents": ["string"],
  "skills": ["string"],
  "hooks": ["string"],
  "mcpServers": {
    "serverName": {
      "command": "string",
      "args": ["string"]
    }
  }
}
```

---

## 附录 B：快速参考命令

### 常见工作流

```bash
# 开始新功能
"创建一个新功能分支并实现使用 JWT 令牌的用户认证"

# 修复错误
"查找并修复 API 在用户注册时返回 500 的错误"

# 代码审查
"审查当前分支的更改，查找安全漏洞和性能问题"

# 文档
"为 src/api/ 中的端点生成 API 文档"

# 重构
"重构认证模块以使用依赖注入"

# 测试
"为 src/utils/ 中的工具函数编写单元测试"

# 部署
"准备应用程序进行生产部署"
```

### MCP 集成示例

```bash
# 数据库查询
"查询 users 表以查找过去 7 天内创建的所有账户"

# 外部 API
"从天气 API 获取上海的最新天气数据"

# 文件操作
"从 /var/log/application/ 读取日志文件以查找最近的错误"
```

---

## 附录 C：术语表

| 术语 | 定义 |
|------|------|
| **代理 (Agent)** | 处理复杂多步骤任务的自主子进程 |
| **钩子 (Hook)** | 响应 Claude Code 事件执行的脚本 |
| **MCP** | 模型上下文协议 - 用于外部服务集成的标准 |
| **MCP 服务器** | 通过 MCP 协议暴露工具的服务 |
| **插件 (Plugin)** | 包含命令、代理、技能、钩子的可扩展包 |
| **规则 (Rule)** | 详细的实现模式或指南 |
| **技能 (Skill)** | 包含模式和最佳实践的领域特定知识包 |
| **工具 (Tool)** | 内置功能，如读取、写入、Bash、编辑 |
| **工具使用 (Tool Use)** | 使用参数执行工具的行为 |

---

更多信息，请访问：
- 官方文档：[https://code.claude.com](https://code.claude.com)
- GitHub 仓库：[https://github.com/anthropics/claude-code](https://github.com/anthropics/claude-code)
- Discord 社区：[https://discord.gg/claude](https://discord.gg/claude)
