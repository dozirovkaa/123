"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Currency = "RUB" | "KZT" | "USD";
type Language = "ru" | "en";

interface LocalizationContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  formatPrice: (price: number) => string;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const exchangeRates = {
  RUB: 1,
  KZT: 5.5,
  USD: 0.011,
};

const translations = {
  ru: {
    // Navigation
    home: "Главная",
    catalog: "Каталог",
    cart: "Корзина",
    profile: "Профиль",
    login: "Войти",
    logout: "Выйти",
    orders: "Заказы",
    
    // Categories
    all: "Все",
    accessories: "Аксессуары",
    outerwear: "Верхняя одежда",
    dresses: "Платья",
    
    // Product
    addToCart: "В корзину",
    adding: "Добавление...",
    selectSize: "Выберите размер",
    outOfStock: "Нет в наличии",
    
    // Cart
    emptyCart: "Корзина пуста",
    total: "Итого",
    checkout: "Оформить заказ",
    
    // Messages
    errorAdding: "Ошибка при добавлении в корзину",
    loginRequired: "Необходимо войти в систему",
    addedToCart: "Товар добавлен в корзину",
    loginSuccess: "Вход выполнен успешно",
    loginError: "Ошибка при входе",
    loggingIn: "Выполняется вход...",
    
    // Auth
    email: "Email",
    password: "Пароль",
    register: "Зарегистрироваться",
    noAccount: "Нет аккаунта?",
    forgotPassword: "Забыли пароль?",
    
    // Profile
    fullName: "Полное имя",
    phone: "Телефон",
    address: "Адрес",
    city: "Город",
    edit: "Редактировать",
  },
  en: {
    // Navigation
    home: "Home",
    catalog: "Catalog",
    cart: "Cart",
    profile: "Profile",
    login: "Login",
    logout: "Logout",
    orders: "Orders",
    
    // Categories
    all: "All",
    accessories: "Accessories",
    outerwear: "Outerwear",
    dresses: "Dresses",
    
    // Product
    addToCart: "Add to Cart",
    adding: "Adding...",
    selectSize: "Select Size",
    outOfStock: "Out of Stock",
    
    // Cart
    emptyCart: "Cart is Empty",
    total: "Total",
    checkout: "Checkout",
    
    // Messages
    errorAdding: "Error adding to cart",
    loginRequired: "Login required",
    addedToCart: "Added to cart",
    loginSuccess: "Login successful",
    loginError: "Login failed",
    loggingIn: "Logging in...",
    
    // Auth
    email: "Email",
    password: "Password",
    register: "Register",
    noAccount: "Don't have an account?",
    forgotPassword: "Forgot password?",
    
    // Profile
    fullName: "Full Name",
    phone: "Phone",
    address: "Address",
    city: "City",
    edit: "Edit",
  },
};

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("RUB");
  const [language, setLanguage] = useState<Language>("ru");
  const router = useRouter();

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") as Currency;
    const savedLanguage = localStorage.getItem("language") as Language;

    if (savedCurrency) setCurrency(savedCurrency);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
    router.refresh();
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    document.documentElement.lang = newLanguage;
    router.refresh();
  };

  const formatPrice = (priceInRub: number) => {
    const convertedPrice = priceInRub * exchangeRates[currency];
    
    return new Intl.NumberFormat(language === "ru" ? "ru-RU" : "en-US", {
      style: "currency",
      currency: currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(convertedPrice);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations["ru"]] || key;
  };

  return (
    <LocalizationContext.Provider
      value={{
        currency,
        setCurrency: handleCurrencyChange,
        language,
        setLanguage: handleLanguageChange,
        formatPrice,
        t,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error("useLocalization must be used within a LocalizationProvider");
  }
  return context;
}
