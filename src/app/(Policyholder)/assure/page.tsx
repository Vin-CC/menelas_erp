"use client"
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SearchBar from './_components/search-bar';
import PolicyholderTable from './_components/policyholder-table';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPolicyholders } from '@/actions/policyholder/read';

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

export default function AssuresPage() {

    const searchParams = useSearchParams();
    const search = searchParams.get('search') || '';
    const last_seen_id = searchParams.get('last_seen_id') || '';
    const limit = searchParams.get('limit') || '';
    const [policyholders, setPolicyholders] = useState<PolicyholderResponse | null>(null);

    useEffect(() => {
        const getPolicyholders = async () => {
            const policyholders = await fetch(`/api/policyholder?search=${search}&last_seen_id=${last_seen_id}&limit=${limit}`);
            const data = await policyholders.json();
            setPolicyholders(data);
        }
        getPolicyholders();
    }
        , [search, last_seen_id, limit]);

    return (
        <div>
            <div className="flex gap-32 items-center mb-4">
                <SearchBar />
                <Button asChild>
                    <Link href="/assure/nouveau">Ajouter assuré</Link>
                </Button>
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
                {policyholders && <PolicyholderTable data={policyholders.data} meta={policyholders.meta} />}
            </Suspense>
        </div>
    );
}