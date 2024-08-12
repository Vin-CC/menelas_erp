import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type PaginationMeta = {
    limit: number;
    last_seen_id: string;
    next_page: string | null;
    prev_page: string | null;
    current_page: number;
    max_page: number;
    total: number;
};

type PaginationProps = {
    meta: PaginationMeta;
    basePath: string;
    queryParams?: Record<string, string>;
};

export function Pagination({ meta, basePath, queryParams = {} }: PaginationProps) {
    const getPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(queryParams);
        params.set('limit', meta.limit.toString());
        params.set('last_seen_id', ((pageNumber - 1) * meta.limit).toString());
        return `${basePath}?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
                <select className="border rounded p-2">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <Button variant="outline" disabled={!meta.prev_page}>
                    <Link href={meta.prev_page || '#'} className="flex items-center">
                        <ChevronLeft className="mr-2" /> Précédente
                    </Link>
                </Button>
                <div className="flex space-x-2">
                    {Array.from({ length: meta.max_page }, (_, i) => i + 1).map((pageNumber) => (
                        <Button
                            key={pageNumber}
                            variant={meta.current_page === pageNumber ? "default" : "outline"}
                        >
                            <Link href={getPageUrl(pageNumber)}>
                                {pageNumber}
                            </Link>
                        </Button>
                    ))}
                </div>
                <Button variant="outline" disabled={!meta.next_page}>
                    <Link href={meta.next_page || '#'} className="flex items-center">
                        Suivante <ChevronRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}