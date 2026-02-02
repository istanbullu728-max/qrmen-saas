import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authSession = request.cookies.get('auth_session')
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')

    // If trying to access dashboard without session, redirect to login
    if (isDashboard && !authSession) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If trying to access auth pages with session, redirect to dashboard
    if (isAuthPage && authSession) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
}
