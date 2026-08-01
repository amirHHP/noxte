import { NextRequest, NextResponse } from "next/server";
import { getOrderByAuthority, updateOrderPayment } from "@/lib/db";
import { verifyPayment } from "@/lib/zarinpal";

/**
 * ZarinPal redirects the user here after payment.
 * Query params: Authority, Status (OK/NOK)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");
  const origin = request.nextUrl.origin;

  // ── Missing parameters ──────────────────────────────────
  if (!authority) {
    return NextResponse.redirect(
      `${origin}/payment/result?status=error&message=${encodeURIComponent("پارامترهای پرداخت نامعتبر است")}`
    );
  }

  // ── Find the order by authority ─────────────────────────
  const order = await getOrderByAuthority(authority);
  if (!order) {
    return NextResponse.redirect(
      `${origin}/payment/result?status=error&message=${encodeURIComponent("سفارش مرتبط با این پرداخت یافت نشد")}`
    );
  }

  // ── User cancelled at gateway ───────────────────────────
  if (status !== "OK") {
    await updateOrderPayment(order.id, { paymentStatus: "failed" });
    return NextResponse.redirect(
      `${origin}/payment/result?status=failed&orderId=${order.id}`
    );
  }

  // ── Verify payment with ZarinPal ────────────────────────
  try {
    const result = await verifyPayment(authority, order.totalPrice);

    await updateOrderPayment(order.id, {
      paymentStatus: "paid",
      paymentRefId: String(result.refId),
      paymentCardPan: result.cardPan,
    });

    return NextResponse.redirect(
      `${origin}/payment/result?status=ok&orderId=${order.id}&refId=${result.refId}`
    );
  } catch (error) {
    console.error("Payment verification failed:", error);
    await updateOrderPayment(order.id, { paymentStatus: "failed" });

    const message =
      error instanceof Error ? error.message : "خطا در تأیید پرداخت";
    return NextResponse.redirect(
      `${origin}/payment/result?status=failed&orderId=${order.id}&message=${encodeURIComponent(message)}`
    );
  }
}
