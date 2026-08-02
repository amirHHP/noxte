import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminFromRequest, unauthorizedResponse } from "@/lib/admin-api";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  const { id } = await context.params;
  try {
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ error: "خطا در دریافت محصول" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  const { id } = await context.params;
  try {
    const body = await request.json();
    const updated = await updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی محصول" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  const { id } = await context.params;
  try {
    const deleted = await deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "خطا در حذف محصول" }, { status: 500 });
  }
}
