import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildAIContext, recommendFromText } from "@/lib/ai-recommend";
import {
  getAISettings,
  getActiveGeminiKey,
  getActiveGeminiModel,
  getActiveOpenAIKey,
  getActiveOpenAIModel,
} from "@/lib/db";

function parseBase64Image(dataUrl: string): { mimeType: string; base64: string } | null {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], base64: match[2] };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, image } = body as {
      description?: string;
      image?: string;
    };

    if (!description && !image) {
      return NextResponse.json(
        { error: "لطفاً توصیف همکار یا تصویر چت را ارسال کنید" },
        { status: 400 }
      );
    }

    const settings = await getAISettings();
    const provider = settings.provider || "gemini";

    // ── 1. GEMINI PROVIDER ─────────────────────────────────────
    if (provider === "gemini") {
      const geminiKey = await getActiveGeminiKey();
      const geminiModel = await getActiveGeminiModel();

      if (geminiKey) {
        try {
          const userParts: Array<Record<string, unknown>> = [];
          if (description) {
            userParts.push({
              text: `همکارم را اینطور توصیف می‌کنم: ${description}`,
            });
          } else {
            userParts.push({
              text: "این اسکرین‌شات از چت با همکارم است. بر اساس محتوای چت، بهترین بج هدیه را پیشنهاد بده.",
            });
          }

          if (image) {
            const parsed = parseBase64Image(image);
            if (parsed) {
              userParts.push({
                inlineData: {
                  mimeType: parsed.mimeType,
                  data: parsed.base64,
                },
              });
            }
          }

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;

          const payload = {
            systemInstruction: {
              parts: [{ text: buildAIContext() }],
            },
            contents: [
              {
                role: "user",
                parts: userParts,
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
            },
          };

          const res = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const resJson = await res.json();
          const candidateText =
            resJson.candidates?.[0]?.content?.parts?.[0]?.text;

          if (candidateText) {
            const parsed = JSON.parse(candidateText);
            return NextResponse.json({
              productIds: parsed.productIds || [],
              reasoning: parsed.reasoning || "",
              detectedTraits: parsed.detectedTraits || [],
              provider: "gemini",
              model: geminiModel,
            });
          }
        } catch (geminiError) {
          console.error("Gemini API call error:", geminiError);
        }
      }
    }

    // ── 2. OPENAI PROVIDER ─────────────────────────────────────
    if (provider === "openai" || !process.env.GEMINI_API_KEY) {
      const apiKey = await getActiveOpenAIKey();
      const model = await getActiveOpenAIModel();

      if (apiKey) {
        try {
          const openai = new OpenAI({ apiKey });
          const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: "system", content: buildAIContext() },
          ];

          if (image) {
            messages.push({
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    description ||
                    "این اسکرین‌شات از چت با همکارم است. بر اساس محتوای چت، بهترین بج هدیه را پیشنهاد بده.",
                },
                {
                  type: "image_url",
                  image_url: { url: image },
                },
              ],
            });
          } else {
            messages.push({
              role: "user",
              content: `همکارم را اینطور توصیف می‌کنم: ${description}`,
            });
          }

          const completion = await openai.chat.completions.create({
            model,
            messages,
            response_format: { type: "json_object" },
            temperature: 0.7,
          });

          const content = completion.choices[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            return NextResponse.json({
              productIds: parsed.productIds || [],
              reasoning: parsed.reasoning || "",
              detectedTraits: parsed.detectedTraits || [],
              provider: "openai",
              model,
            });
          }
        } catch (openaiErr) {
          console.error("OpenAI API call error:", openaiErr);
        }
      }
    }

    // ── 3. LOCAL ALGORITHM FALLBACK ───────────────────────────
    const textToAnalyze = description || "همکار مهربان و شوخ‌طبع";
    const result = recommendFromText(textToAnalyze);

    return NextResponse.json({
      ...result,
      fallback: true,
      message:
        "تحلیل با الگوریتم محلی انجام شد. کلید API (Gemini یا OpenAI) را در پنل ادمین تنظیم کنید.",
    });
  } catch (error) {
    console.error("AI recommendation error:", error);
    const fallback = recommendFromText("همکار مهربان و خلاق");
    return NextResponse.json({
      ...fallback,
      fallback: true,
      message: "خطا در اتصال به AI. نتایج پیش‌فرض نمایش داده شد.",
    });
  }
}
