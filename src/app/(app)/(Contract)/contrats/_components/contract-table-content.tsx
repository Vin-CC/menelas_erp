'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Pencil } from "lucide-react"
import Link from "next/link"
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from "next/navigation"
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

const stateLabels: Record<ContractState, string> = {
    IN_PROGRESS: 'En cours',
    IN_COLLECTION: 'En recouvrement',
    SUSPENDED: 'Suspendu',
    TERMINATED: 'Résilié',
};

export const ContractTableContent = ({
    data
}: {
    data: ContractWithRelations[]
}) => {
    const router = useRouter();

    const handleRowClick = (policyholderId: string, contractId: string) => {
        router.push(`/assure/${policyholderId}/contrats/${contractId}`);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-24">Numéro</TableHead>
                    <TableHead>Interlocuteur</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Etat</TableHead>
                    <TableHead>Date de dernière action</TableHead>
                    <TableHead>A recontacter le</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((contract) => (
                    <TableRow
                        key={contract.id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleRowClick(contract.policyholder.id, contract.id)}
                    >
                        <TableCell className="w-24">{contract.contract_number}</TableCell>
                        <TableCell className="font-bold">{`${contract.policyholder.last_name} ${contract.policyholder.first_name}`}</TableCell>
                        <TableCell>{contract.product.name}</TableCell>
                        <TableCell>{stateLabels[contract.contract_state]}</TableCell>
                        <TableCell>{format(new Date(contract.updated_at), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                        <TableCell>{contract.to_be_recontacted_on ? format(new Date(contract.to_be_recontacted_on), 'dd/MM/yyyy', { locale: fr }) : '-'}</TableCell>
                        <TableCell>
                            {contract.notes && <FileText className="h-4 w-4" />}
                        </TableCell>
                        <TableCell>
                            <Pencil className="h-4 w-4" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}