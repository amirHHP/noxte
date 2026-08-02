"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import { PRODUCTS, BULK_TIERS, formatPrice, calculatePrice } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { FloatingDots } from "@/components/FloatingDots";
import type { Product } from "@/lib/types";

const TIER_DOTS = ["bg-gray-300", "bg-noxte-green", "bg-noxte-blue", "bg-noxte-red"];

export default function BulkPage() {
  const [dbProducts, setDbProducts] = useState<Product[] | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, number>
  >({});
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setDbProducts(data);
      })
      .catch(() => {});
  }, []);

  const allProducts = dbProducts ?? PRODUCTS;

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
    const product = allProducts.find((p) => p.id === id);
    return sum + (product ? calculatePrice(product.price, qty) : 0);
  }, 0);

  const handleAddAll = () => {
    for (const [id, qty] of Object.entries(selectedProducts)) {
      const product = allProducts.find((p) => p.id === id);
      if (product) addItem(product, qty);
    }
    setSelectedProducts({});
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="relative mb-8 overflow-hidden text-center">
        <FloatingDots count="few" />
        <div className="relative">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white">
            <Package className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">خرید عمده</h1>
          <p className="mt-2 text-gray-500">
            برای هدیه دادن به کل تیم — تا ۳۰٪ تخفیف
          </p>
        </div>
      </div>

      {/* Bulk tiers */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BULK_TIERS.map((tier, i) => (
          <div
            key={tier.min}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm"
          >
            <div className="mx-auto mb-2 flex items-center justify-center">
              <div className={`h-3 w-3 rounded-full ${TIER_DOTS[i]}`} />
            </div>
            <p className="text-2xl font-black text-gray-900">
              {tier.discount > 0
                ? `${Math.round(tier.discount * 100)}٪`
                : "—"}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-500">
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
            {allProducts.map((product) => {
              const qty = selectedProducts[product.id] || 0;
              const lineTotal = qty > 0 ? calculatePrice(product.price, qty) : 0;

              return (
                <tr
                  key={product.id}
                  className="border-b border-gray-50 transition hover:bg-gray-50/50"
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
                      className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
                    />
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-900">
                    {qty > 0 ? formatPrice(lineTotal) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalQty > 0 && (
        <div className="sticky bottom-4 mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {totalQty} عدد از {Object.keys(selectedProducts).length} محصول
              </p>
              <p className="text-2xl font-black text-gray-900">
                {formatPrice(totalPrice)}
              </p>
            </div>
            <button
              onClick={handleAddAll}
              className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800"
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
          <Link href="/advisor" className="font-medium text-gray-900 transition hover:text-gray-600">
            از مشاور AI استفاده کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
