"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Download,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  Check,
} from "lucide-react";
import { formatPrice } from "@/lib/products";
import { TRAIT_LABELS, ALL_TRAITS } from "@/lib/traits";
import type { Product, PersonalityTrait } from "@/lib/types";

/* ── Common Emojis for quick pick ─────────────────────────────── */
const EMOJI_PALETTE = [
  "💗","💡","👑","⭐","☕","🚀","🧩","😂","🤝","🔍",
  "🧸","🦁","📋","🌈","🏆","🎵","🎯","🌸","🔥","💎",
  "🎁","🧲","🪄","🐝","🦋","🌻","🍀","🌙","⚡","🎪",
];

type ModalMode = "create" | "edit" | null;

interface FormData {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: string;
  emoji: string;
  color: string;
  traits: PersonalityTrait[];
  occasion: string[];
  size: string;
  isActive: boolean;
  sortOrder: string;
}

const EMPTY_FORM: FormData = {
  id: "",
  name: "",
  nameEn: "",
  description: "",
  price: "",
  emoji: "🎁",
  color: "#f5f5f5",
  traits: [],
  occasion: [],
  size: "",
  isActive: true,
  sortOrder: "0",
};

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [occasionInput, setOccasionInput] = useState("");

  /* ── Toast helper ─────────────────────────────── */
  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  /* ── Fetch products ─────────────────────────────── */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("خطا در دریافت محصولات");
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ── Seed ─────────────────────────────── */
  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/products/seed", { method: "POST" });
      const data = await res.json();
      showToast(data.message);
      await fetchProducts();
    } catch {
      showToast("خطا در seed محصولات", "error");
    } finally {
      setSeeding(false);
    }
  };

  /* ── Open modal ─────────────────────────────── */
  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setOccasionInput("");
    setModalMode("create");
  };

  const openEdit = (product: Product) => {
    setFormData({
      id: product.id,
      name: product.name,
      nameEn: product.nameEn,
      description: product.description,
      price: String(product.price),
      emoji: product.emoji,
      color: product.color,
      traits: product.traits,
      occasion: product.occasion,
      size: product.size,
      isActive: product.isActive ?? true,
      sortOrder: String(product.sortOrder ?? 0),
    });
    setEditingId(product.id);
    setOccasionInput("");
    setModalMode("edit");
  };

  /* ── Generate slug from name ─────────────────────────────── */
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  /* ── Save (create / update) ─────────────────────────────── */
  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      showToast("نام و قیمت الزامی است", "error");
      return;
    }

    setSaving(true);
    try {
      const body = {
        ...formData,
        id: formData.id || slugify(formData.nameEn || formData.name) || `product-${Date.now()}`,
        price: Number(formData.price),
        sortOrder: Number(formData.sortOrder),
      };

      if (modalMode === "create") {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "خطا در ایجاد محصول");
        }
        showToast("محصول با موفقیت ایجاد شد");
      } else {
        const res = await fetch(`/api/admin/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "خطا در بروزرسانی محصول");
        }
        showToast("محصول با موفقیت بروزرسانی شد");
      }

      setModalMode(null);
      await fetchProducts();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "خطا", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ─────────────────────────────── */
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف محصول");
      showToast("محصول حذف شد");
      await fetchProducts();
    } catch {
      showToast("خطا در حذف محصول", "error");
    } finally {
      setDeleting(null);
    }
  };

  /* ── Toggle active ─────────────────────────────── */
  const toggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      if (!res.ok) throw new Error();
      showToast(product.isActive ? "محصول غیرفعال شد" : "محصول فعال شد");
      await fetchProducts();
    } catch {
      showToast("خطا در تغییر وضعیت", "error");
    }
  };

  /* ── Trait toggle in form ─────────────────────────────── */
  const toggleTrait = (trait: PersonalityTrait) => {
    setFormData((prev) => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter((t) => t !== trait)
        : [...prev.traits, trait],
    }));
  };

  /* ── Occasion management ─────────────────────────────── */
  const addOccasion = () => {
    const trimmed = occasionInput.trim();
    if (trimmed && !formData.occasion.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        occasion: [...prev.occasion, trimmed],
      }));
      setOccasionInput("");
    }
  };

  const removeOccasion = (occ: string) => {
    setFormData((prev) => ({
      ...prev,
      occasion: prev.occasion.filter((o) => o !== occ),
    }));
  };

  /* ── Filter products ─────────────────────────────── */
  const filtered = products.filter(
    (p) =>
      p.name.includes(searchQuery) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.includes(searchQuery) ||
      p.emoji.includes(searchQuery)
  );

  /* ── Stats ─────────────────────────────── */
  const activeCount = products.filter((p) => p.isActive !== false).length;
  const inactiveCount = products.length - activeCount;

  /* ===================================================================
     RENDER
     =================================================================== */
  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed left-6 top-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all animate-fade-in-up ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">محصولات</h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} محصول ({activeCount} فعال
            {inactiveCount > 0 && `، ${inactiveCount} غیرفعال`})
          </p>
        </div>
        <div className="flex gap-2">
          {products.length === 0 && !loading && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              {seeding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              بارگذاری محصولات پیش‌فرض
            </button>
          )}
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-100 transition hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" />
            محصول جدید
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="جستجوی محصول..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm text-gray-900 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Product Table */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-4xl">📦</p>
              <p className="mt-4 text-gray-500">
                {products.length === 0
                  ? "هنوز محصولی ثبت نشده"
                  : "محصولی با این جستجو یافت نشد"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      محصول
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">
                      قیمت
                    </th>
                    <th className="hidden px-4 py-3 text-right font-medium text-gray-500 md:table-cell">
                      ویژگی‌ها
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">
                      وضعیت
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((product) => (
                    <tr
                      key={product.id}
                      className={`transition hover:bg-gray-50/50 ${
                        product.isActive === false ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                            style={{ backgroundColor: product.color }}
                          >
                            {product.emoji}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {product.nameEn}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {formatPrice(product.price)}
                      </td>
                      <td className="hidden px-4 py-4 md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {product.traits.slice(0, 3).map((trait) => (
                            <span
                              key={trait}
                              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                backgroundColor:
                                  TRAIT_LABELS[trait].color + "22",
                                color: TRAIT_LABELS[trait].color,
                              }}
                            >
                              {TRAIT_LABELS[trait].emoji}{" "}
                              {TRAIT_LABELS[trait].fa}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleActive(product)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                            product.isActive !== false
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {product.isActive !== false ? (
                            <>
                              <Eye className="h-3 w-3" /> فعال
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" /> غیرفعال
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(product)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-violet-50 hover:text-violet-600"
                            title="ویرایش"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title="حذف"
                          >
                            {deleting === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Modal ─────────────────────────────── */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16 backdrop-blur-sm">
          <div className="w-full max-w-2xl animate-fade-in-up rounded-2xl border border-gray-100 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">
                {modalMode === "create" ? "محصول جدید" : "ویرایش محصول"}
              </h2>
              <button
                onClick={() => setModalMode(null)}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="space-y-5">
                {/* Row: emoji + color preview */}
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.emoji}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-medium text-gray-500">
                      رنگ پس‌زمینه
                    </label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, color: e.target.value }))
                      }
                      className="h-9 w-16 cursor-pointer rounded-lg border border-gray-200"
                    />
                  </div>
                </div>

                {/* Emoji picker */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500">
                    ایموجی
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOJI_PALETTE.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({ ...p, emoji }))
                        }
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
                          formData.emoji === emoji
                            ? "bg-violet-100 ring-2 ring-violet-400"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, emoji: e.target.value }))
                    }
                    className="mt-2 w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-center text-lg"
                    placeholder="🎁"
                  />
                </div>

                {/* Name fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      نام فارسی *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                      placeholder="بج قلب مهربان"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      نام انگلیسی
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, nameEn: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                      placeholder="Kind Heart Badge"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* ID (only for create) */}
                {modalMode === "create" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      شناسه (اختیاری — از نام انگلیسی ساخته می‌شود)
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, id: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                      placeholder="heart-badge"
                      dir="ltr"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    توضیحات
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                    placeholder="توضیح کوتاه درباره محصول"
                  />
                </div>

                {/* Price, Size, Sort */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      قیمت (تومان) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, price: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                      placeholder="45000"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      اندازه
                    </label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, size: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                      placeholder="۱.۵ سانتی‌متر"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      ترتیب نمایش
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          sortOrder: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                      placeholder="0"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Traits */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500">
                    ویژگی‌های اخلاقی
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TRAITS.map((trait) => {
                      const info = TRAIT_LABELS[trait];
                      const selected = formData.traits.includes(trait);
                      return (
                        <button
                          key={trait}
                          type="button"
                          onClick={() => toggleTrait(trait)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                            selected
                              ? "ring-2 ring-offset-1"
                              : "opacity-50 hover:opacity-80"
                          }`}
                          style={{
                            backgroundColor: info.color + "22",
                            color: info.color,
                            ...(selected && { ringColor: info.color }),
                          }}
                        >
                          {info.emoji} {info.fa}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Occasions */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500">
                    مناسبت‌ها
                  </label>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {formData.occasion.map((occ) => (
                      <span
                        key={occ}
                        className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                      >
                        🎁 {occ}
                        <button
                          type="button"
                          onClick={() => removeOccasion(occ)}
                          className="mr-0.5 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={occasionInput}
                      onChange={(e) => setOccasionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addOccasion();
                        }
                      }}
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                      placeholder="مثلاً: تولد"
                    />
                    <button
                      type="button"
                      onClick={addOccasion}
                      className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
                    >
                      افزودن
                    </button>
                  </div>
                  {/* Quick occasion buttons */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["تولد", "تشکر", "قدردانی", "ارتقا", "پروژه جدید", "پایان پروژه", "جشن تیم", "سالگرد همکاری"].map(
                      (occ) =>
                        !formData.occasion.includes(occ) && (
                          <button
                            key={occ}
                            type="button"
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                occasion: [...p.occasion, occ],
                              }))
                            }
                            className="rounded-full bg-gray-50 px-2.5 py-1 text-[10px] text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                          >
                            + {occ}
                          </button>
                        )
                    )}
                  </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, isActive: !p.isActive }))
                    }
                    className={`relative h-6 w-11 rounded-full transition ${
                      formData.isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                        formData.isActive ? "left-0.5" : "left-[22px]"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-600">
                    {formData.isActive
                      ? "فعال (در فروشگاه نمایش داده می‌شود)"
                      : "غیرفعال (در فروشگاه نمایش داده نمی‌شود)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setModalMode(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-100 transition hover:bg-violet-700 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {modalMode === "create" ? "ایجاد محصول" : "ذخیره تغییرات"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
