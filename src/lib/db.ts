import { promises as fs } from "fs";
import path from "path";
import type { AISettings, Order, OrderStatus } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = "orders.json";
const SETTINGS_FILE = "settings.json";

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filepath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");
}

function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NX-${date}-${rand}`;
}

const DEFAULT_SETTINGS: AISettings = {
  openaiApiKey: "",
  openaiModel: "gpt-4o-mini",
  useEnvFallback: true,
  updatedAt: new Date().toISOString(),
};

export async function getOrders(): Promise<Order[]> {
  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id);
}

export async function createOrder(
  data: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">
): Promise<Order> {
  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  const now = new Date().toISOString();
  const order: Order = {
    ...data,
    id: generateOrderId(),
    status: "pending",
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
  const orders = await readJson<Order[]>(ORDERS_FILE, []);
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  await writeJson(ORDERS_FILE, filtered);
  return true;
}

export async function getAISettings(): Promise<AISettings> {
  return readJson<AISettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
}

export async function updateAISettings(
  updates: Partial<Pick<AISettings, "openaiApiKey" | "openaiModel" | "useEnvFallback">>
): Promise<AISettings> {
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
