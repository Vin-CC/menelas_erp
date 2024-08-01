import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/components/providers/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Menelas - ERP",
  description: "Système de gestion pour Menelas",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex h-screen">
              <main className="flex-1 overflow-auto bg-white dark:bg-gray-900">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}