"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/orders", label: "سفارشات", icon: Package },
  { href: "/admin/settings", label: "تنظیمات AI", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 right-0 z-30 flex w-64 flex-col border-l border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-sm text-white">
              ✦
            </span>
            <div>
              <p className="font-bold text-gray-900">Noxte Admin</p>
              <p className="text-xs text-gray-400">پنل مدیریت</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-violet-50 text-violet-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-gray-100 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
            مشاهده سایت
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>
      </aside>

      <div className="mr-64 flex-1">
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
