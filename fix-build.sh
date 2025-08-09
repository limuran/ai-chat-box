#!/bin/bash

# 🔧 修复 Vite 构建问题
echo "🔧 修复 Vite 构建问题..."

# 进入前端目录
cd frontend

# 检查并修复 index.html
echo "📄 检查 index.html..."
if grep -q '"\./src/main\.tsx"' index.html; then
    echo "⚠️  发现相对路径问题，正在修复..."
    sed -i.bak 's|src="\./src/main\.tsx"|src="/src/main.tsx"|g' index.html
    echo "✅ 已修复 index.html 路径"
fi

# 检查文件结构
echo "📁 检查文件结构..."
if [ ! -f "src/main.tsx" ]; then
    echo "❌ src/main.tsx 不存在"
    exit 1
fi

if [ ! -f "index.html" ]; then
    echo "❌ index.html 不存在"
    exit 1
fi

echo "✅ 文件结构正常"

# 清除缓存
echo "🧯 清除缓存..."
rm -rf node_modules package-lock.json dist .vite

# 重新安装依赖
echo "📦 重新安装依赖..."
npm install

# 检查环境变量
if [ ! -f ".env" ]; then
    echo "🔑 创建 .env 文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件并设置 VITE_GRAPHQL_ENDPOINT"
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
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 返回上级目录
cd ..

echo "🎉 修复完成！"