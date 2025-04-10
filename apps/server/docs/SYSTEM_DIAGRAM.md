# E-Commerce Server 系统架构图

## 系统层次结构

```
┌─────────────────────────────────────────────────────────────┐
│                      客户端应用                              │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         API 层                              │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐     │
│   │  控制器     │  │  DTO        │  │  Swagger 文档   │     │
│   └─────────────┘  └─────────────┘  └─────────────────┘     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        业务逻辑层                            │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐     │
│   │  服务       │  │  模块       │  │  业务异常处理   │     │
│   └─────────────┘  └─────────────┘  └─────────────────┘     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        数据访问层                            │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐     │
│   │  Prisma ORM │  │  数据模型   │  │  查询构建      │     │
│   └─────────────┘  └─────────────┘  └─────────────────┘     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        数据库                               │
│                                                             │
│   ┌─────────────────────────────────────────────────┐       │
│   │               PostgreSQL                         │       │
│   └─────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 核心模块关系图

```
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│               │      │               │      │               │
│     Auth      │◄────►│     User      │◄────►│     Role      │
│               │      │               │      │               │
└───────┬───────┘      └───────────────┘      └───────┬───────┘
        │                                             │
        │                                             │
        │                                             ▼
        │                                     ┌───────────────┐
        │                                     │               │
        │                                     │  Permission   │
        │                                     │               │
        │                                     └───────────────┘
        │
        ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│               │      │               │      │               │
│   Consumer    │◄────►│    Order      │◄────►│   OrderItem   │
│               │      │               │      │               │
└───────┬───────┘      └───────┬───────┘      └───────┬───────┘
        │                      │                      │
        ▼                      │                      │
┌───────────────┐              │                      │
│               │              │                      │
│    Address    │              │                      │
│               │              │                      │
└───────────────┘              │                      │
        ▲                      │                      │
        │                      │                      │
        │                      ▼                      ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│               │      │               │      │               │
│   CartItem    │◄────►│   Commodity   │◄────►│ CommodityImage│
│               │      │               │      │               │
└───────────────┘      └───────┬───────┘      └───────────────┘
                               │
                               ▼
                       ┌───────────────┐
                       │               │
                       │ CommodityCategory │
                       │               │
                       └───────────────┘
```

## 认证流程图

```
┌─────────┐                  ┌─────────┐                  ┌─────────┐
│         │                  │         │                  │         │
│ 客户端  │                  │  服务器 │                  │ 数据库  │
│         │                  │         │                  │         │
└────┬────┘                  └────┬────┘                  └────┬────┘
     │                            │                            │
     │      1. 登录请求           │                            │
     │ ─────────────────────────►│                            │
     │                            │                            │
     │                            │      2. 查询用户信息       │
     │                            │ ─────────────────────────►│
     │                            │                            │
     │                            │      3. 返回用户数据       │
     │                            │ ◄─────────────────────────│
     │                            │                            │
     │                            │  4. 验证密码               │
     │                            │─────┐                      │
     │                            │     │                      │
     │                            │◄────┘                      │
     │                            │                            │
     │                            │  5. 生成JWT令牌            │
     │                            │─────┐                      │
     │                            │     │                      │
     │                            │◄────┘                      │
     │                            │                            │
     │      6. 返回令牌           │                            │
     │ ◄─────────────────────────│                            │
     │                            │                            │
     │      7. 携带令牌的请求     │                            │
     │ ─────────────────────────►│                            │
     │                            │                            │
     │                            │  8. 验证令牌               │
     │                            │─────┐                      │
     │                            │     │                      │
     │                            │◄────┘                      │
     │                            │                            │
     │      9. 返回受保护资源     │                            │
     │ ◄─────────────────────────│                            │
     │                            │                            │
```

## 订单处理流程图

```
┌─────────┐                  ┌─────────┐                  ┌─────────┐
│         │                  │         │                  │         │
│ 客户端  │                  │  服务器 │                  │ 数据库  │
│         │                  │         │                  │         │
└────┬────┘                  └────┬────┘                  └────┬────┘
     │                            │                            │
     │   1. 添加商品到购物车      │                            │
     │ ─────────────────────────►│                            │
     │                            │                            │
     │                            │   2. 保存购物车项          │
     │                            │ ─────────────────────────►│
     │                            │                            │
     │   3. 创建订单              │                            │
     │ ─────────────────────────►│                            │
     │                            │                            │
     │                            │   4. 创建订单记录          │
     │                            │ ─────────────────────────►│
     │                            │                            │
     │                            │   5. 创建订单项            │
     │                            │ ─────────────────────────►│
     │                            │                            │
     │   6. 支付订单              │                            │
     │ ─────────────────────────►│                            │
     │                            │                            │
     │                            │   7. 更新订单状态          │
     │                            │ ─────────────────────────►│
     │                            │                            │
     │   8. 确认收货              │                            │
     │ ─────────────────────────►│                            │
     │                            │                            │
     │                            │   9. 完成订单              │
     │                            │ ─────────────────────────►│
     │                            │                            │
```
