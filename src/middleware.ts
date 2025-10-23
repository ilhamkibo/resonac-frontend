// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Daftar rute
const publicRoutes = ['/signin', '/signup'];
const protectedRoutes = [ '/history'];

const getJwtSecretKey = () => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET environment variable is not set');
  }

  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Jika mencoba akses rute yang dilindungi
  if (protectedRoutes.some(p => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    try {
      await jwtVerify(token, getJwtSecretKey());
      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.delete('accessToken');
      return response;
    }
  }

  // Logika untuk pengguna yang sudah login tapi mencoba akses halaman signin/signup
  if (token && publicRoutes.some(p => pathname.startsWith(p))) {
    try {
      // Cek apakah tokennya masih valid sebelum redirect
      await jwtVerify(token, getJwtSecretKey());
      return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
      // Jika token tidak valid, biarkan saja di halaman login
      // dan hapus cookie yang salah
      const response = NextResponse.next();
      response.cookies.delete('accessToken');
      return response;
    }
  }

  return NextResponse.next();
}

// Konfigurasi Matcher: Tentukan di rute mana saja middleware ini akan berjalan
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (folder gambar publik Anda)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};