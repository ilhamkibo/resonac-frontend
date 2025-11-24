import 'server-only';
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function decryptJwt(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function verifySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;
  try {
    const payload = await decryptJwt(token);
    return payload; // berisi user info dari token
  } catch {
    return null;
  }
}
