"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, ArrowLeft, Sparkles, Tag, Calendar } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { useLanguage } from "@/lib/i18n/language-context";

interface BlogListClientProps {
  posts: BlogPost[];
}

export function BlogListClient({ posts }: BlogListClientProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  // Filter posts based on search and tag
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTag || post.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const featuredPost = posts[0];

  return (
    <div className="space-y-10">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی موضوع، مقاله یا کلیدواژه..."
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              پاک کردن
            </button>
          )}
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              selectedTag === null
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            همه موضوعات
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                selectedTag === tag
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article (Only if no search/filter active) */}
      {!searchQuery && !selectedTag && featuredPost && (
        <div className="group relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm transition hover:shadow-md md:p-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="flex h-48 w-full items-center justify-center rounded-2xl text-7xl lg:col-span-4 lg:h-64" style={{ backgroundColor: featuredPost.coverColor }}>
              <span>{featuredPost.coverEmoji}</span>
            </div>

            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
                <span className="rounded-full bg-noxte-red/10 px-3 py-1 font-semibold text-noxte-red">
                  ویژه
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {featuredPost.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featuredPost.readTime}
                </span>
              </div>

              <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-900 transition group-hover:text-noxte-red md:text-2xl">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                {featuredPost.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm">
                    {featuredPost.author.avatar}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      {featuredPost.author.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {featuredPost.author.role}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                >
                  مطالعه کامل مقاله
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {selectedTag ? `مقالات دسته «${selectedTag}»` : "آخرین مقالات"}
          </h2>
          <span className="text-xs text-gray-500">
            {filteredPosts.length} مقاله یافت شد
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">مقاله‌ای با این مشخصات پیدا نشد.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag(null);
              }}
              className="mt-3 text-xs font-semibold text-gray-900 hover:underline"
            >
              مشاهده همه مقالات
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Article Cover */}
                <div
                  className="flex h-40 w-full items-center justify-center text-5xl transition group-hover:scale-105"
                  style={{ backgroundColor: post.coverColor }}
                >
                  <span>{post.coverEmoji}</span>
                </div>

                {/* Article Info */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold leading-snug text-gray-900 transition group-hover:text-noxte-blue">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="mt-2 flex-1 line-clamp-3 text-xs leading-relaxed text-gray-600">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Author & Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs">
                        {post.author.avatar}
                      </span>
                      <span className="text-[11px] text-gray-600">
                        {post.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-semibold text-gray-900 transition hover:text-noxte-red"
                    >
                      بخوانید ←
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* AI Advisor Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-right">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-yellow-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              هوش مصنوعی Noxte
            </div>
            <h3 className="mt-3 text-xl font-black md:text-2xl">
              نمی‌دانید کدام بج برای همکارتان مناسب‌تر است؟
            </h3>
            <p className="mt-2 max-w-xl text-sm text-gray-300">
              ویژگی‌های اخلاقی یا خاطرات مشترک با همکارتان را در مشاور هوشمند بنویسید تا AI بهترین بج‌های مینیاتوری را با درصد تطابق پیشنهاد دهد.
            </p>
          </div>

          <Link
            href="/advisor"
            className="flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-gray-100 hover:shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            امتحان مشاور هوشمند
          </Link>
        </div>
      </div>
    </div>
  );
}
