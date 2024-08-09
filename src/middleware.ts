import { DEFAULT_LOGIN_REDIRECTION, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes"
import authConfig from "@/auth.config"
import NextAuth, { Session } from 'next-auth';
import { NextRequest } from "next/server"

export const { auth, signIn } = NextAuth(authConfig)

export default auth((req: NextRequest & { auth: Session | null }): any => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if (isApiAuthRoute) {
        return null
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECTION, nextUrl))
        }
        return null
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", nextUrl))
    }

    return null
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|svg).*)"],
}
