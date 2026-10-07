#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo ""
echo "=============================="
echo " 梦夜的 AI 课 - 快速设置"
echo "=============================="
echo ""

# 1. Check Node.js
if command -v node &>/dev/null; then
  echo "✅ Node.js  $(node -v)"
else
  echo "❌ 未安装 Node.js，请先安装：https://nodejs.org/"
  exit 1
fi

# 2. Check npm
if command -v npm &>/dev/null; then
  echo "✅ npm  $(npm -v)"
else
  echo "❌ 未安装 npm"
  exit 1
fi

# 3. Install dependencies
if [ -d "node_modules" ]; then
  echo "✅ 依赖已安装"
else
  echo "📦 正在安装依赖..."
  npm install
  echo "✅ 依赖安装完成"
fi

# 4. Create .env if not exists
if [ -f ".env" ]; then
  echo "✅ .env 文件已存在"
else
  cp .env.example .env
  echo ""
  echo "📝 已创建 .env 文件，请编辑它填入你的 API Key："
  echo "   ${PROJECT_DIR}/.env"
  echo ""
  echo "   不填 Anthropic Key 的话，也可以换成其他模型："
  echo "   https://github.com/dreamnight16/see-ai#readme"
  echo ""
fi

# 5. Build check
echo ""
echo "🏗️  正在编译检查..."
if npx tsc --noEmit &>/dev/null; then
  echo "✅ 代码编译通过"
else
  echo "⚠️  编译有警告，但不影响运行"
fi

# 6. Done
echo ""
echo "=============================="
echo " 🎉 设置完成！"
echo "=============================="
echo ""
echo "启动开发服务器："
echo "  npm run dev"
echo ""
echo "然后打开浏览器访问："
echo "  http://localhost:3000"
echo ""
