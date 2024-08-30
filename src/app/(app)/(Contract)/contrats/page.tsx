import { Suspense } from 'react';
import { getProjectContracts } from '../../../../services/projectContractService';
import { getSubscribers } from '../../../../services/userService';
import { SearchBar } from '@/components/generic-searchbar';
import { ContractTable } from './_components/contract-table';
import { SouscripteurSelect } from '@/components/souscripteur-select';
import { ExportButton } from './_components/export-button';

export default async function Contract() {
    const [contracts, souscripteursData] = await Promise.all([
        getProjectContracts({}),
        getSubscribers()
    ]);

    return (
        <div className="space-y-6 p-8">
            <h1 className="text-2xl font-bold">Contrats</h1>

            <div className="flex justify-between items-center">
                <div className='flex gap-4 w-1/2'>
                    <div className="w-1/2">
                        <SearchBar
                            placeholder="Chercher un contrat"
                            apiEndpoint="/api/contracts"
                            resultPath="/assure"
                        />
                    </div>
                    <div className="w-1/2">
                        <SouscripteurSelect souscripteursData={souscripteursData} />
                    </div>
                </div>

                <ExportButton />
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
                <ContractTable
                    initialData={contracts.data as any[]}
                    initialMeta={contracts.meta as any}
                />
            </Suspense>
        </div>
    );
}