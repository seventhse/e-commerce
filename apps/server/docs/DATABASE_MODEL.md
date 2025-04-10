# E-Commerce Server 数据库模型关系图

## 数据库实体关系图

```
┌───────────────────────┐       ┌───────────────────────┐
│         User          │       │         Role          │
├───────────────────────┤       ├───────────────────────┤
│ id: String (PK)       │       │ id: String (PK)       │
│ username: String      │◄──┐   │ name: String          │
│ email: String?        │   │   │ description: String?  │
│ phone: String?        │   │   │ isActive: Boolean     │
│ realName: String?     │   │   │ createdAt: DateTime   │
│ avatar: String?       │   │   │ updatedAt: DateTime   │
│ password: String      │   │   └───────────────────────┘
│ isActive: Boolean     │   │              ▲
│ createdAt: DateTime   │   │              │
│ updatedAt: DateTime   │   │              │
│ deletedAt: DateTime?  │   │   ┌───────────────────────┐
└───────────────────────┘   │   │      UserRole         │
          ▲                 └───┤                       │
          │                     │ id: String (PK)       │
          │                     │ userId: String (FK)   │
          │                     │ roleId: String (FK)   │
┌───────────────────────┐       │ createdAt: DateTime   │
│     Distribution      │       │ updatedAt: DateTime   │
├───────────────────────┤       └───────────────────────┘
│ id: String (PK)       │                  │
│ salesId: String (FK)  │◄─────────────────┘
│ customerId: String (FK)│                  │
│ createdAt: DateTime   │                  ▼
│ updatedAt: DateTime   │       ┌───────────────────────┐
└───────────────────────┘       │     Permission        │
          │                     ├───────────────────────┤
          │                     │ id: String (PK)       │
          ▼                     │ name: String          │
┌───────────────────────┐       │ code: String          │
│       Consumer        │       │ description: String?  │
├───────────────────────┤       │ isActive: Boolean     │
│ id: String (PK)       │       │ createdAt: DateTime   │
│ phone: String         │       │ updatedAt: DateTime   │
│ username: String?     │       └───────────────────────┘
│ avatar: String?       │                  ▲
│ password: String?     │                  │
│ frontCard: String?    │                  │
│ backCard: String?     │       ┌───────────────────────┐
│ userCard: String?     │       │    RolePermission     │
│ createdAt: DateTime   │       ├───────────────────────┤
│ updatedAt: DateTime   │       │ id: String (PK)       │
│ deletedAt: DateTime?  │       │ roleId: String (FK)   │
└───────────────────────┘       │ permissionId: String  │
          ▲                     │ isActive: Boolean     │
          │                     │ createdAt: DateTime   │
          │                     │ updatedAt: DateTime   │
          │                     └───────────────────────┘
┌───────────────────────┐
│       Address         │
├───────────────────────┤
│ id: String (PK)       │
│ consumerId: String (FK)│◄─────┐
│ province: String      │      │
│ city: String          │      │
│ district: String      │      │
│ detail: String        │      │
│ isDefault: Boolean    │      │
│ createdAt: DateTime   │      │
│ updatedAt: DateTime   │      │
└───────────────────────┘      │
          ▲                    │
          │                    │
          │                    │
┌───────────────────────┐      │     ┌───────────────────────┐
│        Order          │      │     │      CartItem         │
├───────────────────────┤      │     ├───────────────────────┤
│ id: String (PK)       │      │     │ id: String (PK)       │
│ orderNumber: String   │      │     │ consumerId: String (FK)│◄────┐
│ consumerId: String (FK)│◄─────┘     │ commodityId: String   │     │
│ addressId: String (FK)│◄────────────┤ quantity: Int         │     │
│ totalPrice: Decimal   │            │ createdAt: DateTime   │     │
│ status: OrderStatus   │            │ updatedAt: DateTime   │     │
│ paymentMethod: PaymentMethod│      └───────────────────────┘     │
│ createdAt: DateTime   │                      │                   │
│ updatedAt: DateTime   │                      │                   │
└───────────────────────┘                      │                   │
          │                                    │                   │
          │                                    ▼                   │
          │                     ┌───────────────────────┐          │
          │                     │      Commodity        │          │
          │                     ├───────────────────────┤          │
          │                     │ id: String (PK)       │          │
          │                     │ name: String          │          │
          │                     │ description: String?  │          │
          │                     │ price: Decimal        │          │
          │                     │ stock: Int            │          │
          │                     │ mainImage: String?    │          │
          │                     │ categoryId: String (FK)│         │
          │                     │ isActive: Boolean     │          │
          │                     │ createdAt: DateTime   │          │
          │                     │ updatedAt: DateTime   │          │
          │                     └───────────────────────┘          │
          │                                  ▲                     │
          │                                  │                     │
          │                                  │                     │
          ▼                                  │                     │
┌───────────────────────┐                    │                     │
│      OrderItem        │                    │                     │
├───────────────────────┤                    │                     │
│ id: String (PK)       │                    │                     │
│ orderId: String (FK)  │                    │                     │
│ commodityId: String (FK)│◄──────────────────┘                     │
│ quantity: Int         │                                          │
│ price: Decimal        │                                          │
│ createdAt: DateTime   │                                          │
│ updatedAt: DateTime   │                                          │
└───────────────────────┘                                          │
                                                                   │
                                                                   │
┌───────────────────────┐                    ┌───────────────────────┐
│   CommodityCategory   │                    │    CommodityImage     │
├───────────────────────┤                    ├───────────────────────┤
│ id: String (PK)       │                    │ id: String (PK)       │
│ name: String          │                    │ image: String         │
│ description: String?  │                    │ sortOrder: Int        │
│ isDisplayed: Boolean? │                    │ alt: String?          │
│ isActive: Boolean?    │◄───────────────────┤ commodityId: String?  │
│ createdAt: DateTime   │                    │                       │
│ updatedAt: DateTime   │                    │                       │
└───────────────────────┘                    └───────────────────────┘
```

## 数据库枚举类型

### OrderStatus 枚举

```
enum OrderStatus {
  PENDING    // 待处理
  PAID       // 已支付
  SHIPPED    // 已发货
  DELIVERED  // 已送达
  CANCELLED  // 已取消
  REFUNDED   // 已退款
}
```

### PaymentMethod 枚举

```
enum PaymentMethod {
  WECHAT       // 微信支付
  ALIPAY       // 支付宝
  CREDIT_CARD  // 信用卡
}
```

## 主要关系说明

1. **用户-角色关系**:
   - 多对多关系，通过UserRole表实现
   - 一个用户可以有多个角色，一个角色可以分配给多个用户

2. **角色-权限关系**:
   - 多对多关系，通过RolePermission表实现
   - 一个角色可以有多个权限，一个权限可以分配给多个角色

3. **商品-分类关系**:
   - 多对一关系
   - 一个商品只能属于一个分类，一个分类可以包含多个商品

4. **商品-图片关系**:
   - 一对多关系
   - 一个商品可以有多个图片

5. **客户-地址关系**:
   - 一对多关系
   - 一个客户可以有多个地址

6. **客户-订单关系**:
   - 一对多关系
   - 一个客户可以有多个订单

7. **订单-订单项关系**:
   - 一对多关系
   - 一个订单可以包含多个订单项

8. **商品-订单项关系**:
   - 一对多关系
   - 一个商品可以出现在多个订单项中

9. **客户-购物车关系**:
   - 一对多关系
   - 一个客户可以有多个购物车项

10. **分销关系**:
    - 销售人员(User)和客户(Consumer)之间的关联关系
    - 通过Distribution表实现
