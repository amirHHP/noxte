"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "خطا در ورود");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-violet-100 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">ورود به پنل ادمین</h1>
          <p className="mt-2 text-sm text-gray-500">Noxte — مدیریت سفارشات و AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
              placeholder="رمز عبور ادمین"
              required
              autoFocus
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-violet-600 to-fuchsia-600 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ورود...
              </>
            ) : (
              "ورود"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          پیش‌فرض: admin123 — در .env.local تغییر دهید
        </p>
      </div>
    </div>
  );
}
