import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-violet-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm text-white">
              ✦
            </span>
            <span className="font-bold text-gray-900">Noxte</span>
            <span className="text-sm text-gray-400">
              — بج‌های مینیاتوری ۳D برای هدیه به همکاران
            </span>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/shop" className="hover:text-violet-600">
              فروشگاه
            </Link>
            <Link href="/advisor" className="hover:text-violet-600">
              مشاور AI
            </Link>
            <Link href="/bulk" className="hover:text-violet-600">
              خرید عمده
            </Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          عروسک‌های ۱–۲ سانتی‌متری چاپ سه‌بعدی — ساخته شده با ❤️
        </p>
      </div>
    </footer>
  );
}
