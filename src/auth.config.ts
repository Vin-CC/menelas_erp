import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";

export default {
    session: { strategy: "jwt" },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.image,
                    last_name: profile.family_name,
                    first_name: profile.given_name,
                    role: "USER",
                }
            },
        }),
        // Don't use EmailProvider from "next-auth/providers/nodemailer" because it's not compatible with the middleware
        // since it's not possible to use Node.js Modules in Edge Runtime
        {
            id: "magiclink",
            type: "email",
            name: "Magiclink",
            from: process.env.EMAIL_FROM || "",
            maxAge: 24 * 60 * 60, // TODO change session max age
            server: process.env.EMAIL_SERVER,
            options: {},
            sendVerificationRequest: async ({ identifier: email, url }) => {
                try {
                    const response = await fetch(process.env.EMAIL_HTTP_ADDRESS || "", {
                        body: JSON.stringify({
                            to: [{ email: email }],
                            from: { email: process.env.EMAIL_FROM },
                            subject: "Sign in to Your page",
                            html: `
                                <!DOCTYPE html>
                                <html lang="fr">
                                    <head>
                                        <meta charset="UTF-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <title>Connexion à Ménélas</title>
                                        <style>
                                            body {
                                                font-family: Arial, sans-serif;
                                                line-height: 1.6;
                                                color: #333;
                                                background-color: #ffffff;
                                                margin: 0;
                                                padding: 20px;
                                            }
                                            .container {
                                                max-width: 600px;
                                                margin: 0 auto;
                                                background-color: #ffffff;
                                                border: 1px solid #000000;
                                            }
                                            .header {
                                                background-color: #000000;
                                                color: white;
                                                padding: 30px 20px;
                                                text-align: center;
                                            }
                                            .header h1 {
                                                margin: 0;
                                                font-size: 28px;
                                                font-weight: 300;
                                                letter-spacing: 2px;
                                            }
                                            .content {
                                                padding: 40px 20px;
                                                text-align: center;
                                            }
                                            .button {
                                                display: inline-block;
                                                background-color: #000000;
                                                color: white !important;
                                                padding: 12px 30px;
                                                text-decoration: none;
                                                font-weight: bold;
                                                margin: 20px 0;
                                            }
                                            p {
                                                color: #333333;
                                                font-size: 16px;
                                                line-height: 1.8;
                                                margin-bottom: 20px;
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        <div class="container">
                                            <div class="header">
                                                <h1>Ménélas</h1>
                                            </div>
                                            <div class="content">
                                                <p>Bonjour,</p>
                                                <p>Cliquez sur le bouton ci-dessous pour vous connecter à votre compte Ménélas:</p>
                                                <a href="${url}" class="button">Se connecter</a>
                                                <p>Si vous n'avez pas demandé cette connexion, vous pouvez ignorer cet email.</p>
                                                <p>Cordialement,<br>L'équipe Ménélas</p>
                                            </div>
                                        </div>
                                    </body>
                                </html>
                            `,
                        }),
                        headers: {
                            Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                    })

                    if (!response.ok) {
                        console.error("error sending login email:", response.status, response.statusText);
                        const { errors } = await response.json()
                        throw new Error(JSON.stringify(errors))
                    }
                } catch (error) {
                    console.error("Error sending auth email:", error);
                    throw error
                }
            }
        },
    ],
} satisfies NextAuthConfig