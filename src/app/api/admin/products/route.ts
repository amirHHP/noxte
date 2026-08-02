import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminFromRequest, unauthorizedResponse } from "@/lib/admin-api";
import { getAllProducts, createProduct } from "@/lib/db";

export async function GET(request: NextRequest) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "خطا در دریافت محصولات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  try {
    const body = await request.json();

    if (!body.id || !body.name || body.price === undefined) {
      return NextResponse.json(
        { error: "فیلدهای id، name و price الزامی هستند" },
        { status: 400 }
      );
    }

    const product = await createProduct({
      id: body.id,
      name: body.name,
      nameEn: body.nameEn || "",
      description: body.description || "",
      price: Number(body.price),
      emoji: body.emoji || "🎁",
      color: body.color || "#f5f5f5",
      traits: body.traits || [],
      occasion: body.occasion || [],
      size: body.size || "",
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder ?? 0,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "خطا در ایجاد محصول" }, { status: 500 });
  }
}
