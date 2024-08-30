"use server";
import { prisma } from "@/server/db";
import { revalidatePath } from 'next/cache';

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

export async function getSubscribers() {
    try {
        const subscribers = await prisma.user.findMany({
            select: {
                id: true,
                last_name: true,
                first_name: true,
            },
            where: {
                role: 'USER',
            },
            orderBy: {
                last_name: 'asc',
            },
        })

        revalidatePath("/login")

        return subscribers
    } catch (error) {
        console.error('Erreur lors de la récupération des souscripteurs:', error)
        throw new Error("Impossible de récupérer la liste des souscripteurs.")
    }
}