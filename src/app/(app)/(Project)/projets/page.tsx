import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProjectSearchBar from './_components/project-search-bar';
import { ProjectTable } from './_components/project-table';
import { ProjectContractState } from "@prisma/client"
import { SouscripteurSelect } from './_components/souscripteur-select';
import { ExportButton } from './_components/export-button';

interface ProjectResponse {
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
        totalByState: Record<ProjectContractState, number>;
    };
}


const souscripteursData = [
    { id: 'clz9sspol0001p3hxt673m2va', last_name: 'Coulibaly', first_name: 'Omar Almoctar' },
    { id: 'clzcpmf9a0000d0x4vnpaxe0z', last_name: 'Cance', first_name: 'Vincent' },
    { id: '3', last_name: 'Brown', first_name: 'Bob' },
    { id: '4', last_name: 'Johnson', first_name: 'Alice' },
];

export default async function Project() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/projects`, { next: { tags: ['projects'] } });
    const projects: ProjectResponse = await response.json();

    return (
        <div className="space-y-6 p-8">
            <h1 className="text-2xl font-bold">Projets</h1>

            <div className="flex justify-between items-center">
                <div className='flex gap-4 w-1/2'>
                    <div className="w-1/2">
                        <ProjectSearchBar />
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
                    initialData={projects.data}
                    initialMeta={projects.meta}
                />
            </Suspense>
        </div>
    );
}