import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Функция для объединения классов Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Форматирование цены
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(price);
}

// Форматирование даты
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Генерация уникального ID заказа
export function generateOrderId(): string {
  return `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Валидация email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Валидация телефона
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
  return phoneRegex.test(phone);
}

// Форматирование телефонного номера
export function formatPhoneNumber(value: string): string {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4)}`;
  }
  return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(
    4,
    7
  )}-${phoneNumber.slice(7, 9)}-${phoneNumber.slice(9, 11)}`;
}

// Получение размеров для разных категорий одежды
export function getSizesByCategory(category: string): string[] {
  const sizeMap: { [key: string]: string[] } = {
    "Верхняя одежда": ["XS", "S", "M", "L", "XL", "XXL"],
    Рубашки: ["XS", "S", "M", "L", "XL", "XXL"],
    Джинсы: ["28/32", "30/32", "32/32", "34/32", "36/32"],
    Платья: ["XS", "S", "M", "L", "XL"],
    Свитера: ["S", "M", "L", "XL"],
  };
  return sizeMap[category] || ["ONE SIZE"];
}

// Проверка доступности размера
export function isSizeAvailable(size: string, availableSizes: string[]): boolean {
  return availableSizes.includes(size);
}

// Расчет скидки
export function calculateDiscount(originalPrice: number, discountPercent: number): number {
  return originalPrice - (originalPrice * discountPercent) / 100;
}

// Получение статуса заказа на русском
export function getOrderStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    pending: "В обработке",
    processing: "Комплектуется",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменён",
  };
  return statusMap[status] || status;
}
