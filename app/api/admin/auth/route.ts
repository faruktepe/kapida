import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const SESSION_COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24;
export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return NextResponse.json({ authenticated: session?.value === "1" });
}
export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "1", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: MAX_AGE, path: "/" });
  return response;
}
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 0, path: "/" });
  return response;
}
