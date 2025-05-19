"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams ? searchParams.get("session_id") : null;

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    // В реальном приложении здесь нужно проверить статус оплаты через API
    setStatus("success");
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Ошибка при обработке заказа</h1>
          <p className="text-gray-600 mb-8">
            Произошла ошибка при обработке вашего заказа. Пожалуйста, попробуйте
            снова или свяжитесь с нашей службой поддержки.
          </p>
          <Link
            href="/cart"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Вернуться в корзину
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-green-500">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Заказ успешно оформлен!</h1>
        <p className="text-gray-600 mb-8">
          Спасибо за ваш заказ. Мы отправили подтверждение на вашу электронную
          почту.
        </p>
        <div className="space-x-4">
          <Link
            href="/profile"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Мои заказы
          </Link>
          <Link
            href="/catalog"
            className="inline-block bg-white text-black px-6 py-3 rounded-md border border-black hover:bg-gray-50 transition-colors"
          >
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  );
}
