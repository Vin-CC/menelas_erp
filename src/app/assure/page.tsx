import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SearchBar from './_components/SearchBar';
import PolicyholderTable from './_components/PolicyholderTable';
import { getPolicyholders } from '@/actions/policyholder/read';
import { ChevronRight } from 'lucide-react';

export default async function AssuresPage({
    searchParams,
}: {
    searchParams: { search?: string; last_seen_id?: string; limit?: string };
}) {
    const policyholders = await getPolicyholders(searchParams);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Assurés</h1>
            <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link href="/" className="text-gray-700 hover:text-blue-600">
                            Dashboard
                        </Link>
                    </li>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <li className="inline-flex items-center">
                        <Link href="/assure" className="text-gray-700 hover:text-blue-600">
                            Assurés
                        </Link>
                    </li>
                </ol>
            </nav>
            <div className="flex gap-32 items-center mb-4">
                <SearchBar />
                <Button asChild>
                    <Link href="/assure/nouveau">Ajouter assuré</Link>
                </Button>
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
                <PolicyholderTable data={policyholders.data} meta={policyholders.meta} />
            </Suspense>
        </div>
    );
}