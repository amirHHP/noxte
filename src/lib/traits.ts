import type { PersonalityTrait } from "./types";

export const TRAIT_LABELS: Record<
  PersonalityTrait,
  { fa: string; en: string; emoji: string; color: string; description: string }
> = {
  kind: {
    fa: "مهربان",
    en: "Kind",
    emoji: "💝",
    color: "#f472b6",
    description: "همیشه به فکر دیگران است و با دل مهربان کمک می‌کند",
  },
  creative: {
    fa: "خلاق",
    en: "Creative",
    emoji: "🎨",
    color: "#a78bfa",
    description: "ایده‌های نو و راه‌حل‌های خلاقانه دارد",
  },
  organized: {
    fa: "منظم",
    en: "Organized",
    emoji: "📋",
    color: "#60a5fa",
    description: "همه چیز سر جای خودش است و برنامه‌ریزی عالی دارد",
  },
  humorous: {
    fa: "شوخ‌طبع",
    en: "Humorous",
    emoji: "😄",
    color: "#fbbf24",
    description: "با شوخی و لطیفه فضای کار را شاد می‌کند",
  },
  leader: {
    fa: "رهبر",
    en: "Leader",
    emoji: "👑",
    color: "#f59e0b",
    description: "تیم را هدایت می‌کند و الهام‌بخش دیگران است",
  },
  patient: {
    fa: "صبور",
    en: "Patient",
    emoji: "🧘",
    color: "#34d399",
    description: "در شرایط سخت آرامش خود را حفظ می‌کند",
  },
  energetic: {
    fa: "پرانرژی",
    en: "Energetic",
    emoji: "⚡",
    color: "#fb923c",
    description: "انرژی مثبت و اشتیاق بی‌پایان دارد",
  },
  meticulous: {
    fa: "دقیق",
    en: "Meticulous",
    emoji: "🔍",
    color: "#818cf8",
    description: "به جزئیات توجه ویژه دارد و کارش بی‌نقص است",
  },
  empathetic: {
    fa: "همدل",
    en: "Empathetic",
    emoji: "🤗",
    color: "#e879f9",
    description: "احساسات دیگران را درک می‌کند و همراهشان است",
  },
  bold: {
    fa: "جسور",
    en: "Bold",
    emoji: "🦁",
    color: "#ef4444",
    description: "بدون ترس تصمیم می‌گیرد و ریسک می‌کند",
  },
  loyal: {
    fa: "وفادار",
    en: "Loyal",
    emoji: "🤝",
    color: "#2dd4bf",
    description: "همیشه در کنار تیم است و قابل اعتماد",
  },
  optimistic: {
    fa: "مثبت‌اندیش",
    en: "Optimistic",
    emoji: "🌟",
    color: "#fde047",
    description: "همیشه نیمه پر لیوان را می‌بیند",
  },
};

export const ALL_TRAITS = Object.keys(TRAIT_LABELS) as PersonalityTrait[];
