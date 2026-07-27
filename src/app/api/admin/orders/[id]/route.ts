import { NextRequest, NextResponse } from "next/server";
import { deleteOrder, getOrderById, updateOrderStatus } from "@/lib/db";
import { requireAdminFromRequest, unauthorizedResponse } from "@/lib/admin-api";
import type { OrderStatus } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  const { id } = await params;
  const body = (await request.json()) as { status?: OrderStatus };
  if (!body.status) {
    return NextResponse.json({ error: "وضعیت الزامی است" }, { status: 400 });
  }

  const order = await updateOrderStatus(id, body.status);
  if (!order) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!requireAdminFromRequest(request)) return unauthorizedResponse();

  const { id } = await params;
  const deleted = await deleteOrder(id);
  if (!deleted) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
