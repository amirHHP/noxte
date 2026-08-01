"use client";

import { useState } from "react";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { calculatePrice } from "@/lib/products";
import type { OrderItem } from "@/lib/types";

export function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    company: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      emoji: item.product.emoji,
      unitPrice: item.product.price,
      quantity: item.quantity,
      lineTotal: calculatePrice(item.product.price, item.quantity),
    }));

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          totalPrice: totalPrice(),
          totalItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ثبت سفارش");
        return;
      }

      // Clear cart and redirect to ZarinPal payment gateway
      clearCart();
      setRedirecting(true);

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      if (!redirecting) {
        setLoading(false);
      }
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (redirecting) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <CreditCard className="h-8 w-8 text-amber-600 animate-pulse" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">
          در حال انتقال به درگاه پرداخت...
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          لطفاً صفحه را نبندید
        </p>
        <Loader2 className="mx-auto mt-4 h-6 w-6 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            نام و نام خانوادگی *
          </label>
          <input
            required
            value={form.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            ایمیل *
          </label>
          <input
            required
            type="email"
            value={form.customerEmail}
            onChange={(e) => update("customerEmail", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
            dir="ltr"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            تلفن
          </label>
          <input
            value={form.customerPhone}
            onChange={(e) => update("customerPhone", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
            dir="ltr"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            شرکت / تیم
          </label>
          <input
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          یادداشت (اختیاری)
        </label>
        <textarea
          value={form.note}
          onChange={(e) => update("note", e.target.value)}
          rows={2}
          placeholder="مثلاً: برای تیم محصول، تحویل فوری"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            در حال ثبت...
          </>
        ) : (
          <>
            <ShieldCheck className="h-5 w-5" />
            پرداخت و ثبت سفارش
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>پرداخت امن از طریق درگاه زرین‌پال</span>
      </div>
    </form>
  );
}
