import { NextRequest, NextResponse } from "next/server";
import { createOrder, updateOrderAuthority } from "@/lib/db";
import { requestPayment } from "@/lib/zarinpal";
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

    // 1. Create the order with pending payment status
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

    // 2. Request payment from ZarinPal
    const origin = request.nextUrl.origin;
    const callbackUrl = `${origin}/api/payment/verify`;
    const description = `سفارش ${order.id} — ${body.totalItems} بج مینیاتوری`;

    const payment = await requestPayment(
      body.totalPrice,
      description,
      callbackUrl,
      {
        email: body.customerEmail.trim(),
        mobile: body.customerPhone?.trim(),
      }
    );

    // 3. Save the authority code on the order
    await updateOrderAuthority(order.id, payment.authority);

    return NextResponse.json(
      {
        order: { id: order.id },
        paymentUrl: payment.paymentUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    const message =
      error instanceof Error ? error.message : "خطا در ثبت سفارش";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
