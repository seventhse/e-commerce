import { Consumer as PrismaConsumer } from '@prisma/client';

export class ConsumerEntity implements PrismaConsumer {
  id: string;
  phone: string;
  username: string | null;
  avatar: string | null;
  password: string | null;
  frontCard: string | null;
  backCard: string | null;
  userCard: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
