# Admin 目录结构说明

本文档详细说明了Admin系统的目录结构和各个文件的作用。

## 顶级目录

```
apps/admin/
├── docs/                  # 文档目录
├── node_modules/          # 依赖包
├── public/                # 静态资源
├── src/                   # 源代码
├── .env                   # 环境变量
├── .env.example           # 环境变量示例
├── .gitignore             # Git忽略文件
├── .prettierignore        # Prettier忽略文件
├── .prettierrc            # Prettier配置
├── CHANGELOG.md           # 变更日志
├── components.json        # 组件配置
├── eslint.config.js       # ESLint配置
├── index.html             # HTML入口文件
├── knip.config.ts         # Knip配置
├── LICENSE                # 许可证
├── package.json           # 包配置
├── pnpm-lock.yaml         # pnpm锁文件
├── postcss.config.js      # PostCSS配置
├── README.md              # 项目说明
├── tailwind.config.js     # Tailwind配置
├── tsconfig.app.json      # TypeScript配置（应用）
├── tsconfig.json          # TypeScript配置
├── tsconfig.node.json     # TypeScript配置（Node）
└── vite.config.ts         # Vite配置
```

## src 目录

```
src/
├── assets/                # 静态资源
├── components/            # 通用组件
│   ├── layout/            # 布局组件
│   │   └── data/          # 布局数据
│   └── ui/                # UI组件
├── config/                # 配置文件
├── context/               # React上下文
├── features/              # 功能模块
│   ├── apps/              # 应用管理
│   │   └── data/          # 应用数据
│   ├── auth/              # 认证相关
│   │   ├── forgot-password/ # 忘记密码
│   │   ├── otp/           # OTP验证
│   │   ├── sign-in/       # 登录
│   │   └── sign-up/       # 注册
│   ├── chats/             # 聊天功能
│   │   ├── components/    # 聊天组件
│   │   └── data/          # 聊天数据
│   ├── dashboard/         # 仪表盘
│   │   └── components/    # 仪表盘组件
│   ├── errors/            # 错误页面
│   ├── settings/          # 设置页面
│   │   ├── account/       # 账户设置
│   │   ├── appearance/    # 外观设置
│   │   ├── components/    # 设置组件
│   │   ├── display/       # 显示设置
│   │   ├── notifications/ # 通知设置
│   │   └── profile/       # 个人资料设置
│   ├── tasks/             # 任务管理
│   │   ├── components/    # 任务组件
│   │   ├── context/       # 任务上下文
│   │   └── data/          # 任务数据
│   └── users/             # 用户管理
│       ├── components/    # 用户组件
│       ├── context/       # 用户上下文
│       └── data/          # 用户数据
├── hooks/                 # 自定义Hooks
├── lib/                   # 工具库
├── routes/                # 路由定义
│   ├── _authenticated/    # 需要认证的路由
│   │   ├── apps/          # 应用路由
│   │   ├── chats/         # 聊天路由
│   │   ├── help-center/   # 帮助中心路由
│   │   ├── settings/      # 设置路由
│   │   ├── tasks/         # 任务路由
│   │   └── users/         # 用户路由
│   ├── (auth)/            # 认证相关路由
│   └── (errors)/          # 错误页面路由
├── services/              # API服务
├── stores/                # 状态存储
└── utils/                 # 工具函数
```

## 核心文件说明

### 配置文件

- **vite.config.ts**: Vite构建工具的配置文件
- **tailwind.config.js**: Tailwind CSS的配置文件
- **tsconfig.json**: TypeScript的配置文件
- **eslint.config.js**: ESLint的配置文件
- **.prettierrc**: Prettier的配置文件
- **components.json**: UI组件的配置文件

### 入口文件

- **index.html**: HTML入口文件
- **src/main.tsx**: React应用的入口文件

### 路由文件

- **src/routes/__root.tsx**: 根路由定义
- **src/routes/_authenticated/route.tsx**: 认证路由定义
- **src/routes/(auth)/sign-in.tsx**: 登录页面路由
- **src/routes/(auth)/sign-up.lazy.tsx**: 注册页面路由（懒加载）
- **src/routes/(auth)/forgot-password.lazy.tsx**: 忘记密码页面路由（懒加载）

### 组件文件

- **src/components/ui/**: 基础UI组件，如按钮、输入框、对话框等
- **src/components/layout/**: 布局组件，如侧边栏、导航栏等

### 功能模块

- **src/features/auth/**: 认证相关功能
- **src/features/users/**: 用户管理功能
- **src/features/dashboard/**: 仪表盘功能
- **src/features/settings/**: 设置功能

### 服务和状态

- **src/services/**: API服务
- **src/stores/**: 状态存储
- **src/context/**: React上下文

## 组件结构

每个功能模块通常包含以下结构：

```
feature/
├── components/            # 组件
├── context/               # 上下文（如果需要）
├── data/                  # 数据和常量
├── hooks/                 # 自定义Hooks（如果需要）
└── utils/                 # 工具函数（如果需要）
```

## 路由结构

路由使用TanStack Router，结构如下：

```
routes/
├── __root.tsx             # 根路由
├── _authenticated/        # 需要认证的路由
│   ├── route.tsx          # 认证路由定义
│   ├── index.tsx          # 认证首页（仪表盘）
│   └── [feature]/         # 功能路由
│       └── index.lazy.tsx # 功能首页（懒加载）
└── (auth)/                # 认证相关路由
    ├── sign-in.tsx        # 登录页面
    ├── sign-up.lazy.tsx   # 注册页面（懒加载）
    └── forgot-password.lazy.tsx # 忘记密码页面（懒加载）
```

## 状态管理

使用Zustand进行状态管理，主要状态存储在`src/stores/`目录中：

```
stores/
├── authStore.ts           # 认证状态
├── themeStore.ts          # 主题状态
└── sidebarStore.ts        # 侧边栏状态
```

## API服务

API服务位于`src/services/`目录，按功能模块组织：

```
services/
├── api.service.ts         # 基础API服务
├── auth.service.ts        # 认证服务
├── user.service.ts        # 用户服务
└── product.service.ts     # 商品服务
```

## 样式管理

使用Tailwind CSS进行样式管理，主要配置在：

```
tailwind.config.js         # Tailwind配置
src/styles/globals.css     # 全局样式
```

## 工具函数

通用工具函数位于`src/utils/`和`src/lib/`目录：

```
utils/                     # 工具函数
lib/                       # 工具库
```

## 自定义Hooks

自定义Hooks位于`src/hooks/`目录：

```
hooks/
├── use-toast.ts           # Toast通知Hook
├── use-media-query.ts     # 媒体查询Hook
└── use-debounce.ts        # 防抖Hook
```
