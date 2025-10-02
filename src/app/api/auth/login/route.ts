import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Proxy ke backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include", // penting kalau backend juga set cookie
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // Asumsikan backend balikin { accessToken, refreshToken }
  const response = NextResponse.json({ success: true });

  // simpan di cookie httpOnly
  response.cookies.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, // 15 menit
    path: "/",
  });

  response.cookies.set("refresh_token", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 hari
    path: "/",
  });

  return response;
}
