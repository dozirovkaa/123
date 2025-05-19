"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocalization } from "@/providers/LocalizationProvider";
import Image from "next/image";

type Params = {
  id: string;
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  details: {
    material: string;
    care: string[];
    features: string[];
  };
}

export default function ProductPage() {
  const { id } = useParams() as Params;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { t } = useLocalization();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8" />
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="h-24 bg-gray-200 rounded mb-8" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {t("productNotFound")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("productNotFoundDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-[600px] rounded-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t("currency")} {product.price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("description")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {product.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("selectSize")}
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-sm font-medium rounded-md transition-all duration-300 transform hover:scale-105 ${
                    selectedSize === size
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("details")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t("material")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {product.details.material}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t("care")}
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  {product.details.care.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t("features")}
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  {product.details.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            disabled={!selectedSize}
            className={`w-full py-4 text-lg font-medium rounded-md transition-all duration-300 transform hover:scale-[1.02] ${
              selectedSize
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-gray-200 text-gray-500 dark:bg-gray-700 cursor-not-allowed"
            }`}
          >
            {selectedSize ? t("addToCart") : t("selectSizeFirst")}
          </button>
        </div>
      </div>
    </div>
  );
}
