# 🚀 快速开始指南

## ⚡ 一键部署

### 1. 克隆项目
```bash
git clone https://github.com/limuran/ai-chat-box.git
cd ai-chat-box
```

### 2. 运行部署脚本
```bash
chmod +x deploy-quick.sh
./deploy-quick.sh
```

### 3. 设置 Claude API 密钥
```bash
cd workers
wrangler secret put CLAUDE_API_KEY
# 输入你从 https://console.anthropic.com/ 获取的 API 密钥
```

### 4. 配置前端环境变量
```bash
cd frontend
cp .env.example .env
# 编辑 .env 文件，设置你的 Workers GraphQL 端点
```

## 🌐 手动部署步骤

### Workers 后端
```bash
cd workers
npm install
wrangler login
wrangler secret put CLAUDE_API_KEY
npm run deploy
```

### React 前端
```bash
cd frontend
npm install
echo 'VITE_GRAPHQL_ENDPOINT=https://your-workers.your-subdomain.workers.dev/graphql' > .env
npm run build
```

## 🔧 故障排除

### Workers 部署失败
- 检查是否已登录：`wrangler whoami`
- 重新登录：`wrangler login`
- 检查 API 密钥：`wrangler secret list`

### 前端构建失败
- 清除缓存：`rm -rf node_modules package-lock.json && npm install`
- 检查 Node.js 版本：`node --version`（需要 18+）
- 检查环境变量：`cat .env`

### API 连接失败
- 检查 Workers 是否正常：访问 GraphiQL 界面
- 验证 API 密钥是否正确
- 查看 Workers 日志：`wrangler tail`

## 📚 完整文档

- [详细部署指南](deploy.md)
- [项目文档](README.md)
- [故障排除](README.md#故障排除)

## 🎯 快速测试

1. **测试 Workers**：
   ```bash
   curl -X POST https://your-workers.your-subdomain.workers.dev/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "query { health }"}'
   ```

2. **测试前端**：
   ```bash
   cd frontend
   npm run dev
   # 访问 http://localhost:3000
   ```

---

需要帮助？请查看 [GitHub Issues](https://github.com/limuran/ai-chat-box/issues) 或创建新的问题。