import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/generic-searchbar';
import { PolicyholderTable } from './_components/policyholder-table';
import { getPolicyholders } from '../../../../services/policyholderService';

interface PolicyholderResponse {
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

async function Policyholder() {
    const policyholdersData: PolicyholderResponse = await getPolicyholders({});

    return (
        <div>
            <div className="flex gap-32 items-center mb-4">
                <SearchBar
                    placeholder="Chercher un assuré"
                    apiEndpoint="/api/policyholder"
                    resultPath="/assure"
                />
                <Button asChild>
                    <Link href="/assures/nouveau">Ajouter assuré</Link>
                </Button>
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
                <PolicyholderTable data={policyholdersData.data} meta={policyholdersData.meta} />
            </Suspense>
        </div>
    );
}

export default Policyholder;