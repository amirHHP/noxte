"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  Key,
  Eye,
  EyeOff,
  Trash2,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
} from "lucide-react";
import type { AIProvider, GeminiModelInfo } from "@/lib/types";

interface SettingsView {
  provider: AIProvider;
  openaiModel: string;
  hasApiKey: boolean;
  maskedApiKey: string;
  hasEnvKey: boolean;
  geminiModel: string;
  hasGeminiKey: boolean;
  maskedGeminiKey: string;
  hasEnvGeminiKey: boolean;
  useEnvFallback: boolean;
  updatedAt: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsView | null>(null);
  const [provider, setProvider] = useState<AIProvider>("gemini");

  // OpenAI state
  const [openaiKey, setOpenaiKey] = useState("");
  const [openaiModel, setOpenaiModel] = useState("gpt-4o-mini");
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);

  // Gemini state
  const [geminiKey, setGeminiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState("gemini-2.5-flash");
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  // Gemini online model fetching state
  const [geminiModels, setGeminiModels] = useState<GeminiModelInfo[]>([]);
  const [fetchingModels, setFetchingModels] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [useEnvFallback, setUseEnvFallback] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
        setProvider(data.settings.provider || "gemini");
        setOpenaiModel(data.settings.openaiModel || "gpt-4o-mini");
        setGeminiModel(data.settings.geminiModel || "gemini-2.5-flash");
        setUseEnvFallback(data.settings.useEnvFallback ?? true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchGeminiModels = async () => {
    setFetchingModels(true);
    setFetchError("");
    try {
      const res = await fetch("/api/admin/gemini-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: geminiKey || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.error || "خطا در استعلام مدل‌های Gemini");
        setGeminiModels([]);
      } else {
        setGeminiModels(data.models || []);
        if (data.models && data.models.length > 0) {
          // If current selected model not in list, auto select first
          const exists = data.models.some(
            (m: GeminiModelInfo) => m.id === geminiModel
          );
          if (!exists) {
            setGeminiModel(data.models[0].id);
          }
        }
      }
    } catch {
      setFetchError("خطا در برقراری ارتباط با سرور");
    } finally {
      setFetchingModels(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const body: Record<string, unknown> = {
      provider,
      openaiModel,
      geminiModel,
      useEnvFallback,
    };

    if (openaiKey) body.openaiApiKey = openaiKey;
    if (geminiKey) body.geminiApiKey = geminiKey;

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setSettings(data.settings);
        setOpenaiKey("");
        setGeminiKey("");
        setMessage("تنظیمات AI با موفقیت ذخیره شد");
      } else {
        setMessage(data.error || "خطا در ذخیره تنظیمات");
      }
    } catch {
      setMessage("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  const handleClearKey = async (type: "openai" | "gemini") => {
    if (!confirm(`کلید API ${type === "gemini" ? "Gemini" : "OpenAI"} حذف شود؟`))
      return;

    const payload =
      type === "gemini" ? { clearGeminiKey: true } : { clearApiKey: true };

    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">تنظیمات هوش مصنوعی (AI)</h1>
        <p className="text-sm text-gray-500">
          مدیریت سرویس‌دهنده AI (Google Gemini / OpenAI) برای مشاور هدیه
        </p>
      </div>

      {/* Provider Selector Tabs */}
      <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setProvider("gemini")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
              provider === "gemini"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Google Gemini (پیش‌فرض)
          </button>
          <button
            type="button"
            onClick={() => setProvider("openai")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
              provider === "openai"
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Zap className="h-4 w-4" />
            OpenAI (GPT-4o)
          </button>
        </div>
      </div>

      {/* ── GEMINI SECTION ── */}
      {provider === "gemini" && (
        <div className="space-y-6">
          {/* Status card */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="text-xs text-blue-600 font-medium">کلید Gemini در پنل</p>
              <p className="mt-1 text-sm font-bold text-gray-900">
                {settings?.hasGeminiKey ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    فعال — {settings.maskedGeminiKey}
                  </span>
                ) : (
                  <span className="text-gray-400">تنظیم نشده</span>
                )}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-xs text-gray-400">کلید محیطی (GEMINI_API_KEY)</p>
              <p className="mt-1 text-sm font-bold text-gray-900">
                {settings?.hasEnvGeminiKey ? (
                  <span className="text-emerald-600">✓ موجود در .env</span>
                ) : (
                  <span className="text-gray-400">تنظیم نشده</span>
                )}
              </p>
            </div>
          </div>

          {/* Gemini API Key Input */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-600" />
                <h2 className="font-bold text-gray-900">کلید Gemini API</h2>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                دریافت کلید رایگان از Google AI Studio ↗
              </a>
            </div>

            <div className="relative">
              <input
                type={showGeminiKey ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder={
                  settings?.hasGeminiKey
                    ? "کلید جدید وارد کنید (خالی = بدون تغییر)"
                    : "AIzaSy..."
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-20 text-sm font-mono focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                dir="ltr"
              />
              <div className="absolute left-2 top-1/2 flex -translate-y-1/2 gap-1">
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                >
                  {showGeminiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                {settings?.hasGeminiKey && (
                  <button
                    type="button"
                    onClick={() => handleClearKey("gemini")}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-gray-400">
                کلید Gemini شما در سرور محفوظ مانده و مستقیماً برای فراخوانی مدل استفاده می‌شود.
              </p>
              <button
                type="button"
                onClick={fetchGeminiModels}
                disabled={fetchingModels || (!geminiKey && !settings?.hasGeminiKey && !settings?.hasEnvGeminiKey)}
                className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition disabled:opacity-40"
              >
                {fetchingModels ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                استعلام و لیست آنلاین مدل‌های فعال
              </button>
            </div>

            {fetchError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{fetchError}</span>
              </div>
            )}
          </div>

          {/* Online Gemini Models Selector */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">انتخاب مدل Gemini</h2>
                <p className="text-xs text-gray-400">
                  مدل فعال: <span className="font-mono font-bold text-blue-600">{geminiModel}</span>
                </p>
              </div>

              {geminiModels.length > 0 && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {geminiModels.length} مدل فعال یافت شد
                </span>
              )}
            </div>

            {/* Quick preset list or fetched models grid */}
            {geminiModels.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {geminiModels.map((m) => {
                  const isSelected = geminiModel === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setGeminiModel(m.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-100"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">
                          {m.displayName}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        )}
                      </div>

                      <p className="mt-1 font-mono text-xs text-blue-700">{m.id}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono">
                          ورودی: {m.inputTokenLimit.toLocaleString("fa-IR")} توکن
                        </span>
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono">
                          خروجی: {m.outputTokenLimit.toLocaleString("fa-IR")} توکن
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-400">
                  انتخاب مدل‌های محبوب پیش‌فرض (یا روی دکمه استعلام بالا بزنید):
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", desc: "فوق‌العاده سریع و مدرن (پیش‌فرض)" },
                    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", desc: "دقیق‌ترین مدل برای تحلیل‌های پیچیده" },
                    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", desc: "سبک و سریع برای حجم بالای ریکوئست" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGeminiModel(item.id)}
                      className={`rounded-xl border p-3 text-right transition ${
                        geminiModel === item.id
                          ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-100"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">{item.name}</span>
                        {geminiModel === item.id && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                        )}
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-blue-600">{item.id}</p>
                      <p className="mt-1 text-[11px] text-gray-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rate Limit Guide */}
            <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-800 mb-1">
                <Cpu className="h-4 w-4 text-blue-600" />
                <span>راهنمای نرخ محدودیت درخواست (Rate Limits):</span>
              </div>
              <p>• <strong>Free Tier (طرح رایگان):</strong> تا ۱۵ درخواست در دقیقه (15 RPM) و ۱.۵ میلیون توکن در دقیقه (1M TPM)</p>
              <p>• <strong>Pay-as-you-go (طرح تجاری):</strong> تا ۱,۰۰۰ درخواست در دقیقه (1,000 RPM)</p>
            </div>
          </div>
        </div>
      )}

      {/* ── OPENAI SECTION ── */}
      {provider === "openai" && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
              <p className="text-xs text-violet-600 font-medium">کلید OpenAI در پنل</p>
              <p className="mt-1 text-sm font-bold text-gray-900">
                {settings?.hasApiKey ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    فعال — {settings.maskedApiKey}
                  </span>
                ) : (
                  <span className="text-gray-400">تنظیم نشده</span>
                )}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-xs text-gray-400">کلید محیطی (OPENAI_API_KEY)</p>
              <p className="mt-1 text-sm font-bold text-gray-900">
                {settings?.hasEnvKey ? (
                  <span className="text-emerald-600">✓ موجود در .env</span>
                ) : (
                  <span className="text-gray-400">تنظیم نشده</span>
                )}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Key className="h-5 w-5 text-violet-600" />
              <h2 className="font-bold text-gray-900">کلید OpenAI API</h2>
            </div>

            <div className="relative">
              <input
                type={showOpenaiKey ? "text" : "password"}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder={
                  settings?.hasApiKey
                    ? "کلید جدید وارد کنید (خالی = بدون تغییر)"
                    : "sk-..."
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-20 text-sm font-mono focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                dir="ltr"
              />
              <div className="absolute left-2 top-1/2 flex -translate-y-1/2 gap-1">
                <button
                  type="button"
                  onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                >
                  {showOpenaiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                {settings?.hasApiKey && (
                  <button
                    type="button"
                    onClick={() => handleClearKey("openai")}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-gray-900">مدل OpenAI</h2>
            <select
              value={openaiModel}
              onChange={(e) => setOpenaiModel(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
            >
              <option value="gpt-4o-mini">GPT-4o Mini (سریع و اقتصادی)</option>
              <option value="gpt-4o">GPT-4o (پرچمدار و دقیق)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
          </div>
        </div>
      )}

      {/* Env fallback */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <label className="flex cursor-pointer items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">
              استفاده از کلیدهای .env به عنوان پشتیبان
            </p>

            <p className="text-xs text-gray-400">
              اگر کلیدهای پنل ادمین خالی باشند، از GEMINI_API_KEY یا OPENAI_API_KEY محیطی استفاده شود.
            </p>
          </div>
          <input
            type="checkbox"
            checked={useEnvFallback}
            onChange={(e) => setUseEnvFallback(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </label>
      </div>

      {message && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 disabled:opacity-50 hover:shadow-xl transition"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        ذخیره تنظیمات AI
      </button>

      {settings?.updatedAt && (
        <p className="text-xs text-gray-400">
          آخرین بروزرسانی تنظیمات:{" "}
          {new Date(settings.updatedAt).toLocaleString("fa-IR")}
        </p>
      )}
    </div>
  );
}
