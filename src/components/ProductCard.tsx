"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { TRAIT_LABELS } from "@/lib/traits";
import { useCartStore } from "@/lib/cart-store";
import { useLanguage } from "@/lib/i18n/language-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { t, language } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const formattedPrice = language === "fa"
    ? product.price.toLocaleString("fa-IR")
    : product.price.toLocaleString("en-US");

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center text-4xl">
        {product.emoji || "🎁"}
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          {product.traits.slice(0, 2).map((trait) => {
            const info = TRAIT_LABELS[trait];
            if (!info) return null;
            const label = info[language] || info.fa;
            return (
              <span
                key={trait}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white shadow-sm"
                style={{ backgroundColor: info.color }}
              >
                {info.emoji} {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-gray-900 transition group-hover:text-gray-600">
          {language === "en" ? product.nameEn || product.name : product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
          {product.description}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-black text-gray-900">
                {formattedPrice}
              </span>
              <span className="mr-1 text-xs text-gray-500">{t("currency")}</span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  {t("addedToCart")}
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {t("addToCart")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
