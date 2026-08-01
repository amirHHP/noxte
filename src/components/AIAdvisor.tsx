"use client";

import { useState, useRef } from "react";
import { Sparkles, Upload, Loader2 } from "lucide-react";
import type { AIRecommendation } from "@/lib/types";
import { PRODUCTS } from "@/lib/products";
import { TRAIT_LABELS } from "@/lib/traits";
import { ProductCard } from "./ProductCard";

export function AIAdvisor() {
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIRecommendation | null>(null);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!description && !imagePreview) return;

    setLoading(true);
    setResult(null);
    setFallbackMessage(null);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description || undefined,
          image: imagePreview || undefined,
        }),
      });

      const data = await res.json();
      setResult(data);
      if (data.message) setFallbackMessage(data.message);
    } catch {
      setFallbackMessage("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const recommendedProducts = result
    ? result.productIds
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              مشاور هوشمند هدیه
            </h2>
            <p className="text-sm text-gray-500">
              همکارتان را توصیف کنید یا اسکرین‌شات چت بفرستید
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              توصیف همکار
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثلاً: علی همیشه دیر می‌رسه ولی وقتی می‌رسه با شوخی فضا رو شاد می‌کنه. خیلی خلاقه و ایده‌های عجیب غریب داره..."
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">یا</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              اسکرین‌شات چت
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="پیش‌نمایش چت"
                  className="max-h-48 rounded-xl border border-gray-200 object-contain"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="absolute left-2 top-2 rounded-lg bg-white/90 px-2 py-1 text-xs text-red-500 shadow"
                >
                  حذف
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-8 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  تصویر چت را اینجا بکشید یا کلیک کنید
                </span>
                <span className="text-xs text-gray-400">
                  AI محتوای چت را تحلیل می‌کند
                </span>
              </button>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || (!description && !imagePreview)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white shadow-lg shadow-gray-200 transition hover:bg-gray-800 hover:shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                در حال تحلیل...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                پیشنهاد بج مناسب
              </>
            )}
          </button>
        </div>
      </div>

      {fallbackMessage && (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {fallbackMessage}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
            <p className="text-sm leading-relaxed text-green-800">
              {result.reasoning}
            </p>
            {result.detectedTraits.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {result.detectedTraits.map((trait) => (
                  <span
                    key={trait}
                    className="rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{
                      backgroundColor: TRAIT_LABELS[trait]?.color || "#0a0a0a",
                    }}
                  >
                    {TRAIT_LABELS[trait]?.emoji} {TRAIT_LABELS[trait]?.fa}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              بج‌های پیشنهادی
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedProducts.map(
                (product) =>
                  product && <ProductCard key={product.id} product={product} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
