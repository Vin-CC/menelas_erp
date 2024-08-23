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

export default async function Contract() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/contracts`, { next: { tags: ['contracts'] } });
    const contracts: ContractResponse = await response.json();

    const responseSouscripteurs = await fetch(`${baseUrl}/api/subscribers`, { next: { tags: ['subscribers'] } });
    const souscripteursData = await responseSouscripteurs.json();

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