import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-gray-100 bg-white">
      {/* Decorative dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[10%] top-4 h-2 w-2 rounded-full bg-noxte-red opacity-40" />
        <div className="absolute right-[20%] top-6 h-1.5 w-1.5 rounded-full bg-noxte-blue opacity-40" />
        <div className="absolute left-[50%] bottom-4 h-2 w-2 rounded-full bg-noxte-green opacity-40" />
        <div className="absolute right-[40%] bottom-8 h-1.5 w-1.5 rounded-full bg-noxte-yellow opacity-40" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900" />
            <span className="font-black text-gray-900">Noxte</span>
            <span className="text-sm text-gray-400">
              — نقطه یه نشونه‌س
            </span>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/shop" className="transition hover:text-gray-900">
              فروشگاه
            </Link>
            <Link href="/advisor" className="transition hover:text-gray-900">
              مشاور AI
            </Link>
            <Link href="/bulk" className="transition hover:text-gray-900">
              خرید عمده
            </Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          بج‌های مینیاتوری چاپ سه‌بعدی — هر نقطه داستانی داره ●
        </p>
      </div>
    </footer>
  );
}
