import React, { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from './_components/business-provider-search-bar';
import { BusinessProviderTable } from './_components/business-provider-table';

interface BusinessProviderResponse {
    data: any[];
    meta: {
        limit: number;
        last_seen_id: string;
        next_page: string | null;
        prev_page: string | null;
        current_page: number;
        max_page: number;
        total: number;
    };
}

async function BusinessProviderPage() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const businessProviders = await fetch(`${baseUrl}/api/businessprovider`, { next: { tags: ['businessprovider'] } });
    const businessProvidersData: BusinessProviderResponse = await businessProviders.json();

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <SearchBar />
                <Button asChild>
                    <Link href="/charges-affaire/nouveau">{`Ajouter apporteur d'affaire`}</Link>
                </Button>
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
                <BusinessProviderTable data={businessProvidersData.data} meta={businessProvidersData.meta} />
            </Suspense>
        </div>
    );
}

export default BusinessProviderPage;