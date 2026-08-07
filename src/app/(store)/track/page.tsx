"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  ShoppingBag,
  CreditCard,
  ArrowRight,
  Calendar,
  User,
  Mail,
  Phone,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/types";

const STEPS: { status: OrderStatus; label: string; icon: any }[] = [
  { status: "pending", label: "ثبت سفارش", icon: Clock },
  { status: "confirmed", label: "تأیید پرداخت", icon: CreditCard },
  { status: "processing", label: "در حال آماده‌سازی", icon: Package },
  { status: "shipped", label: "تحویل به پست/ارسال", icon: Truck },
  { status: "delivered", label: "تحویل داده شد", icon: CheckCircle2 },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "processing":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
        styles[status] || styles.pending
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ORDER_STATUS_LABELS[status] || status}
    </span>
  );
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("id") || searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchOrders = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/orders/track?q=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در دریافت اطلاعات سفارش");
      }
      setOrders(data.orders || []);
      if (data.orders?.length === 0) {
        setError("هیچ سفارشی با این مشخصات یافت نشد");
      }
    } catch (err: any) {
      setError(err.message || "خطایی رخ داد");
      setOrders(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      fetchOrders(initialQuery);
    }
  }, [initialQuery, fetchOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(query);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header Banner */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900/5 px-3 py-1 text-xs font-bold text-gray-700">
          <Truck className="h-3.5 w-3.5" />
          پیگیری آنلاین سفارشات
        </span>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          وضعیت سفارش شما
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          کد سفارش (مانند NX-2026...)، شماره موبایل یا ایمیل خود را جهت پیگیری
          وارد کنید.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="mx-auto mb-12 max-w-xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="کد سفارش یا شماره موبایل / ایمیل..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pr-12 pl-32 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            dir="auto"
          />
          <Search className="absolute right-4 h-5 w-5 text-gray-400 pointer-events-none" />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute left-2 flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              "جستجو"
            )}
          </button>
        </div>
      </form>

      {/* Error / Not Found Alert */}
      {error && (
        <div className="mx-auto mb-8 max-w-xl rounded-2xl border border-rose-100 bg-rose-50/80 p-4 text-center text-sm font-medium text-rose-700">
          <XCircle className="mx-auto mb-2 h-6 w-6 text-rose-500" />
          {error}
        </div>
      )}

      {/* Orders List Result */}
      {orders && orders.length > 0 && (
        <div className="space-y-8">
          {orders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);
            const isCancelled = order.status === "cancelled";

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-100/70"
              >
                {/* Order Top Summary */}
                <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/80 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-400">
                          شماره سفارش:
                        </span>
                        <button
                          onClick={() => copyToClipboard(order.id, order.id)}
                          className="group flex items-center gap-1.5 font-mono text-base font-black text-gray-900 transition hover:text-gray-600"
                        >
                          {order.id}
                          {copiedId === order.id ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "fa-IR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <span>•</span>
                        <span>{order.totalItems} عدد کالا</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                </div>

                {/* Progress Step Timeline */}
                <div className="p-6">
                  <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-gray-400">
                    مراحل سفارش
                  </h3>

                  {isCancelled ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4 text-sm font-medium text-rose-700">
                      <XCircle className="h-5 w-5 shrink-0 text-rose-500" />
                      این سفارش لغو شده است. در صورت نیاز به پیگیری با پشتیبانی
                      تماس بگیرید.
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Step Indicator Desktop / Mobile */}
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {STEPS.map((step, idx) => {
                          const StepIcon = step.icon;
                          const isCompleted = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;

                          return (
                            <div
                              key={step.status}
                              className="relative flex flex-col items-center"
                            >
                              {/* Connecting Line */}
                              {idx < STEPS.length - 1 && (
                                <div
                                  className={`absolute top-5 right-1/2 left-0 -z-0 h-1 w-full translate-x-1/2 ${
                                    idx < currentStepIdx
                                      ? "bg-emerald-500"
                                      : "bg-gray-100"
                                  }`}
                                />
                              )}

                              {/* Icon Bubble */}
                              <div
                                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                                  isCompleted
                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-200"
                                    : "border-gray-200 bg-white text-gray-400"
                                } ${isCurrent ? "ring-4 ring-emerald-100" : ""}`}
                              >
                                <StepIcon className="h-5 w-5" />
                              </div>

                              {/* Label */}
                              <span
                                className={`mt-2 text-[11px] sm:text-xs font-bold leading-tight ${
                                  isCompleted
                                    ? "text-gray-900"
                                    : "text-gray-400"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Items & Price Breakdown */}
                <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                    اقلام سفارش
                  </h3>

                  <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl">
                            {item.emoji}
                          </span>
                          <div>
                            <p className="font-bold text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-400">
                              تعداد: {item.quantity} عدد ×{" "}
                              {item.unitPrice.toLocaleString("fa-IR")} تومان
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">
                          {item.lineTotal.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Payment & Customer Details Grid */}
                  <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                    {/* Customer Info Card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 mb-2">
                        اطلاعات خریدار
                      </h4>
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {order.customerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="font-mono text-xs">
                          {order.customerEmail}
                        </span>
                      </div>
                      {order.customerPhone && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="font-mono text-xs">
                            {order.customerPhone}
                          </span>
                        </div>
                      )}
                      {order.note && (
                        <p className="mt-2 text-xs italic text-gray-500 border-t border-gray-50 pt-2">
                          توضیحات: {order.note}
                        </p>
                      )}
                    </div>

                    {/* Payment Info Card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 mb-2">
                        اطلاعات پرداخت
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">وضعیت پرداخت:</span>
                        <span
                          className={`font-bold ${
                            order.paymentStatus === "paid"
                              ? "text-emerald-600"
                              : order.paymentStatus === "failed"
                              ? "text-rose-600"
                              : "text-amber-600"
                          }`}
                        >
                          {PAYMENT_STATUS_LABELS[order.paymentStatus] ||
                            order.paymentStatus}
                        </span>
                      </div>
                      {order.paymentRefId && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">کد پیگیری بانکی:</span>
                          <span className="font-mono font-bold text-gray-900">
                            {order.paymentRefId}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 border-t border-gray-50 pt-2 flex items-center justify-between font-bold text-base text-gray-900">
                        <span>مبلغ کل:</span>
                        <span>
                          {order.totalPrice.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful Info Footer */}
      {!orders && !loading && (
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-100 bg-gradient-to-b from-gray-50/50 to-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
            <HelpCircle className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            راهنمای پیگیری سفارش
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            کد سفارش پس از ثبت، به ایمیل شما ارسال می‌شود و در صفحه پرداخت نیز
            نمایش داده شده است (مانند <code className="font-bold">NX-2026...</code>). همچنین می‌توانید با وارد کردن شماره همراه یا ایمیل
            خود تمام سفارشات مرتبط را مشاهده فرمایید.
          </p>
          <div className="mt-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <ShoppingBag className="h-4 w-4" />
              بازگشت به فروشگاه
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
