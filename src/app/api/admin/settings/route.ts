import { NextRequest, NextResponse } from "next/server";
import { getAISettings, maskApiKey, updateAISettings } from "@/lib/db";
import { requireAdminFromRequest, unauthorizedResponse } from "@/lib/admin-api";
import type { AIProvider } from "@/lib/types";

export async function GET(request: NextRequest) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  const settings = await getAISettings();
  return NextResponse.json({
    settings: {
      provider: settings.provider || "gemini",
      openaiModel: settings.openaiModel || "gpt-4o-mini",
      hasApiKey: !!settings.openaiApiKey,
      maskedApiKey: maskApiKey(settings.openaiApiKey),
      hasEnvKey: !!process.env.OPENAI_API_KEY,
      geminiModel: settings.geminiModel || "gemini-2.5-flash",
      hasGeminiKey: !!settings.geminiApiKey,
      maskedGeminiKey: maskApiKey(settings.geminiApiKey),
      hasEnvGeminiKey: !!process.env.GEMINI_API_KEY,
      useEnvFallback: settings.useEnvFallback,
      updatedAt: settings.updatedAt,
    },
  });
}

export async function PUT(request: NextRequest) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  try {
    const body = (await request.json()) as {
      provider?: AIProvider;
      openaiApiKey?: string;
      openaiModel?: string;
      clearApiKey?: boolean;
      geminiApiKey?: string;
      geminiModel?: string;
      clearGeminiKey?: boolean;
      useEnvFallback?: boolean;
    };

    const updates: Parameters<typeof updateAISettings>[0] = {};

    if (body.provider) updates.provider = body.provider;

    // OpenAI Key updates
    if (body.clearApiKey) {
      updates.openaiApiKey = "";
    } else if (body.openaiApiKey !== undefined && body.openaiApiKey !== "") {
      updates.openaiApiKey = body.openaiApiKey;
    }
    if (body.openaiModel) updates.openaiModel = body.openaiModel;

    // Gemini Key updates
    if (body.clearGeminiKey) {
      updates.geminiApiKey = "";
    } else if (body.geminiApiKey !== undefined && body.geminiApiKey !== "") {
      updates.geminiApiKey = body.geminiApiKey;
    }
    if (body.geminiModel) updates.geminiModel = body.geminiModel;

    if (body.useEnvFallback !== undefined) {
      updates.useEnvFallback = body.useEnvFallback;
    }

    const settings = await updateAISettings(updates);

    return NextResponse.json({
      settings: {
        provider: settings.provider,
        openaiModel: settings.openaiModel,
        hasApiKey: !!settings.openaiApiKey,
        maskedApiKey: maskApiKey(settings.openaiApiKey),
        hasEnvKey: !!process.env.OPENAI_API_KEY,
        geminiModel: settings.geminiModel,
        hasGeminiKey: !!settings.geminiApiKey,
        maskedGeminiKey: maskApiKey(settings.geminiApiKey),
        hasEnvGeminiKey: !!process.env.GEMINI_API_KEY,
        useEnvFallback: settings.useEnvFallback,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "خطا در ذخیره تنظیمات AI" },
      { status: 500 }
    );
  }
}
