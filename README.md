# AI Chat Box with Mastra Integration

一个现代化的 AI 聊天应用，集成了 Mastra AI 框架，支持智能代码审查和多Agent系统。

## 🚀 核心特性

### 🤖 Mastra AI 框架集成
- **CloudflareDeployer**: 使用官方 Mastra Cloudflare 部署器
- **智能Agent系统**: 自动选择最适合的AI助手
- **代码审查专家**: 专业的代码分析和优化建议
- **编程助手**: 全能的技术问题解决方案

### 🔍 代码审查功能
- 深度代码质量分析（1-10分评分）
- 安全漏洞检测和建议
- 性能优化指导
- 最佳实践建议
- 支持15+编程语言

## 🏗️ 技术架构

```
React Frontend (TypeScript)
    ↓ GraphQL API
Cloudflare Workers + Mastra Framework
    ↓ CloudflareDeployer
Claude AI (Anthropic)
```

## 📦 项目结构

```
ai-chat-box/
├── src/                          # React 前端
│   ├── components/
│   │   ├── ChatBox.tsx          # 主聊天界面
│   │   └── CodeReviewModal.tsx  # 代码审查模态框
│   └── services/
│       └── graphql.ts           # GraphQL 客户端
├── workers/                      # Cloudflare Workers + Mastra
│   ├── mastra.config.ts         # Mastra 配置文件
│   ├── package.json             # Mastra + Workers 依赖
│   └── src/
│       ├── mastra/              # Mastra 组件
│       │   ├── agents/          # AI Agents
│       │   ├── tools/           # AI 工具
│       │   └── index.ts         # Mastra 主配置
│       ├── graphql/             # GraphQL API
│       └── services/            # 服务层
└── deploy-mastra.sh             # Mastra 部署脚本
```

## 🚀 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone https://github.com/limuran/ai-chat-box.git
cd ai-chat-box

# 安装前端依赖
npm install

# 安装 Workers + Mastra 依赖
cd workers
npm install
```

### 2. 配置 Mastra

确保 `workers/mastra.config.ts` 正确配置：

```typescript
import { Config } from '@mastra/core';

export default {
  name: 'ai-chat-mastra',
  engine: 'cloudflare',
  agents: './src/mastra/agents',
  tools: './src/mastra/tools',
  llms: [
    {
      provider: 'ANTHROPIC',
      name: 'claude-3-5-sonnet-20241022',
    },
  ],
} satisfies Config;
```

### 3. 本地开发

```bash
# 启动前端开发服务器
npm run dev

# 启动 Mastra + Workers 开发服务器
cd workers
npm run dev
```

### 4. 部署到 Cloudflare (推荐使用 Mastra 部署脚本)

```bash
# 使用 Mastra 专用部署脚本
chmod +x deploy-mastra.sh
./deploy-mastra.sh
```

或手动部署：

```bash
# 登录 Cloudflare
cd workers
npx wrangler login

# 设置环境变量
npx wrangler secret put CLAUDE_API_KEY

# 使用 Mastra 构建
npx mastra build

# 部署 Workers
npx wrangler deploy
```

## 🎯 Mastra 特性

### Agent 系统
- **codeReviewAgent**: 专业代码审查和安全分析
- **generalCodingAgent**: 通用编程问题解决

### 智能选择逻辑
系统自动根据消息内容选择最适合的Agent：
- 代码块或审查关键词 → 代码审查专家
- 一般编程问题 → 编程助手
- 支持手动指定Agent类型

### 工具集
- **codeReviewTool**: 代码质量分析
- **codeOptimizationTool**: 代码优化建议
- **codeExplanationTool**: 代码解释和文档

## 🔧 配置选项

### 环境变量 (Cloudflare Workers Secrets)
- `CLAUDE_API_KEY`: Anthropic Claude API 密钥
- `ENVIRONMENT`: 运行环境 (development/production)

### Mastra 配置
- 使用 `CloudflareDeployer` 进行标准部署
- 内存存储适配 Cloudflare Workers 环境
- 自动处理Agent和Tool注册

## 📊 使用指南

### 1. 智能对话
- 在聊天界面输入问题
- 系统自动选择最适合的Agent
- 获得专业的AI回答

### 2. 代码审查
- 点击"🔍 代码审查"按钮
- 粘贴代码并选择编程语言
- 获得详细的分析报告

### 3. Agent 选择
- **自动选择**: 让AI判断使用哪个Agent
- **代码审查专家**: 专门用于代码分析
- **编程助手**: 用于一般编程问题

## 🔄 GraphQL API

### 核心查询和变更

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

#### Mastra 健康检查
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

## 🛠️ 开发最佳实践

### Mastra Agent 开发
1. 继承 `Agent` 基类
2. 定义清晰的 instructions
3. 配置合适的工具集
4. 使用 CloudflareDeployer

### 错误处理
- 完善的回退机制到原始Claude服务
- 详细的错误日志和调试信息
- 用户友好的错误提示

### 性能优化
- 智能Agent选择减少不必要处理
- 内存缓存常见查询
- 边缘计算优化

## 🧪 测试

### 建议测试场景
1. **普通对话**: 验证编程助手选择
2. **代码消息**: 验证代码审查专家选择
3. **专用审查**: 测试代码审查功能
4. **错误处理**: 验证回退机制
5. **多语言**: 测试不同编程语言支持

### 健康检查
```bash
# 检查 Mastra 服务状态
curl -X POST https://your-workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ mastraHealth { status agents { name available } } }"}'
```

## 🔒 安全性

- API密钥通过Cloudflare Workers Secrets安全存储
- 输入验证和清理
- CORS配置
- 错误信息不泄露敏感数据

## 📈 监控

- Cloudflare Analytics集成
- Mastra内置执行追踪
- 自定义指标监控
- 实时错误报告

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 遵循 Mastra 开发规范
4. 提交 Pull Request

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Mastra](https://mastra.ai/) - AI框架支持
- [Anthropic Claude](https://www.anthropic.com/) - AI模型
- [Cloudflare Workers](https://workers.cloudflare.com/) - 边缘计算

---

**注意**: 这个版本使用了 Mastra 的 CloudflareDeployer，遵循官方最佳实践。如果你遇到任何问题，请参考 [Mastra 文档](https://docs.mastra.ai) 或提交 Issue。

⭐️ 如果这个项目对你有帮助，请给个星星支持！
