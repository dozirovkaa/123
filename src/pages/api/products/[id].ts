import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Parse sizes from JSON string
    const sizes = JSON.parse(product.sizes);

    // Transform the product data
    const transformedProduct = {
      ...product,
      sizes,
      details: {
        material: "100% Cotton",
        care: [
          "Machine wash cold",
          "Do not bleach",
          "Tumble dry low",
          "Iron on low heat",
        ],
        features: [
          "Premium quality material",
          "Comfortable fit",
          "Durable construction",
          "Easy care instructions",
        ],
      },
    };

    return res.status(200).json(transformedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
