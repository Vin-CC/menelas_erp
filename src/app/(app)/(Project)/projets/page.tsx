import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/generic-searchbar';
import { ProjectTable } from './_components/project-table';
import { SouscripteurSelect } from '@/components/souscripteur-select';
import { ExportButton } from './_components/export-button';
import { getProjectContracts } from '../../../../services/projectService';
import { getSubscribers } from '../../../../services/userService';

export default async function Project() {
    const [projects, souscripteursData] = await Promise.all([
        getProjectContracts({}),
        getSubscribers()
    ]);

    return (
        <div className="space-y-6 p-8">
            <h1 className="text-2xl font-bold">Projets</h1>

            <div className="flex justify-between items-center">
                <div className='flex gap-4 w-1/2'>
                    <div className="w-1/2">
                        <SearchBar
                            placeholder="Chercher un projet"
                            apiEndpoint="/api/projects"
                            resultPath="/user/:userId/projets" // id à mettre ici
                        />
                    </div>
                    <div className="w-1/2">
                        <SouscripteurSelect souscripteursData={souscripteursData} />
                    </div>
                </div>

                <div className="flex space-x-2">
                    <ExportButton />
                    <Button asChild>
                        <Link href="/projet/nouveau">Ajouter projet</Link>
                    </Button>
                </div>
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
                <ProjectTable
                    initialData={projects.data as any[]}
                    initialMeta={projects.meta as any}
                />
            </Suspense>
        </div>
    );
}