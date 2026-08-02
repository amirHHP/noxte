import type { BulkTier, Product } from "./types";

export const BULK_TIERS: BulkTier[] = [
  { min: 1, discount: 0, label: "۱–۹ عدد" },
  { min: 10, discount: 0.1, label: "۱۰–۴۹ عدد (۱۰٪ تخفیف)" },
  { min: 50, discount: 0.2, label: "۵۰–۹۹ عدد (۲۰٪ تخفیف)" },
  { min: 100, discount: 0.3, label: "۱۰۰+ عدد (۳۰٪ تخفیف)" },
];

/** Seed data — used for initial database seeding and as JSON fallback */
export const SEED_PRODUCTS: Product[] = [
  {
    id: "heart-badge",
    name: "بج قلب مهربان",
    nameEn: "Kind Heart Badge",
    description: "عروسک کوچک قلب صورتی — برای همکار مهربانی که همیشه حمایت می‌کند",
    price: 45000,
    emoji: "💗",
    color: "#fce7f3",
    traits: ["kind", "empathetic"],
    occasion: ["تولد", "تشکر", "قدردانی"],
    size: "۱.۵ سانتی‌متر",
  },
  {
    id: "lightbulb-badge",
    name: "بج ایده خلاق",
    nameEn: "Creative Lightbulb",
    description: "لامپ کوچک درخشان — برای کسی که همیشه ایده‌های نو دارد",
    price: 45000,
    emoji: "💡",
    color: "#ede9fe",
    traits: ["creative", "bold"],
    occasion: ["تولد", "ارتقا", "پروژه جدید"],
    size: "۱.۸ سانتی‌متر",
  },
  {
    id: "crown-badge",
    name: "بج تاج رهبر",
    nameEn: "Leader Crown",
    description: "تاج طلایی مینیاتوری — برای رهبر تیم و الهام‌بخش",
    price: 55000,
    emoji: "👑",
    color: "#fef3c7",
    traits: ["leader", "bold"],
    occasion: ["ارتقا", "تولد", "پایان پروژه"],
    size: "۲ سانتی‌متر",
  },
  {
    id: "star-badge",
    name: "بج ستاره درخشان",
    nameEn: "Shining Star",
    description: "ستاره طلایی — برای همکار برجسته و مثبت‌اندیش",
    price: 50000,
    emoji: "⭐",
    color: "#fef9c3",
    traits: ["optimistic", "energetic"],
    occasion: ["تولد", "تشکر", "پایان پروژه"],
    size: "۱.۵ سانتی‌متر",
  },
  {
    id: "coffee-badge",
    name: "بج قهوه صبور",
    nameEn: "Patient Coffee",
    description: "فنجان قهوه کوچک — برای کسی که با صبر و حوصله کار می‌کند",
    price: 40000,
    emoji: "☕",
    color: "#f5f5f4",
    traits: ["patient", "organized"],
    occasion: ["تولد", "تشکر"],
    size: "۱.۲ سانتی‌متر",
  },
  {
    id: "rocket-badge",
    name: "بج موشک پرانرژی",
    nameEn: "Energetic Rocket",
    description: "موشک پرسرعت — برای همکار پرانرژی و پرشور",
    price: 50000,
    emoji: "🚀",
    color: "#ffedd5",
    traits: ["energetic", "bold", "optimistic"],
    occasion: ["پروژه جدید", "تولد", "ارتقا"],
    size: "۲ سانتی‌متر",
  },
  {
    id: "puzzle-badge",
    name: "بج پازل دقیق",
    nameEn: "Meticulous Puzzle",
    description: "قطعه پازل — برای کسی که به جزئیات اهمیت می‌دهد",
    price: 45000,
    emoji: "🧩",
    color: "#e0e7ff",
    traits: ["meticulous", "organized"],
    occasion: ["پایان پروژه", "تشکر"],
    size: "۱.۵ سانتی‌متر",
  },
  {
    id: "laugh-badge",
    name: "بج خنده شوخ‌طبع",
    nameEn: "Humorous Laugh",
    description: "ایموجی خنده — برای شوخ‌طبع تیم که فضا را شاد می‌کند",
    price: 40000,
    emoji: "😂",
    color: "#fef08a",
    traits: ["humorous", "optimistic"],
    occasion: ["تولد", "جشن تیم"],
    size: "۱.۵ سانتی‌متر",
  },
  {
    id: "handshake-badge",
    name: "بج دست وفادار",
    nameEn: "Loyal Handshake",
    description: "دست دادن مینیاتوری — برای همکار وفادار و قابل اعتماد",
    price: 45000,
    emoji: "🤝",
    color: "#ccfbf1",
    traits: ["loyal", "kind", "empathetic"],
    occasion: ["سالگرد همکاری", "تشکر", "قدردانی"],
    size: "۱.۸ سانتی‌متر",
  },
  {
    id: "magnifier-badge",
    name: "بج ذره‌بین دقیق",
    nameEn: "Detail Magnifier",
    description: "ذره‌بین کوچک — برای کسی که هیچ جزئیاتی را از دست نمی‌دهد",
    price: 45000,
    emoji: "🔍",
    color: "#ddd6fe",
    traits: ["meticulous", "patient"],
    occasion: ["پایان پروژه", "تشکر"],
    size: "۱.۵ سانتی‌متر",
  },
  {
    id: "bear-badge",
    name: "بج خرس همدل",
    nameEn: "Empathetic Bear",
    description: "خرس کوچک بامزه — برای همکار همدل و دلسوز",
    price: 50000,
    emoji: "🧸",
    color: "#fbcfe8",
    traits: ["empathetic", "kind", "patient"],
    occasion: ["تولد", "حمایت", "تشکر"],
    size: "۲ سانتی‌متر",
  },
  {
    id: "lion-badge",
    name: "بج شیر جسور",
    nameEn: "Bold Lion",
    description: "شیر کوچک شجاع — برای کسی که بدون ترس جلو می‌رود",
    price: 55000,
    emoji: "🦁",
    color: "#fed7aa",
    traits: ["bold", "leader", "energetic"],
    occasion: ["ارتقا", "پروژه جدید", "تولد"],
    size: "۲ سانتی‌متر",
  },
  {
    id: "clipboard-badge",
    name: "بج کلیپ‌بورد منظم",
    nameEn: "Organized Clipboard",
    description: "کلیپ‌بورد مینیاتوری — برای همکار منظم و سازمان‌یافته",
    price: 40000,
    emoji: "📋",
    color: "#bfdbfe",
    traits: ["organized", "meticulous"],
    occasion: ["تشکر", "پایان پروژه"],
    size: "۱.۵ سانتی‌متر",
  },
  {
    id: "rainbow-badge",
    name: "بج رنگین‌کمان مثبت",
    nameEn: "Optimistic Rainbow",
    description: "رنگین‌کمان کوچک — برای مثبت‌اندیس‌ترین نفر تیم",
    price: 45000,
    emoji: "🌈",
    color: "#e9d5ff",
    traits: ["optimistic", "creative", "humorous"],
    occasion: ["تولد", "جشن تیم"],
    size: "۱.۸ سانتی‌متر",
  },
  {
    id: "trophy-badge",
    name: "بج جام قهرمان",
    nameEn: "Champion Trophy",
    description: "جام طلایی مینیاتوری — برای قهرمان تیم و برنده",
    price: 60000,
    emoji: "🏆",
    color: "#fde68a",
    traits: ["leader", "bold", "energetic"],
    occasion: ["پایان پروژه", "ارتقا", "جشن تیم"],
    size: "۲ سانتی‌متر",
  },
  {
    id: "music-badge",
    name: "بج نت موسیقی خلاق",
    nameEn: "Creative Music Note",
    description: "نت موسیقی — برای همکار خلاق و هنرمند",
    price: 45000,
    emoji: "🎵",
    color: "#c4b5fd",
    traits: ["creative", "humorous", "optimistic"],
    occasion: ["تولد", "جشن تیم"],
    size: "۱.۵ سانتی‌متر",
  },
];

/** Backward-compatible alias */
export const PRODUCTS = SEED_PRODUCTS;

export function getProductById(id: string): Product | undefined {
  return SEED_PRODUCTS.find((p) => p.id === id);
}

export function getProductsByTrait(trait: string): Product[] {
  return SEED_PRODUCTS.filter((p) => p.traits.includes(trait as Product["traits"][number]));
}

export function getBulkDiscount(quantity: number): number {
  let discount = 0;
  for (const tier of BULK_TIERS) {
    if (quantity >= tier.min) discount = tier.discount;
  }
  return discount;
}

export function calculatePrice(unitPrice: number, quantity: number): number {
  const discount = getBulkDiscount(quantity);
  return Math.round(unitPrice * quantity * (1 - discount));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}
