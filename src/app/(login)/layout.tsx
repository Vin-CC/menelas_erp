import { ModeToggle } from "@/components/ui/mode-toggle"

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <header className="p-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold dark:text-white">Ménélas</h1>
                <ModeToggle />
            </header>
            <main className="flex-grow flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>
        </div>
    )
}