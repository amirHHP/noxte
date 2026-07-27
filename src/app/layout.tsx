import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "Noxte — بج‌های مینیاتوری هدیه همکاران",
  description:
    "فروشگاه بج و عروسک‌های ۱-۲ سانتی‌متری چاپ سه‌بعدی برای هدیه دادن به همکاران. خرید عمده، مشاور AI و ناوبری بر اساس ویژگی‌های اخلاقی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`}>
      <body className="min-h-full bg-[#faf9ff] font-[family-name:var(--font-vazirmatn)] text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
