import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  verifyAdminPassword,
  SESSION_COOKIE,
  SESSION_TTL_MS,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = (await request.json()) as { password?: string };

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_MS / 1000,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
