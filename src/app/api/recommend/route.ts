import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  buildAIContext,
  recommendFromText,
} from "@/lib/ai-recommend";
import { getActiveOpenAIKey, getActiveOpenAIModel } from "@/lib/db";

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

    const apiKey = await getActiveOpenAIKey();
    const model = await getActiveOpenAIModel();

    if (apiKey) {
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
        });
      }
    }

    const textToAnalyze = description || "همکار مهربان و شوخ‌طبع";
    const result = recommendFromText(textToAnalyze);

    return NextResponse.json({
      ...result,
      fallback: true,
      message:
        "تحلیل با الگوریتم محلی انجام شد. کلید OpenAI را از پنل ادمین تنظیم کنید.",
    });
  } catch (error) {
    console.error("AI recommendation error:", error);

    const fallback = recommendFromText(
      "همکار مهربان و خلاق"
    );

    return NextResponse.json({
      ...fallback,
      fallback: true,
      message: "خطا در اتصال به AI. نتایج پیش‌فرض نمایش داده شد.",
    });
  }
}
