import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    console.log("middleware called");

    if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
    ],
};