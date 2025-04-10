import { OrderItem } from '@prisma/client';

export class OrderItemEntity implements OrderItem {
  id: string;
  orderId: string;
  commodityId: string;
  quantity: number;
  price: import("decimal.js")
  createdAt: Date;
  updatedAt: Date;
}