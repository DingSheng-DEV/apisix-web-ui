# APISIX Web UI

一个现代化的 Apache APISIX API 网关 Web 用户界面，基于 Vue.js 和 Electron 构建。

## 特性

- 🚀 现代化的 Vue.js 3 界面
- 🖥️ 通过 Electron 支持桌面应用程序
- 🔧 路由管理
- 🛡️ SSL 证书管理
- 🔄 服务配置
- ⚖️ 上游负载均衡管理
- 📋 全局规则配置
- 🎨 Element Plus UI 组件

## 环境要求

- Node.js（版本 16 或更高）
- npm 或 pnpm

## 安装

1. 克隆仓库：
```bash
git clone https://github.com/your-username/apisix-web-ui.git
cd apisix-web-ui
```

2. 安装依赖：
```bash
npm install
# 或者
pnpm install
```

## 开发

启动开发服务器：
```bash
npm run dev
```

## 构建

### Web 应用程序
```bash
npm run build
```

### Electron 应用程序
```bash
npm run electron:build
```

## 脚本命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run electron:serve` - 构建并运行 Electron 应用
- `npm run electron:build` - 构建 Electron 可执行文件

## 项目结构

```
src/
├── components/     # Vue 组件
├── views/         # 页面组件
├── api/           # API 模块
├── utils/         # 工具函数
├── route/         # 路由配置
└── style.css      # 全局样式
```

## 贡献

请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解我们的行为准则和提交拉取请求的流程。

## 许可证

该项目基于 Apache License 2.0 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 支持

如果您遇到任何问题或有疑问，请 [创建一个 issue](https://github.com/your-username/apisix-web-ui/issues)。