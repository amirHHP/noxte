"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status"); // ok | failed | error
  const orderId = searchParams.get("orderId");
  const refId = searchParams.get("refId");
  const message = searchParams.get("message");
  const [copied, setCopied] = useState(false);

  const copyRefId = () => {
    if (refId) {
      navigator.clipboard.writeText(refId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Success ─────────────────────────────────────────────
  if (status === "ok") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white p-8 text-center shadow-lg shadow-emerald-100/50">
          {/* Animated checkmark */}
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-30" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-gray-900">
            پرداخت موفق بود! 🎉
          </h1>
          <p className="mt-2 text-gray-500">
            سفارش شما با موفقیت ثبت و پرداخت شد
          </p>

          {/* Order details card */}
          <div className="mx-auto mt-6 max-w-xs space-y-3 rounded-2xl bg-white p-5 text-sm shadow-sm ring-1 ring-gray-100">
            {orderId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">شماره سفارش</span>
                <span className="font-mono font-bold text-gray-900">
                  {orderId}
                </span>
              </div>
            )}
            {refId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">شماره پیگیری</span>
                <button
                  onClick={copyRefId}
                  className="flex items-center gap-1.5 font-mono font-bold text-emerald-700 transition hover:text-emerald-900"
                  title="کپی"
                >
                  {refId}
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-gray-400">
            اطلاعات سفارش به ایمیل شما ارسال خواهد شد. به زودی با شما تماس
            می‌گیریم.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {orderId && (
              <Link
                href={`/track?id=${orderId}`}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 shadow-md shadow-emerald-200"
              >
                پیگیری وضعیت سفارش
              </Link>
            )}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              ادامه خرید
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Failed ──────────────────────────────────────────────
  if (status === "failed") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-3xl border border-red-100 bg-gradient-to-b from-red-50 to-white p-8 text-center shadow-lg shadow-red-100/50">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>

          <h1 className="text-2xl font-black text-gray-900">
            پرداخت ناموفق بود
          </h1>
          <p className="mt-2 text-gray-500">
            {message || "متأسفانه پرداخت شما با موفقیت انجام نشد"}
          </p>

          {orderId && (
            <p className="mt-3 text-sm text-gray-400">
              شماره سفارش:{" "}
              <span className="font-mono font-bold">{orderId}</span>
            </p>
          )}

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4" />
              تلاش مجدد
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              بازگشت به فروشگاه
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Error (no order found, bad params, etc.) ────────────
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-3xl border border-amber-100 bg-gradient-to-b from-amber-50 to-white p-8 text-center shadow-lg shadow-amber-100/50">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle className="h-10 w-10 text-amber-500" />
        </div>

        <h1 className="text-2xl font-black text-gray-900">خطا در پرداخت</h1>
        <p className="mt-2 text-gray-500">
          {message || "مشکلی در فرآیند پرداخت رخ داده است"}
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            <ShoppingBag className="h-4 w-4" />
            رفتن به فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
