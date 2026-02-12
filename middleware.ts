import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authSession = request.cookies.get('auth_session')
    const { pathname } = request.nextUrl

    const isRoot = pathname === '/'
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
    const isDashboard = pathname.startsWith('/dashboard')

    // Force redirect from landing page (root) to login
    if (isRoot) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

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
    matcher: ['/', '/dashboard/:path*', '/login', '/register'],
}
