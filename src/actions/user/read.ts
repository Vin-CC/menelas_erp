"use server";
import { prisma } from "@/server/db";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return !!user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

export const verifyUserEmail = async (email: string) => {
    const userExists = await getUserByEmail(email);
    if (!userExists) {
        return { error: "Aucun compte trouvé avec cet email. Veuillez vous inscrire." };
    }
    return { success: true };
};