import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProjectSearchBar from './_components/project-search-bar';
import { ProjectTable } from './_components/project-table';
import { ProjectContractState } from "@prisma/client"
import { SouscripteurSelect } from './_components/souscripteur-select';
import { ExportButton } from './_components/export-button';
import { PaginationMeta } from '@/types/pagination';

interface ProjectResponse {
    data: any[];
    meta: PaginationMeta & {
        totalByState: Record<ProjectContractState, number>;
    };
}

interface SubscriberResponse {
    id: string;
    last_name: string;
    first_name: string;
}

async function getProjects(): Promise<ProjectResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${baseUrl}/api/projects`, { next: { tags: ['projects'] } });
    return res.json();
}

async function getSubscribers(): Promise<SubscriberResponse[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${baseUrl}/api/subscribers`, { next: { tags: ['subscribers'] } });
    return res.json();
}

export default async function Project() {
    const projectsData = getProjects();
    const subscribersData = getSubscribers();

    const [projects, souscripteursData] = await Promise.all([projectsData, subscribersData]);

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