import { Sidebar } from '@/components/sidebar/sidebar';

export default function AppLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8 bg-white dark:bg-gray-900">
                {children}
            </main>
        </div>
    );
}