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
import { useLanguage } from "@/lib/i18n/language-context";

interface BulkOrderPanelProps {
  product: Product;
}

export function BulkOrderPanel({ product }: BulkOrderPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { t, language } = useLanguage();

  const discount = getBulkDiscount(quantity);
  const total = calculatePrice(product.price, quantity);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formattedTotal = language === "fa"
    ? formatPrice(total)
    : `${total.toLocaleString("en-US")} Toman`;

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {language === "fa" ? "تعداد" : "Quantity"}
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50"
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {discount > 0 && (
        <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-center text-sm text-green-700">
          🎉 {Math.round(discount * 100)}%{" "}
          {language === "fa" ? "تخفیف خرید عمده اعمال شد!" : "bulk discount applied!"}
        </div>
      )}

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-sm text-gray-500">{t("totalAmount")}</span>
        <span className="text-2xl font-bold text-gray-900">
          {formattedTotal}
        </span>
      </div>

      <button
        onClick={handleAdd}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition ${
          added
            ? "bg-green-500"
            : "bg-gray-900 shadow-lg shadow-gray-200 hover:bg-gray-800 hover:shadow-xl"
        }`}
      >
        <ShoppingBag className="h-5 w-5" />
        {added ? t("addedToCart") : t("addToCart")}
      </button>

      <div className="mt-5 border-t border-gray-200 pt-4">
        <p className="mb-2 text-xs font-medium text-gray-500">
          {language === "fa" ? "تعرفه خرید عمده" : "Bulk Pricing Tiers"}
        </p>
        <div className="space-y-1">
          {BULK_TIERS.map((tier, i) => {
            const nextMin = BULK_TIERS[i + 1]?.min ?? Infinity;
            const isActive = quantity >= tier.min && quantity < nextMin;
            return (
              <div
                key={tier.min}
                className={`flex justify-between rounded-lg px-2 py-1 text-xs ${
                  isActive
                    ? "bg-gray-900 font-bold text-white"
                    : "text-gray-500"
                }`}
              >
                <span>
                  {tier.min === 1
                    ? language === "fa" ? "۱ تا ۴ عدد" : "1 to 4 items"
                    : nextMin === Infinity
                    ? language === "fa" ? `${tier.min.toLocaleString("fa-IR")}+ عدد` : `${tier.min}+ items`
                    : language === "fa" ? `${tier.min.toLocaleString("fa-IR")} تا ${(nextMin - 1).toLocaleString("fa-IR")} عدد` : `${tier.min} to ${nextMin - 1} items`}
                </span>
                <span>
                  {tier.discount > 0
                    ? language === "fa" ? `${Math.round(tier.discount * 100)}٪ تخفیف` : `${Math.round(tier.discount * 100)}% off`
                    : language === "fa" ? "قیمت پایه" : "Base price"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
