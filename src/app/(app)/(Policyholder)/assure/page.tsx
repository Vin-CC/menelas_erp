import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from './_components/policyholder-search-bar';
import { PolicyholderTable } from './_components/policyholder-table';
import { auth } from '@/server/auth';

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
    const session = await auth()

    console.log("page session:", session);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const policyholders = await fetch(`${baseUrl}/api/policyholder`, {
        next: { tags: ['policyholder'] },
        cache: "no-cache",
        credentials: 'include',
    });
    const policyholdersData: PolicyholderResponse = await policyholders.json();
    console.log("policyholders", policyholdersData);


    return (
        <div>
            <div className="flex gap-32 items-center mb-4">
                <SearchBar />
                <Button asChild>
                    <Link href="/assure/nouveau">Ajouter assuré</Link>
                </Button>
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
                <PolicyholderTable data={policyholdersData.data} meta={policyholdersData.meta} />
            </Suspense>
        </div>
    );
}

export default Policyholder

