// app/Project/_components/project-table-wrapper.tsx
'use client'
import { useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ProjectTable } from "./project-table"
import { ProjectContractState } from "@prisma/client"

type ProjectWithRelations = {
    id: string;
    policyholder: {
        last_name: string;
        first_name: string;
    };
    product: {
        name: string;
    };
    state: ProjectContractState;
    last_action_date: string;
    to_be_recontacted_on: string | null;
    notes: string | null;
    manager: {
        id: string;
    };
};

type ProjectMeta = {
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

type ProjectTableWrapperProps = {
    initialData: ProjectWithRelations[];
    initialMeta: ProjectMeta;
    souscripteursData: { id: string; last_name: string; first_name: string; }[];
}

export const ProjectTableWrapper = ({ initialData, initialMeta, souscripteursData }: ProjectTableWrapperProps) => {

    const [selectedSubscriber, setSelectedSubscriber] = useState<string>('ALL');

    console.log(souscripteursData);

    return (
        <div>
            <div className='w-content mb-4'>
                <Select onValueChange={(value) => setSelectedSubscriber(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un souscripteur" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous</SelectItem>
                        {souscripteursData.map((souscripteur) => (
                            <SelectItem key={souscripteur.id} value={souscripteur.id}>
                                {souscripteur.last_name} {souscripteur.first_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <ProjectTable
                initialData={initialData}
                initialMeta={initialMeta}
                selectedSubscriber={selectedSubscriber}
            />
        </div>
    )
}