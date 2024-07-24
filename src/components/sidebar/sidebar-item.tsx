'use client'
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { IconType } from "react-icons";
import * as Icons from "react-icons/fi";
import * as IconsRx from "react-icons/rx";
import { RiFileDamageLine } from "react-icons/ri";

interface SidebarItemProps {
    icon: string;
    label: string;
    href: string;
}

export function SidebarItem({ icon, label, href }: SidebarItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href;
    const IconComponent = Icons[icon as keyof typeof Icons] as IconType || IconsRx[icon as keyof typeof IconsRx] as IconType || RiFileDamageLine as IconType

    return (
        <Link href={href} className={`flex items-center px-4 py-2 rounded-md ${isActive ? 'bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <IconComponent className={`mr-3 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} />
            <span className={isActive ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}>{label}</span>
        </Link>
    );
}