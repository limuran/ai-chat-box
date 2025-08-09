#!/bin/bash

# 🔧 修复 Vite 构建问题和缺失文件
echo "🔧 修复 Vite 构建问题..."

# 进入前端目录
cd frontend

# 检查关键文件是否存在
echo "📋 检查关键文件..."

# 检查 main.tsx
if [ ! -f "src/main.tsx" ]; then
    echo "❌ src/main.tsx 缺失"
    echo "🔄 从GitHub拉取最新代码..."
    cd ..
    git pull origin main
    cd frontend
    
    if [ ! -f "src/main.tsx" ]; then
        echo "❌ 仍然缺失关键文件，请手动检查项目结构"
        exit 1
    fi
fi

# 检查 App.tsx
if [ ! -f "src/App.tsx" ]; then
    echo "❌ src/App.tsx 缺失，正在从GitHub拉取..."
    cd ..
    git pull origin main
    cd frontend
fi

# 检查并修复 index.html
echo "📄 检查 index.html..."
if grep -q '"\\./src/main\\.tsx"' index.html; then
    echo "⚠️  发现相对路径问题，正在修复..."
    sed -i.bak 's|src=\"\\./src/main\\.tsx\"|src=\"/src/main.tsx\"|g' index.html
    echo "✅ 已修复 index.html 路径"
fi

# 检查文件结构
echo "📁 验证文件结构..."
missing_files=()

if [ ! -f "src/main.tsx" ]; then missing_files+=("src/main.tsx"); fi
if [ ! -f "src/App.tsx" ]; then missing_files+=("src/App.tsx"); fi
if [ ! -f "src/index.css" ]; then missing_files+=("src/index.css"); fi
if [ ! -f "src/App.css" ]; then missing_files+=("src/App.css"); fi
if [ ! -f "index.html" ]; then missing_files+=("index.html"); fi

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ 缺失以下关键文件："
    printf '%s\n' "${missing_files[@]}"
    echo "🔄 请运行 'git pull origin main' 获取最新文件"
    exit 1
fi

echo "✅ 文件结构正常"

# 清除缓存
echo "🗑️ 清除缓存..."
rm -rf node_modules package-lock.json dist .vite

# 重新安装依赖
echo "📦 重新安装依赖..."
npm install

# 检查环境变量
if [ ! -f ".env" ]; then
    echo "🔑 创建 .env 文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件并设置 VITE_GRAPHQL_ENDPOINT"
    echo "    例如: VITE_GRAPHQL_ENDPOINT=https://ai-chat-workers.limuran818.workers.dev/graphql"
fi

# 显示当前环境变量
if [ -f ".env" ]; then
    echo "📋 当前环境变量："
    cat .env
fi

# 尝试构建
echo "🔨 尝试构建..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo "📁 构建文件位于 frontend/dist/"
    
    # 显示构建结果
    echo "📊 构建统计："
    ls -la dist/
    
    echo ""
    echo "🚀 你现在可以："
    echo "   • 运行开发服务器: npm run dev"
    echo "   • 预览构建结果: npm run preview"
    echo "   • 部署 dist/ 文件夹到任何静态托管服务"
else
    echo "❌ 构建失败"
    echo ""
    echo "🔍 常见解决方案："
    echo "   1. 检查所有文件是否存在"
    echo "   2. 确认 .env 文件配置正确"
    echo "   3. 运行 'git pull origin main' 获取最新代码"
    echo "   4. 检查 Node.js 版本 (需要 18+)"
    exit 1
fi

# 返回上级目录
cd ..

echo "🎉 修复完成！"