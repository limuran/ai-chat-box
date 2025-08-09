#!/bin/bash

# AI Chat Box 快速部署脚本
echo "🚀 开始部署 AI Chat Box..."

# 检查必需工具
command -v node >/dev/null 2>&1 || { echo "❌ 请先安装 Node.js"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ 请先安装 npm"; exit 1; }

# 部署 Workers
echo "📦 部署 Cloudflare Workers..."
cd workers

# 检查是否安装了 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "📥 安装 Wrangler CLI..."
    npm install -g wrangler
fi

# 安装依赖
echo "📦 安装 Workers 依赖..."
npm install

# 部署 Workers
echo "🚀 部署到 Cloudflare..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ Workers 部署成功！"
else
    echo "❌ Workers 部署失败"
    exit 1
fi

# 部署前端
echo "🌐 构建前端..."
cd ../frontend

# 安装依赖
echo "📦 安装前端依赖..."
npm install

# 检查环境变量
if [ ! -f ".env" ]; then
    echo "⚠️  创建 .env 文件..."
    cp .env.example .env
    echo "请编辑 .env 文件并设置 VITE_GRAPHQL_ENDPOINT"
fi

# 构建项目
echo "🔨 构建前端项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 前端构建成功！"
    echo "📁 构建文件位于 frontend/dist/"
else
    echo "❌ 前端构建失败"
    exit 1
fi

echo "🎉 部署完成！"
echo "📖 查看 README.md 了解如何部署前端到 Cloudflare Pages 或其他平台"

# 返回根目录
cd ..