"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Как сделать заказ?",
    answer: "Выберите понравившиеся товары в каталоге, добавьте их в корзину, перейдите в корзину и нажмите 'Оформить заказ'. Заполните форму с данными доставки и подтвердите заказ.",
  },
  {
    question: "Какие способы оплаты доступны?",
    answer: "Мы принимаем оплату банковскими картами (Visa, MasterCard, МИР) и наличными при получении заказа.",
  },
  {
    question: "Как осуществляется доставка?",
    answer: "Доставка осуществляется курьерской службой по всей России. Сроки доставки зависят от вашего региона и обычно составляют 1-7 рабочих дней.",
  },
  {
    question: "Возможен ли возврат товара?",
    answer: "Да, возврат возможен в течение 14 дней с момента получения заказа, если товар не был в употреблении и сохранены все бирки и упаковка.",
  },
  {
    question: "Как узнать статус заказа?",
    answer: "Статус заказа можно отслеживать в личном кабинете в разделе 'История заказов'. Также мы отправляем уведомления о статусе заказа на email.",
  },
  {
    question: "Есть ли у вас размерная сетка?",
    answer: "Да, размерная сетка доступна на странице каждого товара. Вы также можете связаться с нашей службой поддержки для помощи в выборе размера.",
  },
  {
    question: "Как связаться со службой поддержки?",
    answer: "Вы можете связаться с нами по телефону +7 (XXX) XXX-XX-XX или по email support@example.com. Время работы: пн-пт с 9:00 до 18:00.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Часто задаваемые вопросы
      </h1>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium">{item.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`px-6 overflow-hidden transition-all duration-200 ease-in-out ${
                openIndex === index ? "max-h-96 py-4" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-3xl mx-auto bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Остались вопросы?</h2>
        <p className="text-gray-600 mb-4">
          Если вы не нашли ответ на свой вопрос, свяжитесь с нашей службой
          поддержки. Мы всегда рады помочь!
        </p>
        <div className="space-y-2">
          <p className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>+7 (XXX) XXX-XX-XX</span>
          </p>
          <p className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>support@example.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
