"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
      title={language === "fa" ? "Switch to English" : "تغییر به زبان فارسی"}
      aria-label="Toggle language"
    >
      <Globe className="h-3.5 w-3.5 text-gray-500" />
      <span className={language === "fa" ? "font-bold text-gray-900" : "text-gray-400"}>
        FA
      </span>
      <span className="text-gray-300">/</span>
      <span className={language === "en" ? "font-bold text-gray-900" : "text-gray-400"}>
        EN
      </span>
    </button>
  );
}
