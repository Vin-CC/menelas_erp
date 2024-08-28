import { Suspense } from 'react';
import ContractSearchBar from './_components/contract-search-bar';
import { ContractTable } from './_components/contract-table';
import { SouscripteurSelect } from './_components/souscripteur-select';
import { ExportButton } from './_components/export-button';

interface ContractResponse {
    data: any[];
    meta: {
        total: number;
        last_page: number;
        per_page: number;
        next_page: string | null;
        prev_page: string | null;
        current_page: number;
        max_page: number;
        limit: number;
        totalByState: Record<string, number>;
    };
}

interface SubscriberResponse {
    id: string;
    last_name: string;
    first_name: string;
}

async function getContracts(): Promise<ContractResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${baseUrl}/api/contracts`, { next: { tags: ['contracts'] } });
    return res.json();
}

async function getSubscribers(): Promise<SubscriberResponse[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${baseUrl}/api/subscribers`, { next: { tags: ['subscribers'] } });
    return res.json();
}

export default async function Contract() {
    const contractsPromise = getContracts();
    const subscribersPromise = getSubscribers();

    const [contracts, souscripteursData] = await Promise.all([contractsPromise, subscribersPromise]);

    return (
        <div className="space-y-6 p-8">
            <h1 className="text-2xl font-bold">Contrats</h1>

            <div className="flex justify-between items-center">
                <div className='flex gap-4 w-1/2'>
                    <div className="w-1/2">
                        <ContractSearchBar />
                    </div>
                    <div className="w-1/2">
                        <SouscripteurSelect souscripteursData={souscripteursData} />
                    </div>
                </div>

                <ExportButton />
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
                <ContractTable
                    initialData={contracts.data}
                    initialMeta={contracts.meta}
                />
            </Suspense>
        </div>
    );
}