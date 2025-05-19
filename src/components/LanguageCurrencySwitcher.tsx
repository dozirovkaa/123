"use client";

import { useLocalization } from "@/providers/LocalizationProvider";
import { useRouter } from "next/navigation";

const languages = [
  { code: "ru", label: "Русский", icon: "🇷🇺" },
  { code: "en", label: "English", icon: "🇬🇧" },
] as const;

const currencies = [
  { code: "RUB", symbol: "₽", label: "RUB", icon: "₽" },
  { code: "KZT", symbol: "₸", label: "KZT", icon: "₸" },
  { code: "USD", symbol: "$", label: "USD", icon: "$" },
] as const;

export default function LanguageCurrencySwitcher() {
  const { language, setLanguage, currency, setCurrency } = useLocalization();
  const router = useRouter();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as "ru" | "en";
    setLanguage(newLanguage);
    router.refresh();
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value as "RUB" | "KZT" | "USD";
    setCurrency(newCurrency);
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-3">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all cursor-pointer bg-no-repeat bg-right"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: '1.5em',
          paddingRight: '2.5em'
        }}
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="py-1">
            {`${lang.icon} ${lang.label}`}
          </option>
        ))}
      </select>

      <select
        value={currency}
        onChange={handleCurrencyChange}
        className="appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all cursor-pointer bg-no-repeat bg-right"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: '1.5em',
          paddingRight: '2.5em'
        }}
        aria-label="Select currency"
      >
        {currencies.map((cur) => (
          <option key={cur.code} value={cur.code} className="py-1">
            {`${cur.icon} ${cur.label}`}
          </option>
        ))}
      </select>
    </div>
  );
}
