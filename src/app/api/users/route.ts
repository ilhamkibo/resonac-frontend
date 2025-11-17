import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL; // contoh: http://192.168.245.102:4000/api

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const status = searchParams.get("status");
  const role = searchParams.get("role");

  const token = req.headers.get("cookie")?.match(/accessToken=([^;]+)/)?.[1];

  const query = new URLSearchParams();
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (status) query.append("status", status);
  if (role) query.append("role", role);

  try {
    const response = await fetch(`${API_BASE}/users?${query.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy fetch failed:", error);
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}
