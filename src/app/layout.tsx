import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/providers/SessionProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { LocalizationProvider } from "@/providers/LocalizationProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ToasterProvider from "@/components/ToasterProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Fashion Store - Интернет-магазин одежды",
  description: "Модная одежда и аксессуары по доступным ценам",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-white dark:bg-dark-bg text-black dark:text-white`}>
        <SessionProvider>
          <ThemeProvider>
            <LocalizationProvider>
              <ProtectedRoute>
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-grow animate-fade-in">{children}</main>
                  <footer className="bg-black text-white dark:bg-dark-card py-8">
                    <div className="container mx-auto px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">О нас</h3>
                          <p className="text-gray-300">
                            Fashion Store - ваш надежный магазин модной одежды и
                            аксессуаров. Мы предлагаем широкий выбор товаров по
                            доступным ценам.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Контакты</h3>
                          <ul className="space-y-2 text-gray-300">
                            <li>Телефон: +7 (XXX) XXX-XX-XX</li>
                            <li>Email: support@example.com</li>
                            <li>Адрес: г. Москва, ул. Примерная, д. 1</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Полезные ссылки
                          </h3>
                          <ul className="space-y-2">
                            <li>
                              <a
                                href="/faq"
                                className="text-gray-300 hover:text-white transition-colors"
                              >
                                FAQ
                              </a>
                            </li>
                            <li>
                              <a
                                href="/catalog-new"
                                className="text-gray-300 hover:text-white transition-colors"
                              >
                                Каталог
                              </a>
                            </li>
                            <li>
                              <a
                                href="/profile"
                                className="text-gray-300 hover:text-white transition-colors"
                              >
                                Личный кабинет
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
                        <p>© 2024 Fashion Store. Все права защищены.</p>
                      </div>
                    </div>
                  </footer>
                </div>
              </ProtectedRoute>
            </LocalizationProvider>
          </ThemeProvider>
        </SessionProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
