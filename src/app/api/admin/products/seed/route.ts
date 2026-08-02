import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminFromRequest, unauthorizedResponse } from "@/lib/admin-api";
import { seedProducts } from "@/lib/db";
import { SEED_PRODUCTS } from "@/lib/products";

export async function POST(request: NextRequest) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  try {
    const count = await seedProducts(SEED_PRODUCTS);
    if (count === 0) {
      return NextResponse.json({ 
        message: "دیتابیس قبلاً محصولات دارد. seed انجام نشد.", 
        count: 0 
      });
    }
    return NextResponse.json({ 
      message: `${count} محصول با موفقیت seed شد`,
      count 
    });
  } catch (error) {
    console.error("Failed to seed products:", error);
    return NextResponse.json({ error: "خطا در seed محصولات" }, { status: 500 });
  }
}
