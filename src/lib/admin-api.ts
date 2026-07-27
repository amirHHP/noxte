import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export function unauthorizedResponse() {
  return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
}

export function requireAdminFromRequest(request: NextRequest): boolean {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return !!token && verifySessionToken(token);
}
