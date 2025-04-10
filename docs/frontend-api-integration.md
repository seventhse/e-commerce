# 前端API对接文档

本文档基于后端Swagger API文档，整理了前端需要开发的功能和对应的API接口。

## 1. 认证模块

### 1.1 用户登录

- **API接口**: `POST /api/v1/manage/auth/signIn`
- **前端组件**: `UserAuthForm`
- **功能描述**: 用户通过用户名/邮箱/手机号和密码登录系统
- **优先级**: 高
- **状态**: 已完成

### 1.2 用户登出

- **API接口**: `GET /api/v1/manage/auth/signOut`
- **前端组件**: `ProfileDropdown`, `NavUser`
- **功能描述**: 用户退出登录
- **优先级**: 高
- **状态**: 已完成

### 1.3 获取用户信息

- **API接口**: `GET /api/v1/manage/auth/getUserInfo`
- **前端组件**: `ProfileDropdown`, `NavUser`
- **功能描述**: 获取当前登录用户的详细信息
- **优先级**: 高
- **状态**: 已完成

### 1.4 刷新令牌

- **API接口**: `GET /api/v1/manage/auth/refreshToken`
- **前端组件**: 无（在API客户端中自动处理）
- **功能描述**: 刷新访问令牌
- **优先级**: 高
- **状态**: 已完成

## 2. 用户管理模块

### 2.1 用户列表

- **API接口**: `GET /api/v1/manage/users/page`
- **前端组件**: `UserList`
- **功能描述**: 分页获取用户列表，支持搜索和筛选
- **优先级**: 中
- **状态**: 待开发

### 2.2 用户详情

- **API接口**: `GET /api/v1/manage/users/:id`
- **前端组件**: `UserDetail`
- **功能描述**: 查看用户详细信息
- **优先级**: 中
- **状态**: 待开发

### 2.3 创建用户

- **API接口**: `POST /api/v1/manage/users`
- **前端组件**: `UserForm`
- **功能描述**: 创建新用户
- **优先级**: 中
- **状态**: 待开发

### 2.4 更新用户

- **API接口**: `PUT /api/v1/manage/users/:id`
- **前端组件**: `UserForm`
- **功能描述**: 更新用户信息
- **优先级**: 中
- **状态**: 待开发

### 2.5 删除用户

- **API接口**: `DELETE /api/v1/manage/users/:id`
- **前端组件**: `DeleteUserDialog`
- **功能描述**: 删除用户
- **优先级**: 中
- **状态**: 待开发

## 3. 商品管理模块

### 3.1 商品列表

- **API接口**: `GET /api/v1/manage/commodity/page`
- **前端组件**: `ProductList`
- **功能描述**: 分页获取商品列表，支持搜索和筛选
- **优先级**: 高
- **状态**: 已完成

### 3.2 商品详情

- **API接口**: `GET /api/v1/manage/commodity/detail/:id`
- **前端组件**: `ProductDetail`
- **功能描述**: 查看商品详细信息
- **优先级**: 高
- **状态**: 待开发

### 3.3 创建商品

- **API接口**: `POST /api/v1/manage/commodity/create`
- **前端组件**: `ProductForm`
- **功能描述**: 创建新商品
- **优先级**: 高
- **状态**: 待开发

### 3.4 更新商品

- **API接口**: `POST /api/v1/manage/commodity/update`
- **前端组件**: `ProductForm`
- **功能描述**: 更新商品信息
- **优先级**: 高
- **状态**: 待开发

### 3.5 删除商品

- **API接口**: `POST /api/v1/manage/commodity/delete`
- **前端组件**: `DeleteProductDialog`
- **功能描述**: 删除商品
- **优先级**: 高
- **状态**: 待开发

## 4. 商品分类管理模块

### 4.1 分类列表

- **API接口**: `GET /api/v1/manage/commodity-category/page`
- **前端组件**: `CategoryList`
- **功能描述**: 分页获取商品分类列表
- **优先级**: 中
- **状态**: 待开发

### 4.2 分类详情

- **API接口**: `GET /api/v1/manage/commodity-category/detail/:id`
- **前端组件**: `CategoryDetail`
- **功能描述**: 查看分类详细信息
- **优先级**: 中
- **状态**: 待开发

### 4.3 创建分类

- **API接口**: `POST /api/v1/manage/commodity-category/create`
- **前端组件**: `CategoryForm`
- **功能描述**: 创建新分类
- **优先级**: 中
- **状态**: 待开发

### 4.4 更新分类

- **API接口**: `POST /api/v1/manage/commodity-category/update`
- **前端组件**: `CategoryForm`
- **功能描述**: 更新分类信息
- **优先级**: 中
- **状态**: 待开发

### 4.5 删除分类

