'use client'
import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ContractTableContent } from "./contract-table-content"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from 'next/navigation'
import { ContractState, ProjectContractState } from "@prisma/client"


type ContractWithRelations = {
    id: string;
    contract_number: string;
    policyholder: {
        id: string;
        last_name: string;
        first_name: string;
    };
    product: {
        name: string;
    };
    state: ProjectContractState;
    contract_state: ContractState;
    updated_at: string;
    to_be_recontacted_on: string | null;
    notes: string | null;
    due_date: number | null;
};

type ContractMeta = {
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

type ContractTableProps = {
    initialData: ContractWithRelations[];
    initialMeta: ContractMeta;
};

const stateLabels: Record<ContractState | 'ALL', string> = {
    ALL: 'TOUS',
    IN_PROGRESS: 'En cours',
    IN_COLLECTION: 'En recouvrement',
    SUSPENDED: 'Suspendu',
    TERMINATED: 'Résilié',
};

export const ContractTable = ({ initialData, initialMeta }: ContractTableProps) => {
    const [data, setData] = useState<ContractWithRelations[]>(initialData);
    const [meta, setMeta] = useState<ContractMeta>(initialMeta);
    const [selectedState, setSelectedState] = useState<string>('TOUS');
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const selectedSubscriber = searchParams.get('subscriber')

    const fetchContracts = useCallback(async (state: string = 'TOUS', last_seen_id: string | null = null, perPage: number | null = null) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const subscriberParam = selectedSubscriber ? `&manager_id=${selectedSubscriber}` : '';
        const lastSeenParam = last_seen_id !== null ? `&last_seen_id=${last_seen_id}` : '';
        const perPageParam = perPage ? `&per_page=${perPage}` : '';
        const stateParam = state !== 'TOUS' ? `&state=${state}` : '';

        try {
            const response = await fetch(
                `${baseUrl}/api/contracts?${stateParam}${subscriberParam}${lastSeenParam}${perPageParam}`,
                { next: { tags: ['contracts'] }, }
            );
            const allContractsData = await response.json();

            setData(allContractsData.data);
            setMeta(allContractsData.meta);

            return { data: allContractsData.data, meta: allContractsData.meta };
        } catch (error) {
            console.error('Erreur lors de la récupération des contrats:', error);
            toast({
                title: "Erreur",
                description: "Impossible de récupérer les contrats. Veuillez réessayer.",
                variant: "destructive",
            });
        }
    }, [selectedSubscriber, toast]);

    useEffect(() => {
        fetchContracts(selectedState);
    }, [selectedState, selectedSubscriber, fetchContracts]);

    const handlePageChange = (page: number) => {
        const last_seen_id = ((page - 1) * (meta?.limit || 10)).toString();
        fetchContracts(selectedState, last_seen_id);
    };

    const handleStateTabChange = async (value: string) => {
        setSelectedState(value);
        await fetchContracts(value);
    };

    const handlePerPageChange = (perPage: number) => {
        fetchContracts(selectedState, null, perPage);
    };

    return (
        <div className="space-y-4">
            <Tabs defaultValue="ALL" onValueChange={(value) => handleStateTabChange(value as ContractState | 'ALL')}>
                <TabsList className="flex flex-wrap justify-start gap-2">
                    {Object.entries(stateLabels).map(([state, label]) => (
                        <TabsTrigger key={state} value={state}>
                            {label} <span className="ml-2 px-2 py-1 bg-secondary rounded-full text-xs">
                                {state === 'ALL' ? meta?.total || 0 : meta?.totalByState?.[state] || 0}
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>
                {Object.keys(stateLabels).map((state) => (
                    <TabsContent key={state} value={state}>
                        <ContractTableContent
                            data={data}
                        />
                    </TabsContent>
                ))}
            </Tabs>
            {meta?.total > meta?.limit && (
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
                            {[...Array(Math.min(5, meta.max_page || 1))].map((_, i) => (
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
            )}
        </div>
    );
}