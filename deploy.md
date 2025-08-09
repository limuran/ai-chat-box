# 🚀 详细部署指南

## 📋 部署前准备

### 1. 必需工具
- Node.js 18+
- npm 或 yarn
- Git
- Cloudflare 账户

### 2. 获取 Claude API 密钥
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册并验证账户
3. 创建新的 API 密钥
4. 保存密钥备用

## 🔧 Workers 部署

### 步骤 1: 安装 Wrangler
```bash
# 全局安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login
```

### 步骤 2: 配置 Workers
```bash
# 克隆项目
git clone https://github.com/limuran/ai-chat-box.git
cd ai-chat-box/workers

# 安装依赖
npm install
```

### 步骤 3: 设置环境变量
```bash
# 设置 Claude API 密钥
wrangler secret put CLAUDE_API_KEY
# 提示时输入你的 Claude API 密钥
```

### 步骤 4: 部署
```bash
# 部署到生产环境
npm run deploy

# 或部署到测试环境
wrangler deploy --env staging
```

### 步骤 5: 验证部署
```bash
# 查看部署状态
wrangler tail

# 访问 GraphiQL 界面
# https://your-workers.your-subdomain.workers.dev/graphql
```

## 🌐 前端部署

### 选项 1: Cloudflare Pages (推荐)

#### 自动部署
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages 选项卡
3. 点击 "Create a project"
4. 连接 GitHub 仓库 `limuran/ai-chat-box`
5. 配置构建设置：
   - **项目名称**: `ai-chat-box`
   - **生产分支**: `main`
   - **构建命令**: `cd frontend && npm install && npm run build`
   - **构建输出目录**: `frontend/dist`
   - **根目录**: `/`
6. 设置环境变量：
   - `VITE_GRAPHQL_ENDPOINT`: `https://your-workers.your-subdomain.workers.dev/graphql`
7. 点击 "Save and Deploy"

#### 手动部署
```bash
cd frontend
npm install
npm run build

# 使用 Wrangler 部署到 Pages
wrangler pages deploy dist --project-name ai-chat-box
```

### 选项 2: Vercel

1. 安装 Vercel CLI
```bash
npm install -g vercel
```

2. 部署
```bash
cd frontend
vercel --prod
```

3. 配置环境变量
```bash
vercel env add VITE_GRAPHQL_ENDPOINT
# 输入: https://your-workers.your-subdomain.workers.dev/graphql
```

### 选项 3: Netlify

1. 构建项目
```bash
cd frontend
npm install
npm run build
```

2. 部署到 Netlify
- 拖拽 `dist` 文件夹到 Netlify Deploy 页面
- 或连接 GitHub 仓库自动部署

3. 设置环境变量
- 在 Netlify Dashboard 中添加环境变量
- `VITE_GRAPHQL_ENDPOINT`: Workers 的 GraphQL 端点

## 🔍 验证部署

### 1. 测试 Workers API
```bash
# 使用 curl 测试健康检查
curl -X POST https://your-workers.your-subdomain.workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { health }"}'

# 预期响应
{"data":{"health":"AI Chat Workers is running!"}}
```

### 2. 测试前端连接
1. 访问部署的前端 URL
2. 检查连接状态指示器是否显示 "已连接"
3. 发送测试消息验证 AI 回复

## 🛠️ 故障排除

### Workers 常见问题

**问题**: 部署失败 "Authentication failed"
```bash
# 解决方案: 重新登录
wrangler logout
wrangler login
```

**问题**: GraphQL 查询返回错误
```bash
# 检查日志
wrangler tail

# 验证环境变量
wrangler secret list
```

**问题**: Claude API 调用失败
- 检查 API 密钥是否正确
- 验证账户余额和配额
- 查看 Anthropic 服务状态

### 前端常见问题

**问题**: GraphQL 连接失败
- 检查 `VITE_GRAPHQL_ENDPOINT` 环境变量
- 确认 Workers 已正确部署
- 检查 CORS 配置

**问题**: 构建失败
```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 监控和维护

### 1. Workers 监控
```bash
# 实时日志
wrangler tail

# 查看分析数据
# Cloudflare Dashboard > Workers > Analytics
```

### 2. 性能优化
- 启用 Cloudflare 缓存
- 配置 CDN 加速
- 监控 API 响应时间

### 3. 安全最佳实践
- 定期轮换 API 密钥
- 监控 API 使用量
- 设置访问限制

## 🔄 更新部署

### 更新 Workers
```bash
cd workers
git pull origin main
npm install
npm run deploy
```

### 更新前端
- Cloudflare Pages: 自动从 GitHub 部署
- Vercel: 自动从 GitHub 部署
- Netlify: 重新构建并部署

## 📈 扩展功能

### 添加自定义域名
1. 在 Cloudflare Dashboard 中添加域名
2. 配置 DNS 记录
3. 设置 SSL 证书

### 添加分析工具
- Google Analytics
- Cloudflare Analytics
- 自定义埋点

---

需要帮助？请在 GitHub 上创建 Issue 或查看 [文档](README.md)。