- **API接口**: `POST /api/v1/manage/commodity-category/delete`
- **前端组件**: `DeleteCategoryDialog`
- **功能描述**: 删除分类
- **优先级**: 中
- **状态**: 待开发

## 5. 订单管理模块

### 5.1 订单列表

- **API接口**: `GET /api/v1/manage/orders/page`
- **前端组件**: `OrderList`
- **功能描述**: 分页获取订单列表，支持搜索和筛选
- **优先级**: 高
- **状态**: 待开发

### 5.2 订单详情

- **API接口**: `GET /api/v1/manage/orders/:id`
- **前端组件**: `OrderDetail`
- **功能描述**: 查看订单详细信息
- **优先级**: 高
- **状态**: 待开发

### 5.3 更新订单状态

- **API接口**: `PUT /api/v1/manage/orders/:id/status`
- **前端组件**: `UpdateOrderStatusForm`
- **功能描述**: 更新订单状态
- **优先级**: 高
- **状态**: 待开发

### 5.4 订单统计

- **API接口**: `GET /api/v1/manage/orders/statistics`
- **前端组件**: `OrderStatistics`
- **功能描述**: 查看订单统计数据
- **优先级**: 中
- **状态**: 待开发

## 6. 客户管理模块

### 6.1 客户列表

- **API接口**: `GET /api/v1/manage/consumers/page`
- **前端组件**: `ConsumerList`
- **功能描述**: 分页获取客户列表，支持搜索和筛选
- **优先级**: 中
- **状态**: 待开发

### 6.2 客户详情

- **API接口**: `GET /api/v1/manage/consumers/:id`
- **前端组件**: `ConsumerDetail`
- **功能描述**: 查看客户详细信息
- **优先级**: 中
- **状态**: 待开发

### 6.3 创建客户

- **API接口**: `POST /api/v1/manage/consumers`
- **前端组件**: `ConsumerForm`
- **功能描述**: 创建新客户
- **优先级**: 中
- **状态**: 待开发

### 6.4 更新客户

- **API接口**: `PUT /api/v1/manage/consumers/:id`
- **前端组件**: `ConsumerForm`
- **功能描述**: 更新客户信息
- **优先级**: 中
- **状态**: 待开发

### 6.5 删除客户

- **API接口**: `DELETE /api/v1/manage/consumers/:id`
- **前端组件**: `DeleteConsumerDialog`
- **功能描述**: 删除客户
- **优先级**: 中
- **状态**: 待开发

### 6.6 客户统计

- **API接口**: `GET /api/v1/manage/consumers/statistics`
- **前端组件**: `ConsumerStatistics`
- **功能描述**: 查看客户统计数据
- **优先级**: 低
- **状态**: 待开发

## 7. 地址管理模块

### 7.1 地址列表

- **API接口**: `GET /api/v1/manage/addresses/page`
- **前端组件**: `AddressList`
- **功能描述**: 分页获取地址列表
- **优先级**: 低
- **状态**: 待开发

### 7.2 地址详情

- **API接口**: `GET /api/v1/manage/addresses/:id`
- **前端组件**: `AddressDetail`
- **功能描述**: 查看地址详细信息
- **优先级**: 低
- **状态**: 待开发

## 8. 仪表盘模块

### 8.1 销售概览

- **API接口**: 综合多个统计接口
- **前端组件**: `SalesOverview`
- **功能描述**: 显示销售数据概览
- **优先级**: 中
- **状态**: 待开发

### 8.2 用户增长

- **API接口**: 综合用户统计接口
- **前端组件**: `UserGrowth`
- **功能描述**: 显示用户增长趋势
- **优先级**: 低
- **状态**: 待开发

### 8.3 订单状态分布

- **API接口**: `GET /api/v1/manage/orders/statistics`
- **前端组件**: `OrderStatusDistribution`
- **功能描述**: 显示订单状态分布
- **优先级**: 中
- **状态**: 待开发

### 8.4 热门商品

- **API接口**: 综合商品统计接口
- **前端组件**: `PopularProducts`
- **功能描述**: 显示热门商品列表
- **优先级**: 中
- **状态**: 待开发

## 9. 设置模块

### 9.1 账户设置

- **API接口**: 综合用户接口
- **前端组件**: `AccountSettings`
- **功能描述**: 管理账户设置
- **优先级**: 低
- **状态**: 待开发

### 9.2 外观设置

- **API接口**: 无（前端本地存储）
- **前端组件**: `AppearanceSettings`
- **功能描述**: 管理应用外观设置
- **优先级**: 低
- **状态**: 待开发

### 9.3 通知设置

- **API接口**: 待定
- **前端组件**: `NotificationSettings`
- **功能描述**: 管理通知设置
- **优先级**: 低
- **状态**: 待开发
