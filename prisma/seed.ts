import { PrismaClient } from '@prisma/client';
import { getShoppingListDataForSeed } from './shoppingList/shoppingListSeed';
import { getUserDataForSeed } from './user/userSeed';
const prisma = new PrismaClient();

async function main() {
  const usersData = await getUserDataForSeed();
  for (const user of usersData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        nickname: user.nickname,
        email: user.email,
        password: user.password,
        isActive: user.isActive,
      },
    });
    console.log(user);
  }

  const shoppingListData = await getShoppingListDataForSeed();
  for (const shoppingList of shoppingListData) {
    await prisma.shoppingList.upsert({
      where: { id: shoppingList.id },
      update: {},
      create: {
        name: shoppingList.name,
        createdAt: shoppingList.createdAt,
      },
    });
    console.log(shoppingList);
  }
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
