"use client";

import Link from "next/link";
import { Sparkles, Package, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { PersonalityNav } from "@/components/PersonalityNav";
import { FloatingDots } from "@/components/FloatingDots";
import { useLanguage } from "@/lib/i18n/language-context";
import type { Product } from "@/lib/types";

export function HomeClient({ products }: { products: Product[] }) {
  const { t, language, dir } = useLanguage();
  const featured = products.slice(0, 6);

  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 md:py-32">
        <FloatingDots count="many" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Black circle logo */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 shadow-2xl shadow-gray-300">
            <span className="sr-only">Noxte</span>
          </div>

          <h1 className="text-4xl font-black leading-tight text-gray-900 md:text-6xl whitespace-pre-line">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500 whitespace-pre-line">
            {t("heroSubtitle")}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-gray-200 transition hover:bg-gray-800 hover:shadow-2xl"
            >
              <Package className="h-5 w-5" />
              {t("viewShop")}
            </Link>
            <Link
              href="/advisor"
              className="flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-7 py-3.5 text-sm font-bold text-gray-900 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <Sparkles className="h-5 w-5" />
              {t("aiConsultation")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Heart className="h-6 w-6" />,
              title: language === "fa" ? "هدیه بر اساس شخصیت" : "Gifts by Trait",
              desc: language === "fa" ? "بر اساس ویژگی‌های اخلاقی همکار، بج مناسب را پیدا کنید" : "Find the perfect pin tailored to your teammate's personality",
              href: "/shop?browse=traits",
              dotColor: "bg-noxte-red",
            },
            {
              icon: <Sparkles className="h-6 w-6" />,
              title: language === "fa" ? "مشاور هوشمند AI" : "AI Smart Advisor",
              desc: language === "fa" ? "همکار را توصیف کنید یا اسکرین‌شات چت بفرستید" : "Describe your colleague or paste memories for AI suggestions",
              href: "/advisor",
              dotColor: "bg-noxte-blue",
            },
            {
              icon: <Package className="h-6 w-6" />,
              title: language === "fa" ? "خرید عمده" : "Bulk Orders",
              desc: language === "fa" ? "تا ۳۰٪ تخفیف برای خرید بالای ۱۰۰ عدد" : "Up to 30% discount for corporate orders over 100 pins",
              href: "/bulk",
              dotColor: "bg-noxte-green",
            },
          ].map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group rounded-2xl border border-gray-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-100"
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${feature.dotColor} transition group-hover:scale-150`}
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition group-hover:bg-gray-900 group-hover:text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{feature.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gray-400 transition group-hover:text-gray-900">
                {language === "fa" ? "بیشتر بدانید" : "Learn More"}
                <ArrowIcon className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Personality Navigation */}
      <section className="relative overflow-hidden bg-gray-50/50 px-4 py-16">
        <FloatingDots count="few" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-gray-900">
              {t("browseByTrait")}
            </h2>
            <p className="mt-2 text-gray-500">
              {language === "fa" ? "همکارتان چه ویژگی‌ای دارد؟ روی آن کلیک کنید" : "What trait matches your teammate? Click to filter"}
            </p>
          </div>
          <PersonalityNav />
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{t("featuredProducts")}</h2>
            <p className="mt-1 text-xs text-gray-400">{t("featuredProductsSub")}</p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            {t("viewAllProducts")}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
