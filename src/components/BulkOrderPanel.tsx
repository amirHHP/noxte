"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import {
  BULK_TIERS,
  calculatePrice,
  formatPrice,
  getBulkDiscount,
} from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";

interface BulkOrderPanelProps {
  product: Product;
}

export function BulkOrderPanel({ product }: BulkOrderPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const discount = getBulkDiscount(quantity);
  const total = calculatePrice(product.price, quantity);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/50 to-white p-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">تعداد</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition hover:bg-gray-50"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20 rounded-lg border border-gray-200 bg-white py-2 text-center text-lg font-bold"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {discount > 0 && (
        <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-center text-sm text-green-700">
          🎉 {Math.round(discount * 100)}٪ تخفیف خرید عمده اعمال شد!
        </div>
      )}

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-sm text-gray-500">جمع کل</span>
        <span className="text-2xl font-bold text-violet-700">
          {formatPrice(total)}
        </span>
      </div>

      <button
        onClick={handleAdd}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition ${
          added
            ? "bg-green-500"
            : "bg-gradient-to-l from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-200 hover:shadow-xl"
        }`}
      >
        <ShoppingBag className="h-5 w-5" />
        {added ? "اضافه شد ✓" : "افزودن به سبد خرید"}
      </button>

      <div className="mt-5 border-t border-violet-100 pt-4">
        <p className="mb-2 text-xs font-medium text-gray-500">تعرفه خرید عمده</p>
        <div className="space-y-1">
          {BULK_TIERS.map((tier, i) => {
            const nextMin = BULK_TIERS[i + 1]?.min ?? Infinity;
            const isActive = quantity >= tier.min && quantity < nextMin;
            return (
            <div
              key={tier.min}
              className={`flex justify-between rounded-lg px-2 py-1 text-xs ${
                isActive
                  ? "bg-violet-100 font-bold text-violet-700"
                  : "text-gray-500"
              }`}
            >
              <span>{tier.label}</span>
              <span>
                {tier.discount > 0
                  ? `${Math.round(tier.discount * 100)}٪ تخفیف`
                  : "قیمت عادی"}
              </span>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
