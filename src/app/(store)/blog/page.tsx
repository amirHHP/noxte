import type { Metadata } from "next";
import { BlogListClient } from "./BlogListClient";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "بلاگ و مقالات تخصصی | Noxte — راهنمای هدیه سازمانی و فرهنگ تیمی",
  description:
    "مجموعه مقالات تخصصی درباره هدیه سازمانی، قدردانی از همکاران، بج سینه مینیاتوری، روانشناسی هدیه بر اساس شخصیت و راهکارهای افزایش تعامل تیمی.",
  keywords: [
    "بلاگ هدیه سازمانی",
    "مقاله قدردانی از همکار",
    "بج سینه مینیاتوری",
    "راهنمای گیفت سازمانی",
    "روانشناسی هدیه",
    "نقطه",
    "Noxte blog",
  ],
  openGraph: {
    title: "بلاگ و مقالات Noxte — راهنمای جامع هدیه سازمانی و همکار",
    description:
      "مقالات کاربردی در زمینه خرید هدیه سازمانی، پین و بج سینه سه‌بعدی و قدردانی تیمی.",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header section */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-noxte-red/10 px-4 py-1.5 text-xs font-semibold text-noxte-red">
            <span>●</span>
            <span>مجله تخصصی نقطه</span>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
            مقالات و راهنمای قدردانی تیمی
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
            راهنماهای کاربردی برای انتخاب بهترین هدیه سازمانی، روانشناسی هدیه‌دهی،
            و روش‌های خلاقانه برای ساختن تیمی باانگیزه و همدل.
          </p>
        </div>

        {/* Client side interactive search & grid */}
        <BlogListClient posts={BLOG_POSTS} />
      </div>
    </div>
  );
}
