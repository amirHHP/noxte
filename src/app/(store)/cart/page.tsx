"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import {
  calculatePrice,
  formatPrice,
  getBulkDiscount,
} from "@/lib/products";
import { CheckoutForm } from "@/components/CheckoutForm";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/language-context";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } =
    useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const { t, language, dir } = useLanguage();

  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {t("cartEmpty")}
        </h1>
        <p className="mt-2 text-gray-500">
          {t("cartEmptySub")}
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
        >
          {t("viewShop")}
          <ArrowIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const formattedTotal = language === "fa"
    ? formatPrice(totalPrice())
    : `${totalPrice().toLocaleString("en-US")} Toman`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">{t("cartTitle")}</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700"
        >
          {t("clearCart")}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const discount = getBulkDiscount(item.quantity);
          const lineTotal = calculatePrice(item.product.price, item.quantity);
          const itemPriceFormatted = language === "fa"
            ? formatPrice(item.product.price)
            : `${item.product.price.toLocaleString("en-US")} Toman`;
          const lineTotalFormatted = language === "fa"
            ? formatPrice(lineTotal)
            : `${lineTotal.toLocaleString("en-US")} Toman`;

          return (
            <div
              key={item.product.id}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-3xl"
                style={{ backgroundColor: item.product.color }}
              >
                {item.product.emoji}
              </div>

              <div className="flex-1">
                <Link
                  href={`/shop/${item.product.id}`}
                  className="font-bold text-gray-900 transition hover:text-gray-600"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-400">
                  {itemPriceFormatted} × {item.quantity}
                </p>
                {discount > 0 && (
                  <p className="text-xs text-green-600">
                    {Math.round(discount * 100)}% {language === "fa" ? "تخفیف عمده" : "bulk discount"}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity - 1)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-50"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-50"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <div className="text-left">
                <p className="font-bold text-gray-900">
                  {lineTotalFormatted}
                </p>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="mt-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between text-lg">
          <span className="font-medium text-gray-700">{t("totalAmount")}</span>
          <span className="text-2xl font-black text-gray-900">
            {formattedTotal}
          </span>
        </div>

        {!showCheckout ? (
          <button
            onClick={() => setShowCheckout(true)}
            className="mt-4 w-full rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white shadow-lg shadow-gray-200 transition hover:bg-gray-800 hover:shadow-xl"
          >
            {t("checkoutBtn")}
          </button>
        ) : (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="mb-4 font-bold text-gray-900">{t("recipientInfo")}</h2>
            <CheckoutForm />
          </div>
        )}

        <p className="mt-3 text-center text-xs text-gray-400">
          {language === "fa"
            ? "ارسال رایگان برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان"
            : "Free shipping on orders over 500,000 Toman"}
        </p>
      </div>
    </div>
  );
}
