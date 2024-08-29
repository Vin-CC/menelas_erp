import React, { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/generic-searchbar';
import { PartnerTable } from './_components/partner-table';
import { PartnerType } from '@prisma/client';

interface PartnerResponse {
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
const typeLabels: Record<PartnerType, string> = {
    INSURER: 'Assureur',
    WHOLESALER: 'Grossiste',
    AGENCY: 'Agence',
};


async function PartnerPage() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const partners = await fetch(`${baseUrl}/api/partners`, { next: { tags: ['partners'] } });
    const partnersData: PartnerResponse = await partners.json();

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <SearchBar
                    placeholder="Chercher un partenaire"
                    apiEndpoint="/api/partners"
                    resultPath="/partenaires"
                    typeLabels={typeLabels}
                />
                <Button asChild>
                    <Link href="/partenaires/nouveau">Ajouter partenaire</Link>
                </Button>
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
                <PartnerTable data={partnersData.data} meta={partnersData.meta} />
            </Suspense>
        </div>
    );
}

export default PartnerPage;