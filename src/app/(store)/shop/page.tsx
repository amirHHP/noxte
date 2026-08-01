"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { PersonalityNav } from "@/components/PersonalityNav";
import { PRODUCTS, getProductsByTrait } from "@/lib/products";
import { TRAIT_LABELS } from "@/lib/traits";
import type { PersonalityTrait } from "@/lib/types";

function ShopContent() {
  const searchParams = useSearchParams();
  const trait = searchParams.get("trait") as PersonalityTrait | null;
  const browse = searchParams.get("browse");
  const search = searchParams.get("q");

  let products = PRODUCTS;
  let title = "همه محصولات";
  let subtitle = `${PRODUCTS.length} بج مینیاتوری`;

  if (trait && TRAIT_LABELS[trait]) {
    products = getProductsByTrait(trait);
    title = `بج برای ${TRAIT_LABELS[trait].fa}‌ها`;
    subtitle = TRAIT_LABELS[trait].description;
  } else if (search) {
    const q = search.toLowerCase();
    products = PRODUCTS.filter(
      (p) =>
        p.name.includes(q) ||
        p.description.includes(q) ||
        p.traits.some((t) => TRAIT_LABELS[t].fa.includes(q))
    );
    title = `نتایج جستجو: «${search}»`;
    subtitle = `${products.length} محصول یافت شد`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-500">{subtitle}</p>
      </div>

      {(browse === "traits" || trait) && (
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-medium text-gray-500">
            فیلتر بر اساس ویژگی اخلاقی
          </h2>
          <PersonalityNav activeTrait={trait} compact />
        </div>
      )}

      {!browse && !trait && (
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-medium text-gray-500">
            ناوبری بر اساس ویژگی اخلاقی
          </h2>
          <PersonalityNav compact />
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-4 text-gray-500">محصولی یافت نشد</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
