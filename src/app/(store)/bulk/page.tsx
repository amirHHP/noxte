"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import { PRODUCTS, BULK_TIERS, formatPrice, calculatePrice } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";

export default function BulkPage() {
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, number>
  >({});
  const addItem = useCartStore((s) => s.addItem);

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      const next = { ...selectedProducts };
      delete next[id];
      setSelectedProducts(next);
    } else {
      setSelectedProducts({ ...selectedProducts, [id]: qty });
    }
  };

  const totalQty = Object.values(selectedProducts).reduce((s, q) => s + q, 0);
  const totalPrice = Object.entries(selectedProducts).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return sum + (product ? calculatePrice(product.price, qty) : 0);
  }, 0);

  const handleAddAll = () => {
    for (const [id, qty] of Object.entries(selectedProducts)) {
      const product = PRODUCTS.find((p) => p.id === id);
      if (product) addItem(product, qty);
    }
    setSelectedProducts({});
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <Package className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-black text-gray-900">خرید عمده</h1>
        <p className="mt-2 text-gray-500">
          برای هدیه دادن به کل تیم — تا ۳۰٪ تخفیف
        </p>
      </div>

      {/* Bulk tiers */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BULK_TIERS.map((tier) => (
          <div
            key={tier.min}
            className="rounded-2xl border border-violet-100 bg-white p-5 text-center shadow-sm"
          >
            <p className="text-2xl font-black text-violet-700">
              {tier.discount > 0
                ? `${Math.round(tier.discount * 100)}٪`
                : "—"}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-700">
              {tier.label}
            </p>
          </div>
        ))}
      </div>

      {/* Product selection table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-right text-sm text-gray-500">
              <th className="p-4">محصول</th>
              <th className="p-4">قیمت واحد</th>
              <th className="p-4">تعداد</th>
              <th className="p-4">جمع</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((product) => {
              const qty = selectedProducts[product.id] || 0;
              const lineTotal = qty > 0 ? calculatePrice(product.price, qty) : 0;

              return (
                <tr
                  key={product.id}
                  className="border-b border-gray-50 transition hover:bg-violet-50/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                        style={{ backgroundColor: product.color }}
                      >
                        {product.emoji}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">{product.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatPrice(product.price)}
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      min={0}
                      value={qty || ""}
                      placeholder="0"
                      onChange={(e) =>
                        updateQty(
                          product.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm"
                    />
                  </td>
                  <td className="p-4 text-sm font-bold text-violet-700">
                    {qty > 0 ? formatPrice(lineTotal) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalQty > 0 && (
        <div className="sticky bottom-4 mt-6 rounded-2xl border border-violet-200 bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {totalQty} عدد از {Object.keys(selectedProducts).length} محصول
              </p>
              <p className="text-2xl font-black text-violet-700">
                {formatPrice(totalPrice)}
              </p>
            </div>
            <button
              onClick={handleAddAll}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-violet-600 to-fuchsia-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg"
            >
              <ShoppingBag className="h-5 w-5" />
              افزودن همه به سبد
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          نیاز به مشاوره دارید؟{" "}
          <Link href="/advisor" className="font-medium text-violet-600">
            از مشاور AI استفاده کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
