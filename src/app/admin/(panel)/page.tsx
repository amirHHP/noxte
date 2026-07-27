import Link from "next/link";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";
import { getOrders } from "@/lib/db";
import { formatPrice } from "@/lib/products";
import { ORDER_STATUS_LABELS } from "@/lib/types";

export default async function AdminDashboardPage() {
  const orders = await getOrders();

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter(
      (o) => o.status === "confirmed" || o.status === "processing"
    ).length,
    shipped: orders.filter(
      (o) => o.status === "shipped" || o.status === "delivered"
    ).length,
    revenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalPrice, 0),
  };

  const recent = orders.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">داشبورد</h1>
        <p className="text-sm text-gray-500">خلاصه وضعیت فروشگاه</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "کل سفارشات", value: stats.total, icon: Package, color: "text-violet-600 bg-violet-50" },
          { label: "در انتظار", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "در حال پردازش", value: stats.processing, icon: CheckCircle, color: "text-blue-600 bg-blue-50" },
          { label: "ارسال شده", value: stats.shipped, icon: Truck, color: "text-green-600 bg-green-50" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-black text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-8 rounded-2xl border border-violet-100 bg-gradient-to-l from-violet-50 to-fuchsia-50 p-6">
        <p className="text-sm text-gray-500">درآمد کل (بدون لغو شده)</p>
        <p className="text-3xl font-black text-violet-700">
          {formatPrice(stats.revenue)}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-bold text-gray-900">آخرین سفارشات</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            مشاهده همه
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-400">
            هنوز سفارشی ثبت نشده
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((order) => (
              <Link
                key={order.id}
                href="/admin/orders"
                className="flex items-center justify-between px-5 py-4 transition hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-xs text-gray-400">
                    {order.id} — {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-violet-700">
                    {formatPrice(order.totalPrice)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {ORDER_STATUS_LABELS[order.status]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
