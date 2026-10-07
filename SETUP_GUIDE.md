# 梦夜的 AI 课 — 设置指南

> 课程、练习场、提示词库、名词表和测验都不需要 API Key，也不需要联网。
> 下面的配置只影响每节课底部的「学习助手」。

## 一、准备工作

在开始之前，你需要确保电脑上安装了以下工具。

### 1. 安装 Node.js

Node.js 是这个项目运行的基础环境。

- 打开 https://nodejs.org/
- 下载左边的 **LTS（长期支持版）**
- 双击安装包，一路点"下一步"即可
- 安装完成后，打开终端（Terminal）输入以下命令验证：

  ```bash
  node -v
  npm -v
  ```

  如果能看到版本号（比如 `v20.x.x` 和 `10.x.x`），说明安装成功。

> **小提示**：什么是终端？
> - Mac：按 `Cmd + 空格`，搜索"终端"（Terminal）
> - Windows：按 `Win + R`，输入 `cmd`，回车

---

## 二、快速设置（推荐）

项目里提供了一个自动设置脚本，帮你完成大部分工作。

### 1. 打开终端，进入项目目录

```bash
cd 你放这个项目的目录/learn-to-code
```

### 2. 运行设置脚本

```bash
bash scripts/setup.sh
```

这个脚本会自动：
- 检查 Node.js 是否安装
- 安装项目依赖
- 创建 `.env` 配置文件
- 编译检查代码

### 3. 配置 API Key

编辑项目根目录下的 `.env` 文件，填入你的 API Key。

---

## 三、手动设置（如果自动脚本不好用）

### 1. 安装依赖

```bash
npm install
```

### 2. 创建环境变量文件

```bash
cp .env.example .env
```

### 3. 编辑 .env 文件

用文本编辑器打开项目根目录的 `.env` 文件：

AI 配置是可选的。不填 API Key 也可以打开课程、完成练习、测验和记录进度。

#### 方式一：使用 DeepSeek（推荐，国内直接访问）
```env
AI_PROVIDER=openai-compatible
AI_MODEL=deepseek-chat
AI_API_KEY=你的DeepSeek_API_Key
AI_BASE_URL=https://api.deepseek.com/v1
```

> 获取 API Key：https://platform.deepseek.com/

#### 方式二：使用其他国内模型

只要是 OpenAI 兼容接口的服务都能用：
- **硅基流动 (SiliconFlow)**：`AI_BASE_URL=https://api.siliconflow.cn/v1`
- **阿里通义千问**：`AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1`

#### 方式三：使用 Claude
```env
AI_PROVIDER=anthropic
AI_MODEL=claude-sonnet-4-20250514
AI_API_KEY=你的Anthropic_API_Key
```

> 获取 API Key：https://console.anthropic.com/

#### 方式四：使用 OpenAI
```env
AI_PROVIDER=openai
AI_MODEL=gpt-4o
AI_API_KEY=你的OpenAI_API_Key
```

> **小提示**：`AI_API_KEY` 是通用配置；如果用 Anthropic 也可以用 `ANTHROPIC_API_KEY`，用 OpenAI 也可以用 `OPENAI_API_KEY`。

### 4. （可选）配置 API 认证密钥

本地使用可留空。配置后，所有 AI API 请求都必须携带 `Authorization: Bearer <密钥>`，包括浏览器请求；仅设置同源请求头不能代替认证。需要浏览器助手时，由受信任的服务端代理附加认证，不要把密钥写入前端代码。

```env
AI_API_AUTH_TOKEN=你的随机密钥
```

可以用任意随机字符串，例如 `my-secret-token-123`。

### 5. 启动

```bash
npm run dev
```

打开浏览器访问 http://localhost:3000

### 6. 备用 AI（可选）

如果主 AI 服务商宕机，可以配置备用服务商自动切换：

```env
AI_FALLBACK_PROVIDER=openai
AI_FALLBACK_MODEL=gpt-4o-mini
AI_FALLBACK_API_KEY=sk-...
AI_FALLBACK_BASE_URL=https://api.openai.com/v1
```

---

## 四、Docker 部署

如果你熟悉 Docker，可以用一行命令启动：

```bash
docker compose up -d
```

访问 http://localhost:3000 。环境变量通过 `.env` 文件配置。

---

## 五、常见问题

### Q: 启动后页面显示空白或报错

A: 检查终端有没有报错信息。最常见的问题是：
- 忘记安装依赖 (`npm install`)
- Node.js 版本太低（需要 v18 以上）

### Q: AI 助教提示未配置

A: AI 助教、代码生成和代码审阅属于可选功能。没有 API Key 时，课程正文、练习、测验、进度和作品保存仍可使用；如果需要 AI 功能，再按上面的方式配置：
- 确认 `.env` 文件已创建（不是 `.env.example`）
- 确认 API Key 填对了（不要有多余空格）
- 确认 `AI_PROVIDER` 和对应的 Key 匹配
- 修改后**需要重新启动** `npm run dev`

### Q: 聊天时 AI 一直没回复

A: 可能是网络问题。如果你在中国大陆，访问 Anthropic 或 OpenAI 的 API 可能需要科学上网。可以换成国内能用的服务（如 DeepSeek），参考上面的方式三。

### Q: 生成的代码在哪里？

A: 目前生成的代码只在浏览器中显示，关闭页面就没了。
- 点击代码框右上角的"复制"按钮
- 粘贴到一个新文件，比如 `my-page.html`
- 双击这个文件就能在浏览器中查看效果

### Q: 如何配合 VS Code 使用？

A: VS Code 是目前最流行的代码编辑器，免费且好用。
1. 下载安装：https://code.visualstudio.com/
2. 打开 VS Code
3. 点击 `File > Open Folder`，选择本项目文件夹
4. 就可以在 VS Code 中编辑代码了

---

## 六、部署到线上

想让别人也能访问你的网站？最简单的方式是用 Vercel 部署。

### 用 Vercel 部署

1. 把代码推送到 GitHub（参考下面的 Git 操作）
2. 打开 https://vercel.com/，用 GitHub 登录
3. 点击 `Add New > Project`，导入这个仓库
4. 在 `Environment Variables` 中添加环境变量
5. 点击 `Deploy`，等几分钟就好了

### Git 上传到 GitHub

```bash
# 初始化（只需要做一次）
git init
git add .
git commit -m "初始化项目"

# 关联远程仓库
git remote add origin https://github.com/你的用户名/learn-to-code.git

# 推送代码
git push -u origin main
```

> **小提示**：如果你没有 GitHub 账号，先去 https://github.com/ 注册一个，免费的。

---

## 七、项目结构说明

```
learn-to-code/
├── app/                    # 页面文件
│   ├── api/agent/          # AI 对话接口
│   ├── lesson/[id]/        # 课程内容页
│   ├── page.tsx            # 首页
│   └── layout.tsx          # 页面布局
├── components/             # 组件
│   ├── ChatInterface.tsx   # AI 聊天组件
│   ├── PromptPlayground.tsx # 代码生成练习
│   └── LessonNavigator.tsx # 课程导航
├── lib/
│   └── lessons.ts          # 课程内容数据
├── scripts/
│   └── setup.sh            # 自动设置脚本
├── .env.example            # 环境变量模板
├── SETUP_GUIDE.md          # 本文件
└── README.md               # 项目说明
```

看不懂也没关系，暂时不需要修改这些文件，先熟悉界面就好。

---

## 八、遇到其他问题？

可以在这个项目里使用 AI 助教提问，或者查看项目内的课程内容。
