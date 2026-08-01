export type PersonalityTrait =
  | "kind"
  | "creative"
  | "organized"
  | "humorous"
  | "leader"
  | "patient"
  | "energetic"
  | "meticulous"
  | "empathetic"
  | "bold"
  | "loyal"
  | "optimistic";

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  emoji: string;
  color: string;
  traits: PersonalityTrait[];
  occasion: string[];
  size: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BulkTier {
  min: number;
  discount: number;
  label: string;
}

export interface AIRecommendation {
  productIds: string[];
  reasoning: string;
  detectedTraits: PersonalityTrait[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface OrderItem {
  productId: string;
  productName: string;
  emoji: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  note?: string;
  items: OrderItem[];
  totalPrice: number;
  totalItems: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentAuthority?: string;
  paymentRefId?: string;
  paymentCardPan?: string;
  createdAt: string;
  updatedAt: string;
}

export type AIProvider = "openai" | "gemini";

export interface GeminiModelInfo {
  name: string; // e.g. "models/gemini-2.5-flash"
  id: string; // e.g. "gemini-2.5-flash"
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  supportedGenerationMethods: string[];
}

export interface AISettings {
  provider: AIProvider;
  openaiApiKey: string;
  openaiModel: string;
  geminiApiKey: string;
  geminiModel: string;
  useEnvFallback: boolean;
  updatedAt: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تأیید شده",
  processing: "در حال آماده‌سازی",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  failed: "پرداخت ناموفق",
};
