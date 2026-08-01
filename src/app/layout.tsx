import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "Noxte — نقطه یه نشونه‌س",
  description:
    "بج‌های مینیاتوری هدیه همکاران — هر نقطه نشونه‌ای از یک داستانه. خرید بج و عروسک‌های ۱-۲ سانتی‌متری چاپ سه‌بعدی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`}>
      <body className="min-h-full bg-white font-[family-name:var(--font-vazirmatn)] text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
