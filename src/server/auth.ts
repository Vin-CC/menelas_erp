import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { Role } from "@prisma/client";

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    pages: {
        signIn: "/login",
        verifyRequest: "/login/verifier-mails",
        error: "/login/erreur",
    },
    callbacks: {
        async jwt({ token, user }) {
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
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.first_name = token.firstName as string;
                session.user.last_name = token.lastName as string;
                session.user.role = token.role as Role;
                session.user.image = token.image as string | undefined;
            }
            return session;
        },
    },
    ...authConfig,
})