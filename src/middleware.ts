import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (token) {
        // If user is already logged in, prevent access to auth pages
        console.log(token)
        if (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sing-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/'
        ) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        // If no token, allow access to auth pages
        if (
            url.pathname.startsWith('/sing-up') ||
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/'
        ) {
            return NextResponse.next(); // Allow user to access these pages
        }

        // If user tries to access protected pages without a token, send to /sing-up
        return NextResponse.redirect(new URL('/sing-up', request.url));
    }
    if(!token){
        console.log('no token')

    }
    return NextResponse.next(); // Default case: allow request
}

export const config = {
    matcher: [
        '/sing-up',
        '/sign-in',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
};
