import { NextRequest, NextResponse } from "next/server";
import { searchOrders } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || searchParams.get("id");

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "لطفاً شماره سفارش، ایمیل یا شماره موبایل را وارد کنید" },
        { status: 400 }
      );
    }

    const orders = await searchOrders(query.trim());

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Track orders API error:", error);
    return NextResponse.json(
      { error: "خطا در پیگیری سفارش" },
      { status: 500 }
    );
  }
}
