import { NextRequest, NextResponse } from "next/server";
import { getActiveGeminiKey } from "@/lib/db";
import { requireAdminFromRequest, unauthorizedResponse } from "@/lib/admin-api";
import type { GeminiModelInfo } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  try {
    const body = (await request.json().catch(() => ({}))) as {
      apiKey?: string;
    };

    let keyToUse = body.apiKey?.trim();
    if (!keyToUse) {
      keyToUse = (await getActiveGeminiKey()) || undefined;
    }

    if (!keyToUse) {
      return NextResponse.json(
        { error: "کلید API برای Gemini وارد نشده است" },
        { status: 400 }
      );
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${keyToUse}`;
    const res = await fetch(apiUrl, { cache: "no-store" });
    const json = await res.json();

    if (!res.ok || json.error) {
      const msg = json.error?.message || "خطا در دریافت لیست مدل‌های Gemini";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    if (!json.models || !Array.isArray(json.models)) {
      return NextResponse.json(
        { error: "پاسخ نامعتبر از سرور Gemini" },
        { status: 500 }
      );
    }

    // Filter models that support content generation
    const rawModels = json.models as Array<{
      name: string;
      displayName?: string;
      description?: string;
      inputTokenLimit?: number;
      outputTokenLimit?: number;
      supportedGenerationMethods?: string[];
    }>;

    const filtered: GeminiModelInfo[] = rawModels
      .filter((m) =>
        m.supportedGenerationMethods?.includes("generateContent")
      )
      .map((m) => {
        const id = m.name.replace(/^models\//, "");
        return {
          name: m.name,
          id,
          displayName: m.displayName || id,
          description: m.description || "",
          inputTokenLimit: m.inputTokenLimit || 0,
          outputTokenLimit: m.outputTokenLimit || 0,
          supportedGenerationMethods: m.supportedGenerationMethods || [],
        };
      })
      .sort((a, b) => {
        // Prefer latest/flash models on top
        if (a.id.includes("2.5") && !b.id.includes("2.5")) return -1;
        if (!a.id.includes("2.5") && b.id.includes("2.5")) return 1;
        if (a.id.includes("flash") && !b.id.includes("flash")) return -1;
        if (!a.id.includes("flash") && b.id.includes("flash")) return 1;
        return a.id.localeCompare(b.id);
      });

    return NextResponse.json({
      success: true,
      count: filtered.length,
      models: filtered,
    });
  } catch (error) {
    console.error("Gemini models fetch error:", error);
    return NextResponse.json(
      { error: "خطا در برقراری ارتباط با API Gemini" },
      { status: 500 }
    );
  }
}
