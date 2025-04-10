import { PrismaClient } from '@prisma/client';
import { argon2Hash } from '../src/common/utils/argon2';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@e-commerce.io' },
    update: {},
    create: {
      email: 'admin@e-commerce.io',
      username: 'seventhse',
      realName: 'Seventh season',
      password: await argon2Hash('seventhse'),
    },
  });

  await prisma.role.upsert({
    where: {
      name: 'Root',
    },
    update: {},
    create: { name: 'Root', description: '超级管理员角色.' },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
