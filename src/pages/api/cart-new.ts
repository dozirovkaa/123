import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // GET - Получить корзину пользователя
    if (req.method === "GET") {
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
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

      return res.status(200).json(cart || { id: null, items: [] });
    }

    // POST - Добавить товар в корзину
    if (req.method === "POST") {
      const { productId, quantity, size } = req.body;

      if (!productId || !quantity || !size) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Найти или создать корзину
      let cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: session.user.id,
          },
        });
      }

      // Проверить существование товара
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Добавить товар в корзину
      const cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          size,
        },
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
      });

      return res.status(200).json(cartItem);
    }

    // DELETE - Удалить товар из корзины
    if (req.method === "DELETE") {
      const { itemId } = req.query;

      if (!itemId || typeof itemId !== "string") {
        return res.status(400).json({ message: "Missing item ID" });
      }

      // Проверить, что товар принадлежит корзине пользователя
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: itemId,
          cart: {
            userId: session.user.id,
          },
        },
      });

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      // Удалить товар
      await prisma.cartItem.delete({
        where: { id: itemId },
      });

      return res.status(200).json({ message: "Item removed from cart" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error handling cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
