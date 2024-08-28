'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ProjectContractState } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { FileText, Pencil } from "lucide-react"
import Link from "next/link"
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from "next/navigation"

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
    updated_at: string;
    state: ProjectContractState;
    to_be_recontacted_on: string | null;
    notes: string | null;
    manager: {
        id: string;
    };
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


export const ProjectTableContent = ({
    data,
    handleStateChange
}: {
    data: ProjectWithRelations[],
    handleStateChange: (projectId: string, newState: ProjectContractState) => Promise<void>
}) => {

    const router = useRouter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Interlocuteur</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Etat</TableHead>
                    <TableHead>Date de dernière action</TableHead>
                    <TableHead>A recontacter le</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>...</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((project) => (
                    <TableRow
                        key={project.id}
                        onClick={() => {
                            router.push(`/assure/${project.policyholder.id}/projets/${project.id}`);
                        }}
                        className="cursor-pointer hover:bg-gray-100"
                    >
                        <TableCell>
                            <Link href={`/user/${project.manager.id}/projets/${project.id}`}>
                                {project.id}
                            </Link>
                        </TableCell>
                        <TableCell>{`${project.policyholder.last_name} ${project.policyholder.first_name}`}</TableCell>
                        <TableCell>{project.product.name}</TableCell>
                        <TableCell>
                            <Select defaultValue={project.state} onValueChange={(value) => handleStateChange(project.id, value as ProjectContractState)}>
                                <SelectTrigger>
                                    <SelectValue>{stateLabels[project.state]}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(stateLabels).map(([state, label]) => (
                                        <SelectItem key={state} value={state}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>{format(new Date(project.updated_at), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                        <TableCell>{project.to_be_recontacted_on ? format(new Date(project.to_be_recontacted_on), 'dd/MM/yyyy', { locale: fr }) : ''}</TableCell>
                        <TableCell>
                            {project.notes && <FileText className="h-4 w-4" />}
                        </TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}