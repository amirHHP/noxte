import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/db";
import { requireAdminFromRequest, unauthorizedResponse } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  const status = request.nextUrl.searchParams.get("status");
  let orders = await getOrders();

  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  return NextResponse.json({ orders });
}
