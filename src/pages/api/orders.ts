import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    return createOrder(req, res, session.user.id);
  } else if (req.method === "GET") {
    return getOrders(req, res, session.user.id);
  }

  return res.status(405).json({ message: "Method not allowed" });
}

async function createOrder(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { name, email, phone, address, city, postalCode } = req.body;

    // Получаем корзину пользователя
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Вычисляем общую сумму заказа
    const totalAmount = cart.items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );

    // Создаем заказ
    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING",
        totalAmount,
        shippingAddress: {
          create: {
            name,
            email,
            phone,
            address,
            city,
            postalCode,
          },
        },
        items: {
          create: cart.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
          })),
        },
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    });

    // Очищаем корзину пользователя
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getOrders(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
