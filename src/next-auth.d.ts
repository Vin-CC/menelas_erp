import "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
    interface User {
        id: string | null;
        name?: string | null;
        email?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        role: Role;
        image?: string | null;
    }

    interface Session {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string | null;
        name?: string | null;
        email?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        role: Role;
        image?: string | null;
    }
}