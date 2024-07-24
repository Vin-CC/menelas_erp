'use client'
import { CustomModeToggle } from "../custom-mod-toggle";
import { SidebarItem } from "./sidebar-item";
import Link from "next/link";

export function Sidebar() {
    return (
        <aside className="w-64 bg-white dark:bg-gray-900 flex flex-col h-full border-r border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-4">
                <h1 className="text-xl font-bold">Ménélas</h1>
                <CustomModeToggle />
            </div>
            <Link href="/settings" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                Settings
            </Link>
            <nav className="flex-1 p-2 overflow-y-auto">
                <SidebarItem icon="FiHome" label="Dashboard" href="/" />
                <SidebarItem icon="FiUser" label="Assurés" href="/assures" />
                <SidebarItem icon="FiFile" label="Projets" href="/projets" />
                <SidebarItem icon="FiFileText" label="Contrats" href="/contrats" />
                <SidebarItem icon="FiUser" label="Apporteurs" href="/apporteurs" />
                <SidebarItem icon="FiUser" label="Partenaires" href="/partenaires" />
                <SidebarItem icon="FiFile" label="Produits" href="/produits" />
                <SidebarItem icon="FiCalendar" label="Echéances" href="/echeances" />
                <SidebarItem icon="FiCreditCard" label="Paiements" href="/paiements" />
                <SidebarItem icon="FiBell" label="Evenements" href="/evenements" />
                <SidebarItem icon="RiFileDamageLine" label="Sinistres" href="/sinistres" />
                <div className="border-t border-gray-200 dark:border-gray-700">
                    <SidebarItem icon='FiLogOut' label="Déconnexion" href="/logout" />
                </div>
            </nav>
        </aside>
    );
}


