import type { PersonalityTrait } from "./types";
import { PRODUCTS } from "./products";

const TRAIT_KEYWORDS: Record<PersonalityTrait, string[]> = {
  kind: ["مهربان", "دلسوز", "خوب", "مهربونی", "لطف", "کمک", "حمایت", "مهربانه", "kind", "caring", "sweet", "helpful"],
  creative: ["خلاق", "ایده", "نوآور", "هنرمند", "خلاقیت", "creative", "innovative", "artistic", "imaginative"],
  organized: ["منظم", "سازمان", "برنامه", "مرتب", "organized", "structured", "planned", "neat"],
  humorous: ["شوخ", "بامزه", "خنده", "طنز", "فان", "humor", "funny", "joke", "lol", "😂", "🤣"],
  leader: ["رهبر", "مدیر", "هدایت", "رهبری", "leader", "manager", "lead", "boss", "direct"],
  patient: ["صبور", "آرام", "حوصله", "patient", "calm", "peaceful", "steady"],
  energetic: ["پرانرژی", "فعال", "پرشور", "انرژی", "energetic", "active", "dynamic", "enthusiastic"],
  meticulous: ["دقیق", "جزئیات", "کامل", "بی‌نقص", "meticulous", "detail", "precise", "thorough", "perfect"],
  empathetic: ["همدل", "درک", "احساس", "empathetic", "understanding", "compassionate", "supportive"],
  bold: ["جسور", "شجاع", "ریسک", "bold", "brave", "courageous", "fearless", "daring"],
  loyal: ["وفادار", "قابل اعتماد", "همیشه", "loyal", "trustworthy", "reliable", "faithful"],
  optimistic: ["مثبت", "امیدوار", "شاد", "خوشبین", "optimistic", "positive", "happy", "cheerful"],
};

function scoreTraits(text: string): Map<PersonalityTrait, number> {
  const lower = text.toLowerCase();
  const scores = new Map<PersonalityTrait, number>();

  for (const [trait, keywords] of Object.entries(TRAIT_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) score += 1;
    }
    if (score > 0) scores.set(trait as PersonalityTrait, score);
  }

  return scores;
}

function recommendFromTraits(
  traits: PersonalityTrait[],
  limit = 3
): { productIds: string[]; reasoning: string } {
  const scored = PRODUCTS.map((product) => {
    const matchCount = product.traits.filter((t) => traits.includes(t)).length;
    return { product, score: matchCount };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, limit);

  if (top.length === 0) {
    const fallback = PRODUCTS.slice(0, 3);
    return {
      productIds: fallback.map((p) => p.id),
      reasoning:
        "بر اساس توصیف شما، این بج‌ها می‌توانند گزینه‌های مناسبی برای هدیه باشند.",
    };
  }

  const traitNames = traits
    .slice(0, 3)
    .map((t) => {
      const labels: Record<string, string> = {
        kind: "مهربان", creative: "خلاق", organized: "منظم", humorous: "شوخ‌طبع",
        leader: "رهبر", patient: "صبور", energetic: "پرانرژی", meticulous: "دقیق",
        empathetic: "همدل", bold: "جسور", loyal: "وفادار", optimistic: "مثبت‌اندیش",
      };
      return labels[t] || t;
    })
    .join("، ");

  return {
    productIds: top.map((s) => s.product.id),
    reasoning: `بر اساس تحلیل، همکارتان ویژگی‌های ${traitNames} دارد. این بج‌ها بهترین انتخاب برای هدیه دادن هستند.`,
  };
}

export function recommendFromText(description: string) {
  const scores = scoreTraits(description);
  const sortedTraits = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([trait]) => trait);

  const detectedTraits =
    sortedTraits.length > 0
      ? sortedTraits.slice(0, 4)
      : (["kind", "optimistic"] as PersonalityTrait[]);

  const { productIds, reasoning } = recommendFromTraits(detectedTraits);

  return { productIds, reasoning, detectedTraits };
}

export function buildAIContext(): string {
  const productList = PRODUCTS.map(
    (p) =>
      `- ${p.id}: ${p.name} (ویژگی‌ها: ${p.traits.join(", ")}) — ${p.description}`
  ).join("\n");

  return `تو یک مشاور هدیه برای فروشگاه بج‌های مینیاتوری Noxte هستی.
محصولات موجود:
${productList}

ویژگی‌های اخلاقی قابل تشخیص: kind, creative, organized, humorous, leader, patient, energetic, meticulous, empathetic, bold, loyal, optimistic

بر اساس توصیف همکار یا محتوای چت، ۳ بج مناسب پیشنهاد بده.
پاسخ را فقط به صورت JSON بده:
{
  "productIds": ["id1", "id2", "id3"],
  "reasoning": "توضیح فارسی کوتاه",
  "detectedTraits": ["trait1", "trait2"]
}`;
}
