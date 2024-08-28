'use client'
import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProjectContractState } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"
import { ProjectTableContent } from "./project-table-content"
import { updateProjectState } from '@/actions/project'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from 'next/navigation'
import { PaginationMeta } from '@/types/pagination';

type ProjectWithRelations = {
    id: string;
    policyholder: {
        id: string;
        last_name: string;
        first_name: string;
    };
    product: {
        name: string;
    };
    state: ProjectContractState;
    updated_at: string;
    to_be_recontacted_on: string | null;
    notes: string | null;
    manager: {
        id: string;
    };
};
type ProjectMeta = PaginationMeta & {
    totalByState: Record<ProjectContractState, number>;
};

type ProjectTableProps = {
    initialData: ProjectWithRelations[];
    initialMeta: ProjectMeta;
};
const stateLabels: Record<ProjectContractState, string> = {
    NEW: 'Nouveau',
    UNDER_STUDY: 'En étude',
    WAITING_FOR_CUSTOMER: 'En attente client',
    WAITING_FOR_COMPANY: 'En attente compagnie',
    QUOTATION_SENT: 'Devis envoyé',
    IN_SUBSCRIPTION: 'En souscription',
    NO_ACTION_TAKEN: 'Sans suite',
    LOST: 'Perdu',
    WON: 'Gagné',
};

export const ProjectTable = ({ initialData, initialMeta }: ProjectTableProps) => {
    const [data, setData] = useState<ProjectWithRelations[]>(initialData);
    const [meta, setMeta] = useState<ProjectMeta>(initialMeta);
    const [selectedState, setSelectedState] = useState<ProjectContractState | 'ALL'>('ALL');
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const selectedSubscriber = searchParams.get('subscriber')

    const fetchProjects = useCallback(async (state: ProjectContractState | 'ALL' = 'ALL', last_seen_id: string | null = null, perPage: number | null = null) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const subscriberParam = selectedSubscriber ? `&manager_id=${selectedSubscriber}` : '';
        const lastSeenParam = last_seen_id !== null ? `&last_seen_id=${last_seen_id}` : '';
        const perPageParam = perPage ? `&per_page=${perPage}` : '';

        const response = await fetch(
            `${baseUrl}/api/projects?${subscriberParam}${lastSeenParam}${perPageParam}`,
            { next: { tags: ['projects'] }, }
        );
        const allProjectsData = await response.json();

        // Calculer les totaux côté client
        const totalByState = allProjectsData.data.reduce((acc: Record<ProjectContractState, number>, project: ProjectWithRelations) => {
            acc[project.state] = (acc[project.state] || 0) + 1;
            return acc;
        }, {} as Record<ProjectContractState, number>);

        const total = allProjectsData.data.length;

        // Filtrer les données si un état spécifique est sélectionné
        const filteredData = state === 'ALL' ? allProjectsData.data : allProjectsData.data.filter((p: ProjectWithRelations) => p.state === state);

        setData(filteredData);
        setMeta(prevMeta => ({
            ...prevMeta,
            ...allProjectsData.meta,
            total,
            totalByState,
        }));

        return { data: filteredData, meta: { ...allProjectsData.meta, total, totalByState } };
    }, [selectedSubscriber]);

    useEffect(() => {
        fetchProjects(selectedState);
    }, [selectedState, selectedSubscriber, fetchProjects]);

    const handleStateChange = async (projectId: string, newState: ProjectContractState) => {
        const result = await updateProjectState(projectId, newState)
        if (result.success) {
            toast({
                title: "État mis à jour",
                description: result.message,
            })

            // Mettre à jour les totaux localement
            setMeta(prevMeta => {
                const oldState = data.find(p => p.id === projectId)?.state;
                if (oldState) {
                    return {
                        ...prevMeta,
                        totalByState: {
                            ...prevMeta.totalByState,
                            [oldState]: (prevMeta.totalByState[oldState] || 0) - 1,
                            [newState]: (prevMeta.totalByState[newState] || 0) + 1
                        }
                    }
                }
                return prevMeta;
            });

            // Rafraîchir les données
            await fetchProjects(selectedState);
        } else {
            toast({
                title: "Erreur",
                description: result.message,
                variant: "destructive",
            })
        }
    }
    const handlePerPageChange = (perPage: number) => {
        fetchProjects(selectedState, null, perPage);
    };

    const handlePageChange = (page: number) => {
        const last_seen_id = ((page - 1) * meta.limit).toString();
        fetchProjects(selectedState, last_seen_id);
    };

    const handleStateTabChange = async (value: string) => {
        setSelectedState(value as ProjectContractState | 'ALL');
        await fetchProjects(value as ProjectContractState | 'ALL');
    };

    return (
        <div className="space-y-4">
            <Tabs defaultValue="ALL" onValueChange={handleStateTabChange}>
                <TabsList className="flex justify-start space-x-2 overflow-x-auto">
                    <TabsTrigger key="ALL" value="ALL">
                        Tous <span className="ml-2 px-2 py-1 bg-secondary rounded-full text-xs">
                            {Object.values(meta.totalByState).reduce((a, b) => a + b, 0)}
                        </span>
                    </TabsTrigger>
                    {Object.entries(stateLabels).map(([state, label]) => (
                        <TabsTrigger key={state} value={state}>
                            {label} <span className="ml-2 px-2 py-1 bg-secondary rounded-full text-xs">
                                {meta.totalByState[state as ProjectContractState] || 0}
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value="ALL">
                    <ProjectTableContent
                        data={data}
                        handleStateChange={handleStateChange}
                    />
                </TabsContent>
                {Object.keys(stateLabels).map((state) => (
                    <TabsContent key={state} value={state}>
                        <ProjectTableContent
                            data={data}
                            handleStateChange={handleStateChange}
                        />
                    </TabsContent>
                ))}
            </Tabs>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                    <select
                        className="border rounded p-2"
                        value={meta.limit}
                        onChange={(e) => handlePerPageChange(Number(e.target.value))}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    <Button variant="outline" onClick={() => handlePageChange(meta.current_page - 1)} disabled={meta.current_page <= 1}>
                        <ChevronLeft className="mr-2" /> Précédente
                    </Button>
                    <div className="flex space-x-2">
                        {[...Array(Math.min(5, meta.max_page))].map((_, i) => (
                            <Button
                                key={i}
                                variant={meta.current_page === i + 1 ? "default" : "outline"}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                    <Button variant="outline" onClick={() => handlePageChange(meta.current_page + 1)} disabled={meta.current_page >= meta.max_page}>
                        Suivante <ChevronRight className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}