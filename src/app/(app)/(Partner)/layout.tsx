"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function PartnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/' },
        { label: 'Partenaires', href: '/partenaires' },
    ];

    if (pathname === '/partenaires/nouveau') {
        breadcrumbItems.push({ label: 'Nouveau', href: '/partenaires/nouveau' });
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Partenaires</h1>
            <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    {breadcrumbItems.map((item, index) => (
                        <li key={item.href} className="inline-flex items-center">
                            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
                            {index === breadcrumbItems.length - 1 ? (
                                <span>{item.label}</span>
                            ) : (
                                <Link href={item.href} className="text-gray-700 hover:text-blue-600">
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
            {children}
        </div>
    );
}