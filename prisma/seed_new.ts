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
    // Платья
    {
      name: "Элегантное черное платье",
      description: "Классическое черное платье из премиального материала. Идеально подходит для особых случаев.",
      price: 7999.99,
      image: "https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg",
      category: "Платья",
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
      featured: true,
    },
    {
      name: "Летнее платье с цветочным принтом",
      description: "Легкое летнее платье с ярким цветочным узором. Идеально для теплых дней.",
      price: 4999.99,
      image: "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg",
      category: "Платья",
      sizes: JSON.stringify(["S", "M", "L"]),
      featured: false,
    },
    {
      name: "Вечернее платье макси",
      description: "Элегантное вечернее платье в пол с разрезом. Идеально для торжественных мероприятий.",
      price: 9999.99,
      image: "https://images.pexels.com/photos/291759/pexels-photo-291759.jpeg",
      category: "Платья",
      sizes: JSON.stringify(["XS", "S", "M", "L"]),
      featured: true,
    },
    // Верхняя одежда
    {
      name: "Кожаная куртка",
      description: "Стильная кожаная куртка с подкладкой. Универсальный предмет гардероба.",
      price: 12999.99,
      image: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg",
      category: "Верхняя одежда",
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      featured: true,
    },
    {
      name: "Тренч классический",
      description: "Элегантный тренч в классическом стиле. Незаменимая вещь для межсезонья.",
      price: 9999.99,
      image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg",
      category: "Верхняя одежда",
      sizes: JSON.stringify(["S", "M", "L"]),
      featured: false,
    },
    {
      name: "Пальто оверсайз",
      description: "Теплое пальто свободного кроя. Идеально для холодной погоды.",
      price: 14999.99,
      image: "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg",
      category: "Верхняя одежда",
      sizes: JSON.stringify(["S", "M", "L"]),
      featured: true,
    },
    // Аксессуары
    {
      name: "Кожаная сумка",
      description: "Вместительная сумка из натуральной кожи. Подходит для повседневного использования.",
      price: 5999.99,
      image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
      category: "Аксессуары",
      sizes: JSON.stringify(["ONE SIZE"]),
      featured: true,
    },
    {
      name: "Шелковый шарф",
      description: "Элегантный шарф из натурального шелка. Добавит изысканности любому образу.",
      price: 2999.99,
      image: "https://images.pexels.com/photos/1078973/pexels-photo-1078973.jpeg",
      category: "Аксессуары",
      sizes: JSON.stringify(["ONE SIZE"]),
      featured: false,
    },
    {
      name: "Кожаный ремень",
      description: "Классический ремень из натуральной кожи. Идеально дополнит деловой образ.",
      price: 1999.99,
      image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
      category: "Аксессуары",
      sizes: JSON.stringify(["S", "M", "L"]),
      featured: true,
    },
  ];

  // Очищаем существующие данные
  await prisma.orderItem.deleteMany();
  await prisma.shippingAddress.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Создаем продукты
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  // Создаем тестового пользователя
  const newUser = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      password: hashedPassword,
    },
  });

  // Создаем корзину для тестового пользователя
  const cart = await prisma.cart.create({
    data: {
      userId: newUser.id,
      items: {
        create: [
          {
            productId: (await prisma.product.findFirst({ where: { name: "Элегантное черное платье" } }))!.id,
            quantity: 1,
            size: "M",
          },
          {
            productId: (await prisma.product.findFirst({ where: { name: "Кожаная сумка" } }))!.id,
            quantity: 1,
            size: "ONE SIZE",
          },
        ],
      },
    },
  });

  // Создаем тестовый заказ
  await prisma.order.create({
    data: {
      userId: newUser.id,
      status: "DELIVERED",
      totalAmount: 13999.98,
      shippingAddress: {
        create: {
          name: "Test User",
          email: "test@example.com",
          phone: "+7 (999) 999-99-99",
          address: "ул. Примерная, д. 1",
          city: "Москва",
          postalCode: "123456",
        },
      },
      items: {
        create: [
          {
            productId: (await prisma.product.findFirst({ where: { name: "Элегантное черное платье" } }))!.id,
            quantity: 1,
            size: "M",
            price: 7999.99,
          },
          {
            productId: (await prisma.product.findFirst({ where: { name: "Кожаная сумка" } }))!.id,
            quantity: 1,
            size: "ONE SIZE",
            price: 5999.99,
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
