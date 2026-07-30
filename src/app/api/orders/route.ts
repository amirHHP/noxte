import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/db";
import type { OrderItem } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      company?: string;
      note?: string;
      items: OrderItem[];
      totalPrice: number;
      totalItems: number;
    };

    if (
      !body.customerName?.trim() ||
      !body.customerEmail?.trim() ||
      !body.items?.length
    ) {
      return NextResponse.json(
        { error: "اطلاعات سفارش ناقص است" },
        { status: 400 }
      );
    }

    const order = await createOrder({
      customerName: body.customerName.trim(),
      customerEmail: body.customerEmail.trim(),
      customerPhone: body.customerPhone?.trim(),
      company: body.company?.trim(),
      note: body.note?.trim(),
      items: body.items,
      totalPrice: body.totalPrice,
      totalItems: body.totalItems,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      {
        error: process.env.VERCEL
          ? "ثبت سفارش روی این هاست موقتی است و ممکن است پایدار نباشد. لطفاً بعداً دوباره تلاش کنید."
          : "خطا در ثبت سفارش",
      },
      { status: 500 }
    );
  }
}
