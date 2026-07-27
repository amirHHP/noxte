"use client";

import Link from "next/link";
import { ShoppingBag, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";

const NAV_LINKS = [
  { href: "/shop", label: "فروشگاه" },
  { href: "/shop?browse=traits", label: "ویژگی‌های اخلاقی" },
  { href: "/advisor", label: "مشاور هدیه AI" },
  { href: "/bulk", label: "خرید عمده" },
];

export function Header() {
  const totalItems = useCartStore((s) => s.totalItems());
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg text-white shadow-lg shadow-violet-200">
            ✦
          </span>
          <div>
            <span className="text-lg font-bold text-gray-900">Noxte</span>
            <span className="mr-1 text-xs text-violet-500">بج‌های مینیاتوری</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/advisor"
            className="mr-2 flex items-center gap-1.5 rounded-full bg-gradient-to-l from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-200 transition hover:shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            مشاور AI
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700 transition hover:bg-violet-100"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-500 text-[10px] font-bold text-white">
                {totalItems > 99 ? "۹۹+" : totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-violet-100 bg-white px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-violet-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
