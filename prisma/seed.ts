import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Создаем тестового пользователя
  const hashedPassword = await hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: hashedPassword,
    },
  });

  // Создаем тестовые продукты
  const products = [
    {
      name: "Классическая белая рубашка",
      description: "Элегантная белая рубашка из 100% хлопка",
      price: 2999.99,
      image: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg",
      category: "Рубашки",
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    },
    {
      name: "Джинсы классические",
      description: "Классические джинсы прямого кроя",
      price: 4599.99,
      image: "https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg",
      category: "Джинсы",
      sizes: JSON.stringify(["28/32", "30/32", "32/32", "34/32", "36/32"]),
    },
    {
      name: "Кожаная куртка",
      description: "Стильная куртка из натуральной кожи",
      price: 12999.99,
      image: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg",
      category: "Верхняя одежда",
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
    },
    {
      name: "Шерстяное пальто",
      description: "Элегантное пальто из шерсти",
      price: 15999.99,
      image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg",
      category: "Верхняя одежда",
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  // Создаем корзину для тестового пользователя
  const cart = await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      items: {
        create: [
          {
            productId: (await prisma.product.findFirst({ where: { name: "Классическая белая рубашка" } }))!.id,
            quantity: 1,
            size: "M",
          },
          {
            productId: (await prisma.product.findFirst({ where: { name: "Джинсы классические" } }))!.id,
            quantity: 1,
            size: "32/32",
          },
        ],
      },
    },
  });

  // Создаем тестовый заказ
  await prisma.order.create({
    data: {
      userId: user.id,
      status: "delivered",
      totalAmount: 7599.98,
      shippingAddress: "ул. Примерная, д. 1, кв. 1",
      items: {
        create: [
          {
            productId: (await prisma.product.findFirst({ where: { name: "Классическая белая рубашка" } }))!.id,
            quantity: 1,
            size: "M",
            price: 2999.99,
          },
          {
            productId: (await prisma.product.findFirst({ where: { name: "Джинсы классические" } }))!.id,
            quantity: 1,
            size: "32/32",
            price: 4599.99,
          },
        ],
      },
    },
  });

  console.log("База данных успешно заполнена тестовыми данными");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
