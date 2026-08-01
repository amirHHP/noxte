"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { calculatePrice } from "@/lib/products";
import type { OrderItem } from "@/lib/types";

interface CheckoutFormProps {
  onSuccess: (orderId: string) => void;
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

      clearCart();
      onSuccess(data.order.id);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

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
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            در حال ثبت...
          </>
        ) : (
          "ثبت سفارش"
        )}
      </button>
    </form>
  );
}

export function OrderSuccess({ orderId }: { orderId: string }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
      <h2 className="mt-4 text-xl font-bold text-gray-900">
        سفارش شما ثبت شد!
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        شماره سفارش: <span className="font-mono font-bold">{orderId}</span>
      </p>
      <p className="mt-1 text-xs text-gray-400">
        به زودی با شما تماس می‌گیریم
      </p>
    </div>
  );
}
