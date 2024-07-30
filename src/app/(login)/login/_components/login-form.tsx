"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyUserEmail } from "@/actions/user/read";
import { clientLogin } from "@/actions/user/loginClient";
import { FcGoogle } from "react-icons/fc";

export function LoginForm({ error: initialError }: { error?: string }) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(initialError || "");
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const verifyResult = await verifyUserEmail(email);
            if (verifyResult.error) {
                setError(verifyResult.error);
                return;
            }
            const loginResult = await clientLogin(email);
            if (loginResult.error) {
                setError(loginResult.error);
            } else if (loginResult.success) {
                router.push(loginResult.callbackUrl);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            setError("Une erreur s'est produite lors de l'envoi de l'email de vérification. Veuillez réessayer plus tard.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn("google", { callbackUrl: "/" });
        } catch (error) {
            console.error("Erreur lors de la connexion Google:", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h2 className="mt-6 text-3xl font-bold tracking-tight dark:text-white">
                    Se connecter
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Entrez votre email pour vous connecter
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <Input
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Button type="submit" variant="default" className="w-full" disabled={isLoading}>
                    {isLoading ? "Envoi en cours..." : "Se connecter avec un email"}
                </Button>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            ou continuer avec
                        </span>
                    </div>
                </div>
                <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-2"
                    variant="outline"
                >
                    <FcGoogle className="h-6 w-6" />
                    Google
                </Button>
            </form>
            {error && (
                <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}