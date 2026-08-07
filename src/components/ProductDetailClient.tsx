"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BulkOrderPanel } from "@/components/BulkOrderPanel";
import { TRAIT_LABELS } from "@/lib/traits";
import type { Product } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/language-context";

export function ProductDetailClient({ product }: { product: Product }) {
  const { t, language, dir } = useLanguage();

  const ArrowIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/shop"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-900"
      >
        <ArrowIcon className="h-4 w-4" />
        {language === "fa" ? "بازگشت به فروشگاه" : "Back to Shop"}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div
          className="flex items-center justify-center rounded-3xl p-16 text-[120px]"
          style={{ backgroundColor: product.color }}
        >
          {product.emoji}
        </div>

        <div>
          <h1 className="text-3xl font-black text-gray-900">{product.name}</h1>
          <p className="mt-1 text-sm text-gray-400">{product.nameEn}</p>
          <p className="mt-4 leading-relaxed text-gray-600">
            {product.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.traits.map((trait) => {
              const info = TRAIT_LABELS[trait];
              if (!info) return null;
              const traitLabel = info[language] || info.fa;
              return (
                <Link
                  key={trait}
                  href={`/shop?trait=${trait}`}
                  className="rounded-full px-3 py-1 text-xs font-medium transition hover:opacity-80"
                  style={{
                    backgroundColor: info.color + "22",
                    color: info.color,
                  }}
                >
                  {info.emoji} {traitLabel}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.occasion.map((occ) => (
              <span
                key={occ}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
              >
                🎁 {occ}
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm text-gray-400">
            {language === "fa"
              ? `اندازه: ${product.size} | چاپ سه‌بعدی PLA`
              : `Size: ${product.size} | 3D Printed PLA`}
          </p>

          <div className="mt-8">
            <BulkOrderPanel product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
