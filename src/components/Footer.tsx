"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-auto border-t border-gray-100 bg-white">
      {/* Decorative dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[10%] top-4 h-2 w-2 rounded-full bg-noxte-red opacity-40" />
        <div className="absolute right-[20%] top-6 h-1.5 w-1.5 rounded-full bg-noxte-blue opacity-40" />
        <div className="absolute left-[50%] bottom-4 h-2 w-2 rounded-full bg-noxte-green opacity-40" />
        <div className="absolute right-[40%] bottom-8 h-1.5 w-1.5 rounded-full bg-noxte-yellow opacity-40" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900" />
            <span className="font-black text-gray-900">{t("brandName")}</span>
            <span className="text-sm text-gray-400">
              — {t("brandSlogan")}
            </span>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/shop" className="transition hover:text-gray-900">
              {t("navShop")}
            </Link>
            <Link href="/advisor" className="transition hover:text-gray-900">
              {t("navAdvisor")}
            </Link>
            <Link href="/bulk" className="transition hover:text-gray-900">
              {t("navBulk")}
            </Link>
            <Link href="/track" className="transition hover:text-gray-900">
              {t("navTrack")}
            </Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          {t("footerSlogan")}
        </p>
      </div>
    </footer>
  );
}
