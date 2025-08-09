# AI Chat Box - Cloudflare Workers + GraphQL

基于 React + TypeScript + GraphQL + Cloudflare Workers 构建的现代化 AI 聊天界面，集成 Claude AI。

## 🏗️ 项目架构

```
ai-chat-box/
├── workers/                    # Cloudflare Workers 后端
│   ├── src/
│   │   ├── index.ts           # Workers 入口
│   │   ├── graphql/           # GraphQL 相关
│   │   ├── services/          # Claude API 服务
│   │   └── utils/             # 工具函数
│   ├── wrangler.toml          # Cloudflare 配置
│   └── package.json
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── components/        # React 组件
│   │   ├── services/          # GraphQL 客户端
│   │   ├── hooks/             # 自定义 Hooks
│   │   └── types/             # TypeScript 类型
│   └── package.json
└── README.md
```

## 🌐 技术栈

**后端 (Cloudflare Workers)**
- Cloudflare Workers Runtime
- GraphQL with graphql-yoga
- Claude AI SDK
- TypeScript

**前端 (React)**
- React 18 + TypeScript
- Apollo Client (GraphQL)
- Tailwind CSS
- Vite Build Tool
- Lucide React Icons

## 🚀 快速开始

### 1. 部署 Cloudflare Workers

```bash
cd workers
npm install

# 设置环境变量
wrangler secret put CLAUDE_API_KEY
# 输入你的 Claude API Key

# 部署到 Cloudflare
npm run deploy
```

### 2. 配置并运行前端

```bash
cd frontend
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置 Workers 的 GraphQL 端点

# 启动开发服务器
npm run dev
```

## 🔧 环境配置

### Workers 环境变量

```bash
# 使用 wrangler 设置密钥
wrangler secret put CLAUDE_API_KEY
```

### 前端环境变量

```env
# .env 文件
# 本地开发
VITE_GRAPHQL_ENDPOINT=http://localhost:8787/graphql

# 生产环境（替换为你的 Workers 域名）
VITE_GRAPHQL_ENDPOINT=https://your-workers.your-subdomain.workers.dev/graphql
```

## 📦 部署指南

### 部署 Workers

1. **安装 Wrangler CLI**
```bash
npm install -g wrangler
wrangler login
```

2. **配置项目**
```bash
cd workers
npm install
```

3. **设置环境变量**
```bash
wrangler secret put CLAUDE_API_KEY
```

4. **部署**
```bash
npm run deploy
```

### 部署前端

#### 选项 1: Cloudflare Pages
1. 连接 GitHub 仓库到 Cloudflare Pages
2. 设置构建配置：
   - 构建命令: `cd frontend && npm install && npm run build`
   - 构建输出目录: `frontend/dist`
   - 根目录: `/`
3. 设置环境变量 `VITE_GRAPHQL_ENDPOINT`
4. 部署

#### 选项 2: Vercel
1. 导入 GitHub 仓库到 Vercel
2. 设置项目配置：
   - Framework: Vite
   - Root Directory: `frontend`
3. 设置环境变量 `VITE_GRAPHQL_ENDPOINT`
4. 部署

## 🔑 获取 Claude API 密钥

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册/登录账户
3. 创建新的 API 密钥
4. 复制密钥用于 Workers 环境变量

## 🎯 功能特性

- 🎨 **现代化界面**: 使用 Tailwind CSS 构建的响应式设计
- 💬 **实时对话**: 与 Claude AI 进行智能对话
- 🔄 **GraphQL API**: 类型安全的 API 通信
- ⚡ **边缘计算**: Cloudflare Workers 全球加速
- 🔐 **安全性**: API 密钥在服务端，前端不暴露
- 📱 **响应式**: 完美适配桌面和移动设备
- 🎵 **动画效果**: 流畅的交互动画
- 📝 **消息管理**: 支持复制、清空对话等功能

## 🛠️ 开发指南

### 本地开发

1. **启动 Workers 开发服务器**
```bash
cd workers
npm run dev
# 访问 http://localhost:8787/graphql 查看 GraphiQL
```

2. **启动前端开发服务器**
```bash
cd frontend
npm run dev
# 访问 http://localhost:3000
```

### GraphQL Schema

```graphql
type Query {
  health: String!
  availableModels: [String!]!
}

type Mutation {
  sendMessage(input: SendMessageInput!): ChatResponse!
  clearConversation: Boolean!
}

type Message {
  id: ID!
  content: String!
  role: MessageRole!
  timestamp: String!
}

enum MessageRole {
  USER
  ASSISTANT
}
```

## 🔧 自定义配置

### 修改 Claude 模型

在 `workers/src/services/claude.ts` 中修改：

```typescript
const response = await this.client.messages.create({
  model: 'claude-3-sonnet-20240229', // 可选: haiku, sonnet, opus
  max_tokens: 1000,
  temperature: 0.7,
  messages: claudeMessages,
});
```

### 自定义样式

前端使用 Tailwind CSS，可以在 `frontend/src/components/` 中修改组件样式。

## 🚨 故障排除

### 常见问题

1. **Workers 部署失败**
   - 检查 `wrangler.toml` 配置
   - 确保已登录 Cloudflare: `wrangler login`

2. **GraphQL 连接失败**
   - 检查 `VITE_GRAPHQL_ENDPOINT` 环境变量
   - 确保 Workers 已正确部署

3. **Claude API 错误**
   - 验证 API 密钥是否正确
   - 检查 API 配额和权限

### 调试模式

```bash
# Workers 日志
wrangler tail

# 前端调试
# 打开浏览器开发者工具查看 Network 和 Console
```

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🙏 致谢

- [Anthropic](https://www.anthropic.com/) - Claude AI API
- [Cloudflare](https://www.cloudflare.com/) - Workers 平台
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL 客户端
- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！

🌐 **在线演示**: [https://your-demo-url.com](https://your-demo-url.com)

📧 **联系我们**: 有问题请创建 Issue