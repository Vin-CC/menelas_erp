'use client'
import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProjectContractState } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"
import { ProjectTableContent } from "./project-table-content"
import { updateProjectState } from '@/actions/project/update'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from 'next/navigation'

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

const ALL_SUBSCRIBERS = 'ALL_SUBSCRIBERS';

export const ProjectTable = ({ initialData, initialMeta }: ProjectTableProps) => {
    const [data, setData] = useState<ProjectWithRelations[]>(initialData);
    const [meta, setMeta] = useState<ProjectMeta>(initialMeta);
    const [selectedState, setSelectedState] = useState<ProjectContractState | 'ALL'>('ALL');
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const selectedSubscriber = searchParams.get('subscriber') || ALL_SUBSCRIBERS

    const fetchProjects = useCallback(async (state: ProjectContractState | 'ALL' = 'ALL', last_seen_id: string | null = null, perPage: number | null = null) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const stateParam = state !== 'ALL' ? `&state=${state}` : '';
        const subscriberParam = selectedSubscriber !== ALL_SUBSCRIBERS ? `&manager_id=${selectedSubscriber}` : '';
        const lastSeenParam = last_seen_id !== null ? `&last_seen_id=${last_seen_id}` : '';
        const perPageParam = perPage ? `&per_page=${perPage}` : '';
        const response = await fetch(
            `${baseUrl}/api/projects?${stateParam}${subscriberParam}${lastSeenParam}${perPageParam}`,
            { next: { tags: ['projects'] }, }
        );
        const newData = await response.json();
        setData(newData.data);
        // Ne mettez à jour que les données spécifiques à l'état actuel
        setMeta(prevMeta => ({
            ...prevMeta,
            total: state === 'ALL' ? newData.meta.total : prevMeta.total,
            totalByState: {
                ...prevMeta.totalByState,
                [state]: newData.meta.total
            },
            limit: newData.meta.limit,
            last_seen_id: newData.meta.last_seen_id,
            next_page: newData.meta.next_page,
            prev_page: newData.meta.prev_page,
            current_page: newData.meta.current_page,
            max_page: newData.meta.max_page,
        }));
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
                            [oldState]: prevMeta.totalByState[oldState] - 1,
                            [newState]: prevMeta.totalByState[newState] + 1
                        }
                    }
                }
                return prevMeta;
            });
            // Rafraîchir les données pour l'onglet actuel
            await fetchProjects(selectedState)
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

    const handleStateTabChange = (value: string) => {
        setSelectedState(value as ProjectContractState | 'ALL');
        fetchProjects(value as ProjectContractState | 'ALL');
    };

    return (
        <div className="space-y-4">
            <Tabs defaultValue="ALL" onValueChange={handleStateTabChange}>
                <TabsList className="flex justify-start space-x-2 overflow-x-auto">
                    <TabsTrigger key="ALL" value="ALL">
                        Tous <span className="ml-2 px-2 py-1 bg-secondary rounded-full text-xs">{meta.total}</span>
                    </TabsTrigger>
                    {Object.entries(stateLabels).map(([state, label]) => (
                        <TabsTrigger key={state} value={state}>
                            {label} <span className="ml-2 px-2 py-1 bg-secondary rounded-full text-xs">{meta.totalByState[state as ProjectContractState] || 0}</span>
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