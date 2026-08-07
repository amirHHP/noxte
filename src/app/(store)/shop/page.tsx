"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { PersonalityNav } from "@/components/PersonalityNav";
import { PRODUCTS, getProductsByTrait } from "@/lib/products";
import { TRAIT_LABELS } from "@/lib/traits";
import type { Product, PersonalityTrait } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/language-context";

function ShopContent() {
  const searchParams = useSearchParams();
  const trait = searchParams.get("trait") as PersonalityTrait | null;
  const browse = searchParams.get("browse");
  const search = searchParams.get("q");

  const [dbProducts, setDbProducts] = useState<Product[] | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setDbProducts(data);
      })
      .catch(() => {});
  }, []);

  const allProducts = dbProducts ?? PRODUCTS;

  let products = allProducts;
  let title = t("shopTitle");
  let subtitle = language === "fa"
    ? `${allProducts.length.toLocaleString("fa-IR")} بج مینیاتوری`
    : `${allProducts.length} miniature pins`;

  if (trait && TRAIT_LABELS[trait]) {
    if (dbProducts) {
      products = allProducts.filter((p) =>
        p.traits.includes(trait)
      );
    } else {
      products = getProductsByTrait(trait);
    }
    const label = TRAIT_LABELS[trait][language] || TRAIT_LABELS[trait].fa;
    title = language === "fa" ? `بج برای ${label}‌ها` : `Pins for ${label}s`;
    subtitle = TRAIT_LABELS[trait].description;
  } else if (search) {
    const q = search.toLowerCase();
    products = allProducts.filter(
      (p) =>
        p.name.includes(q) ||
        p.description.includes(q) ||
        p.traits.some((tr) => TRAIT_LABELS[tr]?.[language]?.toLowerCase().includes(q) || TRAIT_LABELS[tr]?.fa.includes(q))
    );
    title = language === "fa" ? `نتایج جستجو: «${search}»` : `Search results: "${search}"`;
    subtitle = language === "fa"
      ? `${products.length.toLocaleString("fa-IR")} محصول یافت شد`
      : `${products.length} products found`;
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
            {language === "fa" ? "فیلتر بر اساس ویژگی اخلاقی" : "Filter by Personality Trait"}
          </h2>
          <PersonalityNav activeTrait={trait} compact />
        </div>
      )}

      {!browse && !trait && (
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-medium text-gray-500">
            {language === "fa" ? "ناوبری بر اساس ویژگی اخلاقی" : "Browse by Personality Trait"}
          </h2>
          <PersonalityNav compact />
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-4 text-gray-500">{t("noProductsFound")}</p>
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
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-gray-400">
          ...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
