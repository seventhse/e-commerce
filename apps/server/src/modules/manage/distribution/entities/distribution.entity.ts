import { Distribution as IDistribution } from '@prisma/client';

export class DistributionEntity implements IDistribution {
  id: string;
  salesId: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}