import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BulkOrderPanel } from "@/components/BulkOrderPanel";
import { getProductById } from "@/lib/products";
import { TRAIT_LABELS } from "@/lib/traits";
import { PRODUCTS } from "@/lib/products";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/shop"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-900"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به فروشگاه
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div
          className="flex items-center justify-center rounded-3xl p-16 text-[120px]"
          style={{ backgroundColor: product.color }}
        >
          {product.emoji}
        </div>

        <div>
          <h1 className="text-3xl font-black text-gray-900">{product.name}</h1>
          <p className="mt-1 text-sm text-gray-400">{product.nameEn}</p>
          <p className="mt-4 leading-relaxed text-gray-600">
            {product.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.traits.map((trait) => (
              <Link
                key={trait}
                href={`/shop?trait=${trait}`}
                className="rounded-full px-3 py-1 text-xs font-medium transition hover:opacity-80"
                style={{
                  backgroundColor: TRAIT_LABELS[trait].color + "22",
                  color: TRAIT_LABELS[trait].color,
                }}
              >
                {TRAIT_LABELS[trait].emoji} {TRAIT_LABELS[trait].fa}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.occasion.map((occ) => (
              <span
                key={occ}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
              >
                🎁 {occ}
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm text-gray-400">
            اندازه: {product.size} | چاپ سه‌بعدی PLA
          </p>

          <div className="mt-8">
            <BulkOrderPanel product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
