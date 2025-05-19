import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { category } = req.query;

    const products = await prisma.product.findMany({
      where: category ? {
        category: category as string,
      } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Преобразуем строку размеров JSON обратно в массив
    const productsWithParsedSizes = products.map((product: Product) => ({
      ...product,
      sizes: JSON.parse(product.sizes),
    }));

    return res.status(200).json(productsWithParsedSizes);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
