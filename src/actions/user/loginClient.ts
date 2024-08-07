"use client";

import { signIn } from "next-auth/react";

export const emailLogin = async (email: string) => {
    try {
        const result = await signIn("magiclink", {
            email,
            redirect: true,
            callbackUrl: "/login/erreur"
        });
        if (!result) {
            return { error: "Error logging in" };
        }
        if (result?.error) {
            return { error: result.error };
        }
        return { success: true, callbackUrl: "/login/verifier-mails" };
    } catch (error) {
        console.error("Error logging in:", error);
        return { error: "Une erreur s'est produite lors de la connexion" };
    }
};