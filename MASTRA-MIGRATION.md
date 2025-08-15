# Mastra 框架迁移指南

本文档说明了如何将现有的 ai-chat-box 项目迁移到使用 Mastra 框架的 CloudflareDeployer。

## 🔄 主要变更

### 1. 架构调整

**之前**: 直接使用 Cloudflare Workers + GraphQL
```
React Frontend → Cloudflare Workers → Claude API
```

**现在**: 使用 Mastra 框架 + CloudflareDeployer
```
React Frontend → Cloudflare Workers + Mastra → Claude API
```

### 2. 新增依赖

```json
{
  "@mastra/core": "^0.13.1",
  "@mastra/deployer-cloudflare": "^0.13.1",
  "@mastra/memory": "^0.12.1",
  "mastra": "^0.10.20"
}
```

### 3. 配置文件

新增 `workers/mastra.config.ts`:
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

## 🚀 部署方式变更

### 之前的部署方式
```bash
cd workers
npm run deploy
```

### 新的部署方式
```bash
# 使用 Mastra 专用脚本
./deploy-mastra.sh

# 或手动部署
cd workers
npx mastra build
npx wrangler deploy
```

## 🔧 代码结构变更

### 1. Mastra 实例化

使用 CloudflareDeployer:
```typescript
import { CloudflareDeployer } from '@mastra/deployer-cloudflare';

export const mastra = new Mastra({
  agents: { codeReviewAgent, generalCodingAgent },
  tools: { codeReviewTool, codeOptimizationTool },
  deployer: new CloudflareDeployer({
    environment: 'production',
  }),
});
```

### 2. Workers 入口文件

将 Mastra 实例注入到 GraphQL 上下文:
```typescript
return await yoga.fetch(request, {
  env,
  ctx,
  mastra, // 注入 Mastra 实例
});
```

## 🎯 功能增强

### 1. 智能 Agent 选择
- 自动根据消息内容选择合适的 Agent
- 支持手动指定 Agent 类型
- 完善的回退机制

### 2. 代码审查功能
- 专业的代码质量分析
- 安全性检查
- 性能优化建议
- 支持多种编程语言

### 3. 工具系统
- 结构化的 AI 工具
- 可扩展的工具架构
- 标准化的工具接口

## ⚠️ 注意事项

### 1. 环境变量
确保设置了必要的环境变量:
```bash
wrangler secret put CLAUDE_API_KEY
```

### 2. 兼容性
- 前端代码保持向后兼容
- GraphQL API 扩展了新功能，不影响现有功能
- 错误处理包含回退到原始 Claude 服务

### 3. 部署顺序
1. 先部署 Workers (包含 Mastra)
2. 更新前端配置以使用新的 API 端点
3. 测试新功能

## 🧪 测试建议

1. **基础功能测试**: 确保原有聊天功能正常
2. **Agent 选择测试**: 验证自动选择逻辑
3. **代码审查测试**: 测试新的代码审查功能
4. **错误处理测试**: 验证回退机制
5. **性能测试**: 确保响应时间可接受

## 📚 相关文档

- [Mastra 官方文档](https://docs.mastra.ai)
- [CloudflareDeployer 文档](https://docs.mastra.ai/deployers/cloudflare)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)

## 🤝 获取帮助

如果在迁移过程中遇到问题:
1. 查看 [Issues](https://github.com/limuran/ai-chat-box/issues)
2. 参考 Mastra 官方文档
3. 提交新的 Issue

---

这个迁移遵循了 Mastra 的最佳实践，确保了代码的可维护性和扩展性。
