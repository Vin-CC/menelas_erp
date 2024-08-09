import { DEFAULT_LOGIN_REDIRECTION, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes"
import authConfig from "@/auth.config"
import NextAuth, { Session } from 'next-auth';
import { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req: NextRequest & { auth: Session | null }): any => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    console.log("middleware isLoggedIn", isLoggedIn);
    console.log("middleware nextUrl.pathname", nextUrl.pathname);


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
    // matcher: [
    //     // Skip Next.js internals and all static files, unless found in search params
    //     // '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    //     // Always run for API routes
    //     // '/(api|trpc)(.*)',
    // ],
}
