import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (token) {
        // If user is already logged in, prevent access to auth pages
        if (
            url.pathname.startsWith('/singIn') ||
            url.pathname.startsWith('/singUp') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/'
        ) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        // If no token, allow access to auth pages
        if (
            url.pathname.startsWith('/singUp') ||
            url.pathname.startsWith('/singIn') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/'
        ) {
            return NextResponse.next(); // Allow user to access these pages
        }

        // If user tries to access protected pages without a token, send to /home
        return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next(); // Default case: allow request
}

export const config = {
    matcher: [
        '/singUp',
        '/singIn',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
};
