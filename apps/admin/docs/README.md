# Admin 系统文档

欢迎使用Admin系统文档。本文档提供了Admin系统的架构、目录结构、技术栈等详细信息，帮助开发者快速了解和上手系统。

## 文档目录

- [架构文档](./ARCHITECTURE.md): 详细说明系统的架构设计和核心模块
- [目录结构](./DIRECTORY_STRUCTURE.md): 详细说明系统的目录结构和文件组织
- [技术栈](./TECH_STACK.md): 详细说明系统使用的技术栈和各个库的作用

## 快速开始

### 安装依赖

```bash
cd apps/admin
pnpm install
```

### 开发环境

```bash
pnpm dev
```

### 构建生产环境

```bash
pnpm build
```

### 预览生产环境

```bash
pnpm preview
```

## 系统概述

Admin系统是一个基于React的现代化管理后台，用于管理电商平台的各种资源，包括用户、商品、订单等。该系统采用了最新的前端技术栈，提供了丰富的UI组件和功能模块，以满足电商平台的管理需求。

### 主要功能

- 用户管理
- 商品管理
- 订单管理
- 数据统计和报表
- 系统设置

### 技术特点

- 基于React 19和TypeScript
- 使用TanStack Router进行路由管理
- 使用TanStack Query进行数据获取和缓存
- 使用Zustand进行状态管理
- 使用Tailwind CSS进行样式设计
- 使用Radix UI作为基础UI组件库

## 开发指南

### 添加新页面

1. 在`src/routes`目录下创建新的路由文件
2. 在`src/features`目录下创建对应的功能模块
3. 在侧边栏配置中添加新页面的链接

### 添加新组件

1. 在`src/components`目录下创建新的组件文件
2. 使用Tailwind CSS进行样式设计
3. 导出组件并在需要的地方引入

### 添加新API服务

1. 在`src/services`目录下创建新的服务文件
2. 使用Axios进行API调用
3. 使用TanStack Query进行数据获取和缓存

## 贡献指南

### 代码规范

- 遵循TypeScript的类型安全原则
- 使用ESLint和Prettier进行代码检查和格式化
- 遵循组件化和模块化的设计原则

### 提交规范

- 使用语义化的提交消息
- 在提交前进行代码检查和测试
- 创建有意义的分支名称

## 常见问题

### 如何添加新的路由？

在`src/routes`目录下创建新的路由文件，并在需要的地方添加链接。

### 如何添加新的API服务？

在`src/services`目录下创建新的服务文件，并使用Axios进行API调用。

### 如何添加新的状态？

在`src/stores`目录下创建新的状态文件，并使用Zustand进行状态管理。

## 联系方式

如有问题或建议，请联系项目维护者。
