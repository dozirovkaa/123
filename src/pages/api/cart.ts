import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  size: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (req.method) {
    case "GET":
      return getCart(req, res, session.user.id);
    case "POST":
      return addToCart(req, res, session.user.id);
    case "PUT":
      return updateCartItem(req, res, session.user.id);
    case "DELETE":
      return removeFromCart(req, res, session.user.id);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

// Получить корзину пользователя
async function getCart(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      // Создаем корзину, если её нет
      const newCart = await prisma.cart.create({
        data: {
          userId,
          items: {},
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      return res.status(200).json(newCart);
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error getting cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Добавить товар в корзину
async function addToCart(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { productId, quantity, size } = req.body;

    if (!productId || !quantity || !size) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        size,
      },
    });

    if (existingItem) {
      // Обновляем количество существующего товара
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Добавляем новый товар
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          size,
        },
      });
    }

    return res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Обновить количество товара в корзине
async function updateCartItem(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { itemId, quantity } = req.body;

    if (!itemId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Проверяем, принадлежит ли товар этой корзине
    const cartItem = cart.items.find((item: CartItem) => item.id === itemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return res.status(200).json({ message: "Cart item updated" });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Удалить товар из корзины
async function removeFromCart(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Missing item ID" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Проверяем, принадлежит ли товар этой корзине
    const cartItem = cart.items.find((item: CartItem) => item.id === itemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
