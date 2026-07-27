import Link from "next/link";
import { Sparkles, Package, Heart, ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { PersonalityNav } from "@/components/PersonalityNav";
import { PRODUCTS } from "@/lib/products";

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-600 via-violet-700 to-fuchsia-700 px-4 py-20 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-10 top-10 text-8xl">💗</div>
          <div className="absolute right-20 top-20 text-6xl">⭐</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">🚀</div>
          <div className="absolute bottom-20 right-10 text-5xl">👑</div>
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm backdrop-blur">
            عروسک‌های ۱–۲ سانتی‌متری چاپ سه‌بعدی
          </p>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            هدیه‌ای کوچک،
            <br />
            <span className="text-yellow-300">احساسی بزرگ</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-violet-100">
            بج‌های مینیاتوری برای قدردانی از همکاران. خرید تکی یا عمده،
            با مشاور هوشمند AI بهترین هدیه را پیدا کنید.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-violet-700 shadow-xl transition hover:shadow-2xl"
            >
              <Package className="h-5 w-5" />
              مشاهده فروشگاه
            </Link>
            <Link
              href="/advisor"
              className="flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold backdrop-blur transition hover:bg-white/20"
            >
              <Sparkles className="h-5 w-5" />
              مشاور AI هدیه
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
              title: "هدیه بر اساس شخصیت",
              desc: "بر اساس ویژگی‌های اخلاقی همکار، بج مناسب را پیدا کنید",
              href: "/shop?browse=traits",
              color: "from-pink-500 to-rose-500",
            },
            {
              icon: <Sparkles className="h-6 w-6" />,
              title: "مشاور هوشمند AI",
              desc: "همکار را توصیف کنید یا اسکرین‌شات چت بفرستید",
              href: "/advisor",
              color: "from-violet-500 to-purple-500",
            },
            {
              icon: <Package className="h-6 w-6" />,
              title: "خرید عمده",
              desc: "تا ۳۰٪ تخفیف برای خرید بالای ۱۰۰ عدد",
              href: "/bulk",
              color: "from-amber-500 to-orange-500",
            },
          ].map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white`}
              >
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{feature.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-violet-600 opacity-0 transition group-hover:opacity-100">
                بیشتر بدانید
                <ArrowLeft className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Personality Navigation */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-gray-900">
              بر اساس ویژگی اخلاقی جستجو کنید
            </h2>
            <p className="mt-2 text-gray-500">
              همکارتان چه ویژگی‌ای دارد؟ روی آن کلیک کنید
            </p>
          </div>
          <PersonalityNav />
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">محصولات محبوب</h2>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            همه محصولات
            <ArrowLeft className="h-4 w-4" />
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
