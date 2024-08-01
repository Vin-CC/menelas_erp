// app/Project/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProjectSearchBar from './_components/project_search-bar';
import { ProjectTableWrapper } from "./_components/project-table-wrapper"
import { ProjectContractState } from "@prisma/client"

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
    { id: 'clz1fjyum0000xiz1cn3xjjd4', last_name: 'Doe', first_name: 'John' },
    { id: '2', last_name: 'Smith', first_name: 'Jane' },
    { id: '3', last_name: 'Brown', first_name: 'Bob' },
    { id: '4', last_name: 'Johnson', first_name: 'Alice' },
];

export default async function Project() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/projects`, { next: { tags: ['projects'] } });
    const projects: ProjectResponse = await response.json();

    console.log(projects);
    console.log(souscripteursData);
    console.log("initialData", projects.data);
    console.log("initialMeta", projects.meta);

    return (
        <div className="space-y-4 p-8">
            <h1 className="text-2xl font-bold">Projets</h1>

            <div className="flex justify-between items-center">
                <div className='flex w-1/2 justify-between'>
                    <ProjectSearchBar />
                </div>

                <div>
                    <Button variant="outline" className="mr-2">
                        Exporter projets
                    </Button>
                    <Button asChild>
                        <Link href="/projet/nouveau">Ajouter projet</Link>
                    </Button>
                </div>
            </div>

            <Suspense fallback={<div>Chargement...</div>}>
                <ProjectTableWrapper
                    initialData={projects.data}
                    initialMeta={projects.meta}
                    souscripteursData={souscripteursData}
                />
            </Suspense>
        </div>
    );
}