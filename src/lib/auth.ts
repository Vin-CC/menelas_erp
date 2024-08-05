import { auth } from "@/server/auth";
import { Role } from "@prisma/client";
import { User } from "next-auth";

export const currentUser = async (): Promise<(User & { id: string, role: Role }) | null> => {
    const session = await auth();

    if (!session || !session.user) {
        return null;
    }

    return session.user as User & { id: string, role: Role };
};

export const currentRole = async (): Promise<Role | undefined> => {
    const session = await auth();

    return session?.user?.role;
};