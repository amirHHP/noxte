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
  createdAt: string;
  updatedAt: string;
}

export interface AISettings {
  openaiApiKey: string;
  openaiModel: string;
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
