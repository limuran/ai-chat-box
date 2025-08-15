# AI Chat Box with Mastra Integration

一个基于 React + Cloudflare Workers + GraphQL + Mastra 框架的现代化 AI 聊天应用，集成了 Claude AI 和代码审查功能。

## 🚀 新功能特性

### Mastra 框架集成
- **智能 Agent 系统**: 自动选择最适合的 AI Agent 处理不同类型的请求
- **代码审查专家**: 专业的代码分析、安全检查和性能优化建议
- **编程助手**: 全能的编程问题解决和技术咨询
- **工具化架构**: 结构化的工具和工作流支持

### 代码审查功能
- 🔍 **深度代码分析**: 质量评分、问题检测、改进建议
- 🔒 **安全性检查**: 识别潜在安全漏洞和风险
- ⚡ **性能优化**: 性能瓶颈分析和优化建议
- 📝 **最佳实践**: 基于行业标准的编程建议
- 🌐 **多语言支持**: 支持 JavaScript、Python、Java、TypeScript 等主流语言

### 技术架构

```
前端 (React + TypeScript)
    ↓ GraphQL
Cloudflare Workers
    ↓ Mastra Framework
Claude AI (Anthropic)
```

## 📦 项目结构

```
ai-chat-box/
├── src/                          # 前端源码
│   ├── components/
│   │   ├── ChatBox.tsx          # 主聊天组件
│   │   └── CodeReviewModal.tsx  # 代码审查模态框
│   └── services/
│       └── graphql.ts           # GraphQL 客户端服务
├── workers/                      # Cloudflare Workers
│   └── src/
│       ├── graphql/             # GraphQL Schema & Resolvers
│       ├── services/
│       │   ├── claude.ts        # Claude AI 服务
│       │   └── mastra.ts        # Mastra 集成服务
│       └── mastra/              # Mastra 配置
│           ├── agents/          # AI Agents
│           └── tools/           # AI 工具
└── README.md
```

## 🛠️ 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone https://github.com/limuran/ai-chat-box.git
cd ai-chat-box

# 安装前端依赖
npm install

# 安装 Workers 依赖
cd workers
npm install
```

### 2. 环境配置

在 `workers` 目录下创建 `.env` 文件：

```env
CLAUDE_API_KEY=your_anthropic_api_key_here
ENVIRONMENT=development
```

### 3. 本地开发

```bash
# 启动前端开发服务器
npm run dev

# 启动 Workers 开发服务器
cd workers
npm run dev
```

### 4. 部署到 Cloudflare

```bash
# 配置 Cloudflare API Key
cd workers
npx wrangler login

# 设置环境变量
npx wrangler secret put CLAUDE_API_KEY

# 部署 Workers
npm run deploy

# 部署前端 (使用 Cloudflare Pages)
cd ..
npm run build
# 将 dist 目录部署到 Cloudflare Pages
```

## 🎯 使用指南

### 基础聊天
1. 在聊天界面输入您的问题
2. 系统会自动选择最适合的 Agent
3. 获得智能、专业的回答

### 代码审查
1. 点击 "🔍 代码审查" 按钮
2. 粘贴您的代码并选择编程语言
3. 添加上下文信息（可选）
4. 获得详细的代码分析报告

### Agent 手动选择
- **自动选择**: 让 AI 自动判断使用哪个 Agent
- **代码审查专家**: 专门用于代码分析和审查
- **编程助手**: 用于一般编程问题和技术咨询

## 🔧 API 说明

### GraphQL Endpoints

#### 发送消息
```graphql
mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    success
    message {
      id
      content
      role
      timestamp
    }
    agentUsed
    toolsUsed
    error
  }
}
```

#### 代码审查
```graphql
mutation ReviewCode($input: CodeReviewInput!) {
  reviewCode(input: $input) {
    success
    content
    agentUsed
    error
  }
}
```

#### 健康检查
```graphql
query GetMastraHealth {
  mastraHealth {
    status
    agents {
      name
      available
    }
    timestamp
    error
  }
}
```

## 🏗️ Mastra 架构详解

### Agents (智能代理)
- **codeReviewAgent**: 专业代码审查，支持多语言分析
- **generalCodingAgent**: 通用编程助手，处理技术问题

### Tools (工具集)
- **codeReviewTool**: 代码质量分析
- **codeOptimizationTool**: 代码优化建议
- **codeExplanationTool**: 代码解释和文档生成

### 自动选择逻辑
系统会根据消息内容自动选择合适的 Agent：
- 包含代码块或代码审查关键词 → 代码审查专家
- 其他编程相关问题 → 编程助手
- 支持手动指定 Agent 类型

## 🚀 部署选项

### Cloudflare Workers + Pages
- **Workers**: 后端 API 和 GraphQL 服务
- **Pages**: 静态前端部署
- **优势**: 全球 CDN、低延迟、自动扩展

### 自定义部署
- 可以部署到任何支持 Node.js 的平台
- Workers 代码可以适配为 Express.js 服务
- 前端可以部署到任何静态托管平台

## 🔒 安全性

- API 密钥通过 Cloudflare Workers Secrets 安全存储
- 支持 CORS 配置和请求验证
- 输入验证和错误处理
- 限流和熔断机制

## 📈 监控和日志

- Cloudflare Analytics 集成
- 自定义指标监控
- 错误日志和调试信息
- Mastra 内置的执行追踪

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Mastra](https://mastra.ai/) - AI 框架支持
- [Anthropic Claude](https://www.anthropic.com/) - 强大的 AI 模型
- [Cloudflare Workers](https://workers.cloudflare.com/) - 边缘计算平台
- [GraphQL](https://graphql.org/) - 查询语言和运行时

---

如果这个项目对您有帮助，请给个 ⭐️ 支持一下！
