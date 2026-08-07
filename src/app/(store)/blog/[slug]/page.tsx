import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, Tag, Sparkles, Share2, ShoppingBag } from "lucide-react";
import { getPostBySlug, getRelatedPosts, BLOG_POSTS } from "@/lib/blog";
import { SEED_PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

interface BlogArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "مقاله یافت نشد | Noxte",
    };
  }

  return {
    title: `${post.title} | بلاگ Noxte`,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, 3);
  const relatedProducts = SEED_PRODUCTS.filter((p) =>
    post.relatedProductIds.includes(p.id)
  );

  // Schema.org Article Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Noxte",
      logo: {
        "@type": "ImageObject",
        url: "https://noxte.ir/icon.svg",
      },
    },
    keywords: post.keywords.join(", "),
  };

  return (
    <article className="min-h-screen bg-gray-50/30 py-10">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-gray-900"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به مقالات بلاگ
          </Link>
        </div>

        {/* Header Hero Box */}
        <header className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm md:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
            {post.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-noxte-blue/10 px-3 py-1 font-semibold text-noxte-blue"
              >
                <Tag className="h-3 w-3" />
                {t}
              </span>
            ))}
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              {post.date}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              {post.readTime}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-black leading-snug tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
            {post.title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-gray-600">
            {post.excerpt}
          </p>

          {/* Author Card & Share */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg">
                {post.author.avatar}
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-500">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <div
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-gray-600"
              >
                <Share2 className="h-3.5 w-3.5 text-gray-400" />
                <span>Noxte SEO Blog</span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Cover Image Box */}
        <div
          className="my-8 flex h-52 w-full items-center justify-center rounded-3xl text-8xl shadow-inner md:h-72"
          style={{ backgroundColor: post.coverColor }}
        >
          <span>{post.coverEmoji}</span>
        </div>

        {/* Content Body */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm md:p-10">
          <div className="prose prose-gray max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-blockquote:border-r-4 prose-blockquote:border-noxte-blue prose-blockquote:bg-blue-50/50 prose-blockquote:p-4 prose-blockquote:rounded-l-lg prose-table:w-full prose-table:text-sm prose-th:bg-gray-100 prose-th:p-3 prose-td:p-3 prose-td:border-b prose-td:border-gray-100">
            {post.content.split("\n\n").map((block, idx) => {
              const trimmed = block.trim();
              if (!trimmed) return null;

              // Render headings
              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    className="mt-8 mb-4 text-xl font-extrabold text-gray-900 md:text-2xl border-b border-gray-100 pb-2"
                  >
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }

              if (trimmed.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="mt-6 mb-3 text-lg font-bold text-gray-900"
                  >
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              // Render Blockquote
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote
                    key={idx}
                    className="my-6 rounded-r-xl border-r-4 border-noxte-red bg-red-50/40 p-4 text-sm font-medium italic text-gray-800"
                  >
                    {trimmed.replace("> ", "").replace(/"/g, "")}
                  </blockquote>
                );
              }

              // Render Lists
              if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                const items = trimmed.split("\n").map((line) => line.replace(/^[\*\-] /, ""));
                return (
                  <ul key={idx} className="my-4 space-y-2 list-disc pr-6 text-sm text-gray-700 leading-relaxed">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                );
              }

              // Render numbered list
              if (/^\d+\./.test(trimmed)) {
                const items = trimmed.split("\n").map((line) => line.replace(/^\d+\.\s*/, ""));
                return (
                  <ol key={idx} className="my-4 space-y-2 list-decimal pr-6 text-sm text-gray-700 leading-relaxed">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ol>
                );
              }

              // Normal Paragraph
              return (
                <p key={idx} className="my-4 text-sm md:text-base leading-relaxed text-gray-700">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Keywords / SEO Tags Footer */}
          <div className="mt-10 border-t border-gray-100 pt-6">
            <h4 className="text-xs font-bold text-gray-400">کلیدواژه‌های مقاله:</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {post.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-noxte-blue" />
                <h3 className="text-lg font-bold text-gray-900">
                  بج‌های سینه مرتبط با این مقاله
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs font-semibold text-gray-500 hover:text-gray-900"
              >
                مشاهده همه بج‌ها ←
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* AI & Bulk Order Banner */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* AI Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-yellow-300 w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              مشاور هوشمند Noxte
            </div>
            <h4 className="mt-3 text-lg font-bold">
              انتخاب بج بر اساس شخصیت همکار
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-purple-200">
              با هوش مصنوعی Noxte، ویژگی‌های اخلاقی همکارتان را بنویسید تا بهترین پیشنهاد هدیه را دریافت کنید.
            </p>
            <Link
              href="/advisor"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-900 transition hover:bg-gray-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              مشاوره آنلاین هوشمند
            </Link>
          </div>

          {/* Bulk Order Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-rose-500 to-red-600 p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white w-fit">
              <span>🏢</span>
              سفارش سازمانی و تیمی
            </div>
            <h4 className="mt-3 text-lg font-bold">
              تخفیف ویژه سفارش عمده برای شرکت‌ها
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-rose-100">
              امکان سفارش عمده بج‌های مینیاتوری با تخفیف‌های ۱۰٪ تا ۳۰٪ و بسته بندی اختصاصی.
            </p>
            <Link
              href="/bulk"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-900 transition hover:bg-gray-100"
            >
              محاسبه قیمت و سفارش عمده
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-14 border-t border-gray-200/80 pt-10">
            <h3 className="mb-6 text-lg font-bold text-gray-900">
              سایر مقالات مفید
            </h3>

            <div className="grid gap-6 sm:grid-cols-3">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.slug}
                  href={`/blog/${rPost.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className="flex h-28 w-full items-center justify-center rounded-xl text-4xl"
                    style={{ backgroundColor: rPost.coverColor }}
                  >
                    <span>{rPost.coverEmoji}</span>
                  </div>

                  <h4 className="mt-3 text-xs font-bold leading-snug text-gray-900 transition group-hover:text-noxte-red">
                    {rPost.title}
                  </h4>

                  <span className="mt-auto pt-3 text-[11px] font-semibold text-gray-400">
                    {rPost.readTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
