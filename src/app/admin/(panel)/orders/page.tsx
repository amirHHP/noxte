"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, RefreshCw } from "lucide-react";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/types";
import { formatPrice } from "@/lib/products";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border border-amber-200",
  paid: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  failed: "bg-red-50 text-red-600 border border-red-200",
};

const ALL_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const url =
      filter === "all"
        ? "/api/admin/orders"
        : `/api/admin/orders?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchOrders();
    setUpdating(null);
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("آیا از حذف این سفارش مطمئن هستید؟")) return;
    await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    await fetchOrders();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">مدیریت سفارشات</h1>
          <p className="text-sm text-gray-500">{orders.length} سفارش</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          بروزرسانی
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-medium ${
            filter === "all"
              ? "bg-violet-600 text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          همه
        </button>
        {ALL_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${
              filter === status
                ? "bg-violet-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {ORDER_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-4xl">📦</p>
          <p className="mt-4 text-gray-500">سفارشی یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <button
                onClick={() =>
                  setExpanded(expanded === order.id ? null : order.id)
                }
                className="flex w-full items-center justify-between p-5 text-right"
              >
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2 space-x-reverse">
                    {order.items.slice(0, 3).map((item) => (
                      <span
                        key={item.productId}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white bg-gray-50 text-lg"
                      >
                        {item.emoji}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white bg-gray-100 text-xs font-bold text-gray-500">
                        +{order.items.length - 3}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.id} —{" "}
                      {new Date(order.createdAt).toLocaleString("fa-IR")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      PAYMENT_STATUS_COLORS[order.paymentStatus || "pending"]
                    }`}
                  >
                    {PAYMENT_STATUS_LABELS[order.paymentStatus || "pending"]}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status]}`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <p className="font-bold text-violet-700">
                    {formatPrice(order.totalPrice)}
                  </p>
                </div>
              </button>

              {expanded === order.id && (
                <div className="border-t border-gray-100 px-5 pb-5">
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-4 text-sm">
                      <p className="mb-2 font-medium text-gray-700">
                        اطلاعات مشتری و پرداخت
                      </p>
                      <p>نام: {order.customerName}</p>
                      <p>ایمیل: {order.customerEmail}</p>
                      {order.customerPhone && (
                        <p>تلفن: {order.customerPhone}</p>
                      )}
                      {order.company && <p>شرکت: {order.company}</p>}
                      {order.paymentRefId && (
                        <p className="mt-1 font-mono text-xs font-bold text-emerald-700">
                          کد پیگیری زرین‌پال: {order.paymentRefId}
                        </p>
                      )}
                      {order.paymentCardPan && (
                        <p className="font-mono text-xs text-gray-500">
                          کارت: {order.paymentCardPan}
                        </p>
                      )}
                      {order.note && (
                        <p className="mt-2 text-gray-500">یادداشت: {order.note}</p>
                      )}
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4 text-sm">
                      <p className="mb-2 font-medium text-gray-700">اقلام</p>
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between py-1"
                        >
                          <span>
                            {item.emoji} {item.productName} × {item.quantity}
                          </span>
                          <span>{formatPrice(item.lineTotal)}</span>
                        </div>
                      ))}
                      <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-bold">
                        <span>جمع</span>
                        <span>{formatPrice(order.totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500">تغییر وضعیت:</span>
                    {ALL_STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.id, status)}
                        disabled={updating === order.id || order.status === status}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-40 ${
                          order.status === status
                            ? STATUS_COLORS[status]
                            : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[status]}
                      </button>
                    ))}
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="mr-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      حذف
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
