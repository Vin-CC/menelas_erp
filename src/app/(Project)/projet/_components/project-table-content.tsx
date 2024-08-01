'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ProjectContractState } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { FileText, Pencil } from "lucide-react"
import Link from "next/link"

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
                    <TableRow key={project.id}>
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
                        <TableCell>{project.last_action_date}</TableCell>
                        <TableCell>{project.to_be_recontacted_on}</TableCell>
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