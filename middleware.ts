import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    // Only apply to /admin routes, excluding /admin/login
    if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
        // Check for admin_logged_in cookie or similar
        // Note: Since the app uses localStorage for simple "auth", 
        // real middleware protection requires a cookie.
        // For now, let's look for a session cookie.
        const isAdmin = request.cookies.get("admin_session")?.value === "true"

        if (!isAdmin) {
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}
