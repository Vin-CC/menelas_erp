"use client";
import { signIn } from "next-auth/react";

export const clientLogin = async (email: string) => {
    try {
        const result = await signIn("nodemailer", {
            email,
            redirect: false,
            callbackUrl: "/login/verifier-mails"
        });
        if (result?.error) {
            return { error: result.error };
        }
        return { success: true, callbackUrl: "/login/verifier-mails" };
    } catch (error) {
        console.error("Error logging in:", error);
        return { error: "Une erreur s'est produite lors de la connexion" };
    }
};