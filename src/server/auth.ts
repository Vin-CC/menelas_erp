import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { Role } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    // session: { strategy: "jwt" },
    // adapter: PrismaAdapter(prisma),
    pages: {
        signIn: "/login",
        verifyRequest: "/login/verifier-mails",
        error: "/login/erreur",
    },
    callbacks: {
        async jwt({ token, user }) {
            console.log("jwt token:", token);
            console.log("jwt user:", user);

            if (user) {
                token.id = user.id as string;
                token.email = user.email;
                token.name = user.name;
                token.firstName = user.first_name;
                token.lastName = user.last_name;
                token.role = user.role;
                token.image = user.image;
            }
            return token;
        },
        async session({ session, token }) {
            console.log("auth session", session);
            console.log("auth token", token);
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as Role;
            }

            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.first_name = token.firstName as string;
                session.user.last_name = token.lastName as string;
                session.user.role = token.role as Role;
                session.user.image = token.image as string | undefined;
            }
            console.log("auth session2", session);
            return session;
        },
    },
    ...authConfig,
})