#!/bin/bash

# Mastra + Cloudflare Workers 部署脚本

echo "🚀 开始部署 AI Chat Box with Mastra 到 Cloudflare Workers..."

# 检查必要的工具
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI 未安装，请先安装: npm install -g wrangler"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo "❌ npx 未找到，请确保 Node.js 正确安装"
    exit 1
fi

# 切换到 workers 目录
cd workers || { echo "❌ workers 目录不存在"; exit 1; }

echo "📦 安装依赖..."
npm install

# 检查 Mastra 配置
if [ ! -f "mastra.config.ts" ]; then
    echo "❌ mastra.config.ts 配置文件不存在"
    exit 1
fi

echo "🔧 构建 Mastra 应用..."
# 使用 Mastra CLI 构建
npx mastra build

echo "🔑 检查环境变量..."
# 检查必要的环境变量
if ! wrangler secret list | grep -q "CLAUDE_API_KEY"; then
    echo "⚠️  CLAUDE_API_KEY 未设置，请设置:"
    echo "   wrangler secret put CLAUDE_API_KEY"
    read -p "现在设置? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        wrangler secret put CLAUDE_API_KEY
    else
        echo "❌ 请设置 CLAUDE_API_KEY 后重新运行部署"
        exit 1
    fi
fi

echo "🚀 部署到 Cloudflare Workers..."
wrangler deploy

if [ $? -eq 0 ]; then
    echo "✅ Workers 部署成功!"
    
    # 获取部署的 URL
    WORKERS_URL=$(wrangler whoami 2>/dev/null | grep -o 'https://.*\.workers\.dev' | head -1)
    
    if [ -n "$WORKERS_URL" ]; then
        echo "🌐 Workers URL: $WORKERS_URL"
        echo "🎯 GraphQL Endpoint: $WORKERS_URL/graphql"
        echo "🔍 GraphiQL Interface: $WORKERS_URL/graphql"
    fi
    
    echo ""
    echo "🧪 测试 Mastra 健康状态..."
    
    # 简单的健康检查
    curl -s -X POST "$WORKERS_URL/graphql" \
        -H "Content-Type: application/json" \
        -d '{"query": "{ mastraHealth { status timestamp } }"}' \
        | grep -q "healthy" && echo "✅ Mastra 服务正常" || echo "⚠️  Mastra 服务可能有问题"
    
    echo ""
    echo "📋 下一步:"
    echo "   1. 更新前端配置以使用新的 Workers URL"
    echo "   2. 测试代码审查功能"
    echo "   3. 验证 Agent 自动选择功能"
    
else
    echo "❌ 部署失败"
    exit 1
fi

echo ""
echo "📚 更多信息:"
echo "   - Mastra 文档: https://mastra.ai/docs"
echo "   - Cloudflare Workers: https://workers.cloudflare.com"
echo "   - GraphQL Playground: $WORKERS_URL/graphql"
