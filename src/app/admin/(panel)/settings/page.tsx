"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Key, Eye, EyeOff, Trash2 } from "lucide-react";

interface SettingsView {
  openaiModel: string;
  useEnvFallback: boolean;
  hasApiKey: boolean;
  maskedApiKey: string;
  hasEnvKey: boolean;
  updatedAt: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsView | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [useEnvFallback, setUseEnvFallback] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    setSettings(data.settings);
    setModel(data.settings.openaiModel);
    setUseEnvFallback(data.settings.useEnvFallback);
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const body: Record<string, unknown> = {
      openaiModel: model,
      useEnvFallback,
    };
    if (apiKey) body.openaiApiKey = apiKey;

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      setSettings(data.settings);
      setApiKey("");
      setMessage("تنظیمات با موفقیت ذخیره شد");
    } else {
      setMessage("خطا در ذخیره تنظیمات");
    }
    setSaving(false);
  };

  const handleClearKey = async () => {
    if (!confirm("کلید API حذف شود؟")) return;
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clearApiKey: true }),
    });
    await fetchSettings();
    setMessage("کلید API حذف شد");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">تنظیمات AI</h1>
        <p className="text-sm text-gray-500">
          مدیریت کلید OpenAI برای مشاور هدیه
        </p>
      </div>

      <div className="space-y-6">
        {/* Status cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="text-xs text-gray-400">کلید ذخیره‌شده در پنل</p>
            <p className="mt-1 font-medium">
              {settings?.hasApiKey ? (
                <span className="text-green-600">✓ فعال — {settings.maskedApiKey}</span>
              ) : (
                <span className="text-gray-400">تنظیم نشده</span>
              )}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="text-xs text-gray-400">کلید محیطی (.env)</p>
            <p className="mt-1 font-medium">
              {settings?.hasEnvKey ? (
                <span className="text-green-600">✓ موجود</span>
              ) : (
                <span className="text-gray-400">تنظیم نشده</span>
              )}
            </p>
          </div>
        </div>

        {/* API Key input */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Key className="h-5 w-5 text-violet-600" />
            <h2 className="font-bold text-gray-900">کلید OpenAI API</h2>
          </div>

          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                settings?.hasApiKey
                  ? "کلید جدید وارد کنید (خالی = بدون تغییر)"
                  : "sk-..."
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-20 text-sm font-mono focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
              dir="ltr"
            />
            <div className="absolute left-2 top-1/2 flex -translate-y-1/2 gap-1">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              {settings?.hasApiKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="rounded-lg p-2 text-red-400 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            کلید به صورت امن در سرور ذخیره می‌شود و هرگز به مرورگر ارسال نمی‌شود
          </p>
        </div>

        {/* Model selection */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-gray-900">مدل AI</h2>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
          >
            <option value="gpt-4o-mini">GPT-4o Mini (سریع و ارزان)</option>
            <option value="gpt-4o">GPT-4o (دقیق‌تر)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
          </select>
        </div>

        {/* Env fallback */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <label className="flex cursor-pointer items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                استفاده از کلید .env به عنوان پشتیبان
              </p>
              <p className="text-xs text-gray-400">
                اگر کلید پنل خالی باشد، از OPENAI_API_KEY محیطی استفاده شود
              </p>
            </div>
            <input
              type="checkbox"
              checked={useEnvFallback}
              onChange={(e) => setUseEnvFallback(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
          </label>
        </div>

        {message && (
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          ذخیره تنظیمات
        </button>

        {settings?.updatedAt && (
          <p className="text-xs text-gray-400">
            آخرین بروزرسانی:{" "}
            {new Date(settings.updatedAt).toLocaleString("fa-IR")}
          </p>
        )}
      </div>
    </div>
  );
}
