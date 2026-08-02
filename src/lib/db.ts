import { prisma } from "./prisma";
import type { AISettings, Order, OrderStatus, Product, PersonalityTrait } from "./types";
import { promises as fs } from "fs";
import path from "path";

const ORDERS_FILE = "orders.json";
const SETTINGS_FILE = "settings.json";
const PRODUCTS_FILE = "products.json";

function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NX-${date}-${rand}`;
}

const DEFAULT_SETTINGS: AISettings = {
  provider: "gemini",
  openaiApiKey: "",
  openaiModel: "gpt-4o-mini",
  geminiApiKey: "",
  geminiModel: "gemini-2.5-flash",
  useEnvFallback: true,
  updatedAt: new Date().toISOString(),
};

/** Helper to check if PostgreSQL DATABASE_URL is provided */
function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "");
}

/* =========================================================================
   JSON Fallback Functions (for local dev without DB)
   ========================================================================= */

function getDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "noxte-data");
  }
  return path.join(process.cwd(), "data");
}

async function ensureDataDir(): Promise<boolean> {
  try {
    await fs.mkdir(getDataDir(), { recursive: true });
    return true;
  } catch {
    return false;
  }
}

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  const filepath = path.join(getDataDir(), filename);
  try {
    const raw = await fs.readFile(filepath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    if (process.env.VERCEL) {
      try {
        const seed = path.join(process.cwd(), "data", filename);
        const raw = await fs.readFile(seed, "utf-8");
        return JSON.parse(raw) as T;
      } catch {
        /* ignore */
      }
    }
    return fallback;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  const ready = await ensureDataDir();
  if (!ready) {
    throw new Error("امکان ذخیره داده وجود ندارد");
  }
  const filepath = path.join(getDataDir(), filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");
}

/* =========================================================================
   Order Management Functions
   ========================================================================= */

export async function getOrders(): Promise<Order[]> {
  if (hasDatabase()) {
    try {
      const records = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      return records.map((r) => ({
        id: r.id,
        customerName: r.customerName,
        customerEmail: r.customerEmail,
        customerPhone: r.customerPhone ?? undefined,
        company: r.company ?? undefined,
        note: r.note ?? undefined,
        totalPrice: r.totalPrice,
        totalItems: r.totalItems,
        status: r.status as OrderStatus,
        paymentStatus: r.paymentStatus as any,
        paymentAuthority: r.paymentAuthority ?? undefined,
        paymentRefId: r.paymentRefId ?? undefined,
        paymentCardPan: r.paymentCardPan ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        items: r.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          emoji: item.emoji,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
      }));
    } catch (error) {
      console.error("Prisma getOrders failed, falling back to JSON:", error);
    }
  }

  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  if (hasDatabase()) {
    try {
      const r = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!r) return undefined;
      return {
        id: r.id,
        customerName: r.customerName,
        customerEmail: r.customerEmail,
        customerPhone: r.customerPhone ?? undefined,
        company: r.company ?? undefined,
        note: r.note ?? undefined,
        totalPrice: r.totalPrice,
        totalItems: r.totalItems,
        status: r.status as OrderStatus,
        paymentStatus: r.paymentStatus as any,
        paymentAuthority: r.paymentAuthority ?? undefined,
        paymentRefId: r.paymentRefId ?? undefined,
        paymentCardPan: r.paymentCardPan ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        items: r.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          emoji: item.emoji,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
      };
    } catch (error) {
      console.error("Prisma getOrderById failed, falling back to JSON:", error);
    }
  }

  const orders = await getOrders();
  return orders.find((o) => o.id === id);
}

export async function createOrder(
  data: Omit<Order, "id" | "status" | "paymentStatus" | "createdAt" | "updatedAt">
): Promise<Order> {
  const orderId = generateOrderId();

  if (hasDatabase()) {
    try {
      const created = await prisma.order.create({
        data: {
          id: orderId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          company: data.company,
          note: data.note,
          totalPrice: data.totalPrice,
          totalItems: data.totalItems,
          status: "pending",
          paymentStatus: "pending",
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              emoji: item.emoji,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
            })),
          },
        },
        include: { items: true },
      });

      return {
        id: created.id,
        customerName: created.customerName,
        customerEmail: created.customerEmail,
        customerPhone: created.customerPhone ?? undefined,
        company: created.company ?? undefined,
        note: created.note ?? undefined,
        totalPrice: created.totalPrice,
        totalItems: created.totalItems,
        status: created.status as OrderStatus,
        paymentStatus: created.paymentStatus as any,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
        items: created.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          emoji: item.emoji,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
      };
    } catch (error) {
      console.error("Prisma createOrder failed, falling back to JSON:", error);
    }
  }

  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  const now = new Date().toISOString();
  const order: Order = {
    ...data,
    id: orderId,
    status: "pending",
    paymentStatus: "pending",
    createdAt: now,
    updatedAt: now,
  };
  orders.unshift(order);
  await writeJson(ORDERS_FILE, orders);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  if (hasDatabase()) {
    try {
      const updated = await prisma.order.update({
        where: { id },
        data: { status },
        include: { items: true },
      });
      return {
        id: updated.id,
        customerName: updated.customerName,
        customerEmail: updated.customerEmail,
        customerPhone: updated.customerPhone ?? undefined,
        company: updated.company ?? undefined,
        note: updated.note ?? undefined,
        totalPrice: updated.totalPrice,
        totalItems: updated.totalItems,
        status: updated.status as OrderStatus,
        paymentStatus: updated.paymentStatus as any,
        paymentAuthority: updated.paymentAuthority ?? undefined,
        paymentRefId: updated.paymentRefId ?? undefined,
        paymentCardPan: updated.paymentCardPan ?? undefined,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        items: updated.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          emoji: item.emoji,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
      };
    } catch (error) {
      console.error("Prisma updateOrderStatus failed, falling back to JSON:", error);
    }
  }

  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  await writeJson(ORDERS_FILE, orders);
  return orders[index];
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (hasDatabase()) {
    try {
      await prisma.order.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error("Prisma deleteOrder failed, falling back to JSON:", error);
    }
  }

  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  await writeJson(ORDERS_FILE, filtered);
  return true;
}

export async function getOrderByAuthority(
  authority: string
): Promise<Order | undefined> {
  if (hasDatabase()) {
    try {
      const r = await prisma.order.findFirst({
        where: { paymentAuthority: authority },
        include: { items: true },
      });
      if (!r) return undefined;
      return {
        id: r.id,
        customerName: r.customerName,
        customerEmail: r.customerEmail,
        customerPhone: r.customerPhone ?? undefined,
        company: r.company ?? undefined,
        note: r.note ?? undefined,
        totalPrice: r.totalPrice,
        totalItems: r.totalItems,
        status: r.status as OrderStatus,
        paymentStatus: r.paymentStatus as any,
        paymentAuthority: r.paymentAuthority ?? undefined,
        paymentRefId: r.paymentRefId ?? undefined,
        paymentCardPan: r.paymentCardPan ?? undefined,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        items: r.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          emoji: item.emoji,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
      };
    } catch (error) {
      console.error("Prisma getOrderByAuthority failed, falling back to JSON:", error);
    }
  }

  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  return orders.find((o) => o.paymentAuthority === authority);
}

export async function updateOrderAuthority(
  id: string,
  authority: string
): Promise<void> {
  if (hasDatabase()) {
    try {
      await prisma.order.update({
        where: { id },
        data: { paymentAuthority: authority },
      });
      return;
    } catch (error) {
      console.error("Prisma updateOrderAuthority failed, falling back to JSON:", error);
    }
  }

  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return;
  orders[index] = {
    ...orders[index],
    paymentAuthority: authority,
    updatedAt: new Date().toISOString(),
  };
  await writeJson(ORDERS_FILE, orders);
}

export async function updateOrderPayment(
  id: string,
  paymentData: {
    paymentStatus: "paid" | "failed";
    paymentRefId?: string;
    paymentCardPan?: string;
  }
): Promise<Order | null> {
  if (hasDatabase()) {
    try {
      const current = await prisma.order.findUnique({ where: { id } });
      if (!current) return null;

      const nextStatus = paymentData.paymentStatus === "paid" ? "confirmed" : current.status;

      const updated = await prisma.order.update({
        where: { id },
        data: {
          paymentStatus: paymentData.paymentStatus,
          paymentRefId: paymentData.paymentRefId,
          paymentCardPan: paymentData.paymentCardPan,
          status: nextStatus,
        },
        include: { items: true },
      });

      return {
        id: updated.id,
        customerName: updated.customerName,
        customerEmail: updated.customerEmail,
        customerPhone: updated.customerPhone ?? undefined,
        company: updated.company ?? undefined,
        note: updated.note ?? undefined,
        totalPrice: updated.totalPrice,
        totalItems: updated.totalItems,
        status: updated.status as OrderStatus,
        paymentStatus: updated.paymentStatus as any,
        paymentAuthority: updated.paymentAuthority ?? undefined,
        paymentRefId: updated.paymentRefId ?? undefined,
        paymentCardPan: updated.paymentCardPan ?? undefined,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        items: updated.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          emoji: item.emoji,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
      };
    } catch (error) {
      console.error("Prisma updateOrderPayment failed, falling back to JSON:", error);
    }
  }

  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...paymentData,
    status: paymentData.paymentStatus === "paid" ? "confirmed" : orders[index].status,
    updatedAt: new Date().toISOString(),
  };
  await writeJson(ORDERS_FILE, orders);
  return orders[index];
}

/* =========================================================================
   Product Management Functions
   ========================================================================= */

function mapPrismaProduct(r: {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  emoji: string;
  color: string;
  traits: string[];
  occasion: string[];
  size: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}): Product {
  return {
    id: r.id,
    name: r.name,
    nameEn: r.nameEn,
    description: r.description,
    price: r.price,
    emoji: r.emoji,
    color: r.color,
    traits: r.traits as PersonalityTrait[],
    occasion: r.occasion,
    size: r.size,
    isActive: r.isActive,
    sortOrder: r.sortOrder,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

/** Get active products (for storefront) */
export async function getProducts(): Promise<Product[]> {
  if (hasDatabase()) {
    try {
      const records = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return records.map(mapPrismaProduct);
    } catch (error) {
      console.error("Prisma getProducts failed, falling back to JSON:", error);
    }
  }
  const products = await readJson<Product[]>(PRODUCTS_FILE, []);
  return products.filter((p) => p.isActive !== false);
}

/** Get ALL products including inactive (for admin) */
export async function getAllProducts(): Promise<Product[]> {
  if (hasDatabase()) {
    try {
      const records = await prisma.product.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return records.map(mapPrismaProduct);
    } catch (error) {
      console.error("Prisma getAllProducts failed, falling back to JSON:", error);
    }
  }
  return readJson<Product[]>(PRODUCTS_FILE, []);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (hasDatabase()) {
    try {
      const r = await prisma.product.findUnique({ where: { id } });
      if (!r) return undefined;
      return mapPrismaProduct(r);
    } catch (error) {
      console.error("Prisma getProductById failed, falling back to JSON:", error);
    }
  }
  const products = await readJson<Product[]>(PRODUCTS_FILE, []);
  return products.find((p) => p.id === id);
}

export async function createProduct(
  data: Omit<Product, "createdAt" | "updatedAt">
): Promise<Product> {
  if (hasDatabase()) {
    try {
      const created = await prisma.product.create({
        data: {
          id: data.id,
          name: data.name,
          nameEn: data.nameEn,
          description: data.description,
          price: data.price,
          emoji: data.emoji,
          color: data.color,
          traits: data.traits,
          occasion: data.occasion,
          size: data.size,
          isActive: data.isActive ?? true,
          sortOrder: data.sortOrder ?? 0,
        },
      });
      return mapPrismaProduct(created);
    } catch (error) {
      console.error("Prisma createProduct failed, falling back to JSON:", error);
    }
  }
  const products = await readJson<Product[]>(PRODUCTS_FILE, []);
  const now = new Date().toISOString();
  const product: Product = {
    ...data,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  };
  products.push(product);
  await writeJson(PRODUCTS_FILE, products);
  return product;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Promise<Product | null> {
  if (hasDatabase()) {
    try {
      const updated = await prisma.product.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.nameEn !== undefined && { nameEn: data.nameEn }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.emoji !== undefined && { emoji: data.emoji }),
          ...(data.color !== undefined && { color: data.color }),
          ...(data.traits !== undefined && { traits: data.traits }),
          ...(data.occasion !== undefined && { occasion: data.occasion }),
          ...(data.size !== undefined && { size: data.size }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
          ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        },
      });
      return mapPrismaProduct(updated);
    } catch (error) {
      console.error("Prisma updateProduct failed, falling back to JSON:", error);
    }
  }
  const products = await readJson<Product[]>(PRODUCTS_FILE, []);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = {
    ...products[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await writeJson(PRODUCTS_FILE, products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (hasDatabase()) {
    try {
      await prisma.product.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error("Prisma deleteProduct failed, falling back to JSON:", error);
    }
  }
  const products = await readJson<Product[]>(PRODUCTS_FILE, []);
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  await writeJson(PRODUCTS_FILE, filtered);
  return true;
}

export async function seedProducts(seedData: Omit<Product, "createdAt" | "updatedAt">[]): Promise<number> {
  if (hasDatabase()) {
    try {
      const existing = await prisma.product.count();
      if (existing > 0) return 0;
      let count = 0;
      for (const data of seedData) {
        await prisma.product.create({
          data: {
            id: data.id,
            name: data.name,
            nameEn: data.nameEn,
            description: data.description,
            price: data.price,
            emoji: data.emoji,
            color: data.color,
            traits: data.traits,
            occasion: data.occasion,
            size: data.size,
            isActive: data.isActive ?? true,
            sortOrder: data.sortOrder ?? count,
          },
        });
        count++;
      }
      return count;
    } catch (error) {
      console.error("Prisma seedProducts failed:", error);
    }
  }
  const products = await readJson<Product[]>(PRODUCTS_FILE, []);
  if (products.length > 0) return 0;
  const now = new Date().toISOString();
  const seeded = seedData.map((d, i) => ({
    ...d,
    isActive: d.isActive ?? true,
    sortOrder: d.sortOrder ?? i,
    createdAt: now,
    updatedAt: now,
  }));
  await writeJson(PRODUCTS_FILE, seeded);
  return seeded.length;
}

/* =========================================================================
   AI Settings Functions
   ========================================================================= */

export async function getAISettings(): Promise<AISettings> {
  if (hasDatabase()) {
    try {
      const record = await prisma.aISettings.findUnique({
        where: { id: "default" },
      });
      if (record) {
        return {
          provider: record.provider as any,
          openaiApiKey: record.openaiApiKey,
          openaiModel: record.openaiModel,
          geminiApiKey: record.geminiApiKey,
          geminiModel: record.geminiModel,
          useEnvFallback: record.useEnvFallback,
          updatedAt: record.updatedAt.toISOString(),
        };
      }
    } catch (error) {
      console.error("Prisma getAISettings failed, falling back to JSON:", error);
    }
  }

  try {
    return await readJson<AISettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
  } catch (error) {
    console.error("getAISettings failed:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateAISettings(
  updates: Partial<
    Pick<
      AISettings,
      | "provider"
      | "openaiApiKey"
      | "openaiModel"
      | "geminiApiKey"
      | "geminiModel"
      | "useEnvFallback"
    >
  >
): Promise<AISettings> {
  if (hasDatabase()) {
    try {
      const updated = await prisma.aISettings.upsert({
        where: { id: "default" },
        create: {
          id: "default",
          provider: updates.provider ?? DEFAULT_SETTINGS.provider,
          openaiApiKey: updates.openaiApiKey ?? DEFAULT_SETTINGS.openaiApiKey,
          openaiModel: updates.openaiModel ?? DEFAULT_SETTINGS.openaiModel,
          geminiApiKey: updates.geminiApiKey ?? DEFAULT_SETTINGS.geminiApiKey,
          geminiModel: updates.geminiModel ?? DEFAULT_SETTINGS.geminiModel,
          useEnvFallback: updates.useEnvFallback ?? DEFAULT_SETTINGS.useEnvFallback,
        },
        update: {
          ...updates,
        },
      });

      return {
        provider: updated.provider as any,
        openaiApiKey: updated.openaiApiKey,
        openaiModel: updated.openaiModel,
        geminiApiKey: updated.geminiApiKey,
        geminiModel: updated.geminiModel,
        useEnvFallback: updated.useEnvFallback,
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error("Prisma updateAISettings failed, falling back to JSON:", error);
    }
  }

  const current = await getAISettings();
  const next: AISettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeJson(SETTINGS_FILE, next);
  return next;
}

export function maskApiKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return "••••••••";
  return key.slice(0, 7) + "••••••••" + key.slice(-4);
}

export async function getActiveOpenAIKey(): Promise<string | null> {
  const settings = await getAISettings();
  if (settings.openaiApiKey) return settings.openaiApiKey;
  if (settings.useEnvFallback && process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  return null;
}

export async function getActiveOpenAIModel(): Promise<string> {
  const settings = await getAISettings();
  return settings.openaiModel || "gpt-4o-mini";
}

export async function getActiveGeminiKey(): Promise<string | null> {
  const settings = await getAISettings();
  if (settings.geminiApiKey) return settings.geminiApiKey;
  if (settings.useEnvFallback && process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  return null;
}

export async function getActiveGeminiModel(): Promise<string> {
  const settings = await getAISettings();
  return settings.geminiModel || "gemini-2.5-flash";
}
