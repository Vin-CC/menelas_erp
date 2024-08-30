import React, { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/generic-searchbar';
import { BusinessProviderTable } from './_components/business-provider-table';
import { getBusinessProviders } from '../../../../services/businessProviderService';

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
    const businessProvidersData: BusinessProviderResponse = await getBusinessProviders({});

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <SearchBar
                    placeholder="Chercher un apporteur d'affaire"
                    apiEndpoint="/api/businessprovider"
                    resultPath="/apporteur-affaire"
                />
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