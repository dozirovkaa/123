"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocalization } from "@/providers/LocalizationProvider";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    sizes: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const router = useRouter();
  const { data: session } = useSession();
  const { formatPrice, language } = useLocalization();

  const translations = {
    ru: {
      addToCart: "В корзину",
      adding: "Добавление...",
      selectSize: "Выберите размер",
      errorAdding: "Ошибка при добавлении в корзину",
      loginRequired: "Необходимо войти в систему",
      addedToCart: "Товар добавлен в корзину",
    },
    en: {
      addToCart: "Add to Cart",
      adding: "Adding...",
      selectSize: "Select size",
      errorAdding: "Error adding to cart",
      loginRequired: "Login required",
      addedToCart: "Added to cart",
    },
  };

  const t = translations[language];

  const addToCart = async () => {
    if (!session) {
      toast.error(t.loginRequired, {
        duration: 5000,
        position: "top-center",
      });
      router.push("/auth/login");
      return;
    }

    if (!selectedSize && product.sizes.length > 0) {
      toast.error(t.selectSize, {
        duration: 5000,
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/cart-new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          size: selectedSize || "ONE SIZE",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      toast.success(t.addedToCart, {
        duration: 5000,
        position: "top-center",
      });
      
      router.refresh();
      router.push("/cart-new");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(t.errorAdding, {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on size buttons or add to cart button
    if ((e.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }
    router.push(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleProductClick}
      className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="font-medium text-lg mb-2 group-hover:text-black transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>

        {product.sizes.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              {t.selectSize}:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="font-bold text-lg">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={addToCart}
            disabled={loading || (product.sizes.length > 0 && !selectedSize)}
            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
              loading || (product.sizes.length > 0 && !selectedSize)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 active:transform active:scale-95"
            }`}
          >
            {loading ? t.adding : t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
