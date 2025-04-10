import { Order as PrismaOrder } from '@prisma/client';

export class OrderEntity implements PrismaOrder {
  id: string;
  orderNumber: string;
  consumerId: string;
  addressId: string;
  totalPrice: any;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod: 'WECHAT' | 'ALIPAY' | 'CREDIT_CARD';
  createdAt: Date;
  updatedAt: Date;
}