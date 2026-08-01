import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, getBulkDiscount } from "@/lib/products";
import { TRAIT_LABELS } from "@/lib/traits";

const DOT_COLORS = ["bg-noxte-red", "bg-noxte-blue", "bg-noxte-green", "bg-noxte-yellow", "bg-noxte-pink"];

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const bulkDiscount = getBulkDiscount(10);

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-100"
    >
      {/* Decorative dot */}
      <div className="pointer-events-none absolute right-3 top-3 z-10" aria-hidden="true">
        <div
          className={`h-2.5 w-2.5 rounded-full opacity-60 transition-all group-hover:scale-150 group-hover:opacity-100 ${DOT_COLORS[Math.abs(product.id.charCodeAt(0)) % DOT_COLORS.length]}`}
        />
      </div>

      <div
        className="flex h-40 items-center justify-center text-6xl transition group-hover:scale-110"
        style={{ backgroundColor: product.color }}
      >
        {product.emoji}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold text-gray-900">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
          {product.description}
        </p>

        <div className="mt-2 flex flex-wrap gap-1">
          {product.traits.slice(0, 2).map((trait) => (
            <span
              key={trait}
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: TRAIT_LABELS[trait].color + "22",
                color: TRAIT_LABELS[trait].color,
              }}
            >
              {TRAIT_LABELS[trait].emoji} {TRAIT_LABELS[trait].fa}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-sm font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
            <p className="text-[10px] text-gray-400">
              از ۱۰ عدد {Math.round(bulkDiscount * 100)}٪ تخفیف
            </p>
          </div>
          <span className="text-[10px] text-gray-400">{product.size}</span>
        </div>
      </div>
    </Link>
  );
}
