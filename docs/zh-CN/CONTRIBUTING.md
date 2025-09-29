# 贡献指南

欢迎为 APISIX Web UI 项目做出贡献！本文档提供了参与项目贡献的指导原则。

## 行为准则

请阅读并遵守我们的 [行为准则](CODE_OF_CONDUCT.md)。

## 如何贡献

### 报告问题

在创建 issue 之前，请：

1. 检查 [issue 跟踪器](https://github.com/your-username/apisix-web-ui/issues) 中是否已存在相同问题
2. 提供清晰且描述性的标题
3. 包含重现问题的步骤
4. 描述期望的行为与实际行为
5. 包含相关的系统信息（操作系统、Node.js 版本等）

### 提交拉取请求

1. **Fork 仓库** 并从 `develop` 分支创建您的分支
2. **进行更改** 遵循我们的编码标准
3. **彻底测试** 您的更改
4. **更新文档**（如有需要）
5. **提交拉取请求** 并提供清晰的描述

### 开发环境设置

1. Fork 并克隆仓库：
```bash
git clone https://github.com/your-username/apisix-web-ui.git
cd apisix-web-ui
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

### 编码标准

- 使用一致的缩进（2 个空格）
- 遵循 Vue.js 风格指南
- 编写有意义的提交信息
- 为复杂逻辑添加注释
- 确保代码格式正确

### 提交信息格式

使用约定式提交格式：
```
type(scope): description

[可选的正文]

[可选的页脚]
```

类型：
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更改
- `style`: 代码样式更改
- `refactor`: 代码重构
- `test`: 添加测试
- `chore`: 维护任务

示例：
```
feat(router): 添加路由验证

- 为路由路径添加输入验证
- 改进无效路由的错误消息
- 更新新验证逻辑的测试
```

### 测试

- 为新功能编写测试
- 确保在提交 PR 之前所有测试都通过
- 在适用的情况下包含单元测试和集成测试

### 文档

- 如果添加新功能，更新 README.md
- 为新函数添加 JSDoc 注释
- 为重大更改更新 CHANGELOG.md

## 项目结构

```
src/
├── components/     # 可复用的 Vue 组件
├── views/         # 页面级组件
├── api/           # API 服务模块
├── utils/         # 工具函数
├── route/         # Vue Router 配置
└── style.css      # 全局样式
```

## 需要帮助？

- 查看现有的 [issues](https://github.com/your-username/apisix-web-ui/issues)
- 加入我们的社区讨论
- 阅读 [文档](README.md)

感谢您为 APISIX Web UI 做出贡献！
