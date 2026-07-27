import { NextRequest, NextResponse } from "next/server";
import { getAISettings, maskApiKey, updateAISettings } from "@/lib/db";
import { requireAdminFromRequest, unauthorizedResponse } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  const settings = await getAISettings();
  return NextResponse.json({
    settings: {
      openaiModel: settings.openaiModel,
      useEnvFallback: settings.useEnvFallback,
      hasApiKey: !!settings.openaiApiKey,
      maskedApiKey: maskApiKey(settings.openaiApiKey),
      hasEnvKey: !!process.env.OPENAI_API_KEY,
      updatedAt: settings.updatedAt,
    },
  });
}

export async function PUT(request: NextRequest) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  const body = (await request.json()) as {
    openaiApiKey?: string;
    openaiModel?: string;
    useEnvFallback?: boolean;
    clearApiKey?: boolean;
  };

  const updates: Parameters<typeof updateAISettings>[0] = {};

  if (body.clearApiKey) {
    updates.openaiApiKey = "";
  } else if (body.openaiApiKey !== undefined && body.openaiApiKey !== "") {
    updates.openaiApiKey = body.openaiApiKey;
  }

  if (body.openaiModel) updates.openaiModel = body.openaiModel;
  if (body.useEnvFallback !== undefined) {
    updates.useEnvFallback = body.useEnvFallback;
  }

  const settings = await updateAISettings(updates);

  return NextResponse.json({
    settings: {
      openaiModel: settings.openaiModel,
      useEnvFallback: settings.useEnvFallback,
      hasApiKey: !!settings.openaiApiKey,
      maskedApiKey: maskApiKey(settings.openaiApiKey),
      hasEnvKey: !!process.env.OPENAI_API_KEY,
      updatedAt: settings.updatedAt,
    },
  });
}
