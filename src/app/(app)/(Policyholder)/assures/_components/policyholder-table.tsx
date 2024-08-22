import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, MoreHorizontal } from 'lucide-react';
import { Policyholder, User, BusinessProvider } from '@prisma/client';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Pagination, PaginationMeta } from '@/components/ui/pagination';

type PolicyholderWithRelations = Policyholder & {
    business_manager: User;
    business_provider: BusinessProvider | null;
};

type PolicyholderTableProps = {
    data: PolicyholderWithRelations[];
    meta: PaginationMeta;
};

export function PolicyholderTable({ data, meta }: PolicyholderTableProps) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>{`Chargé d'affaire`}</TableHead>
                        <TableHead>{`Apporteur d'affaire`}</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((policyholder) => (
                        <TableRow key={policyholder.id}>
                            <TableCell>{policyholder.id}</TableCell>
                            <TableCell>{`${policyholder.last_name} ${policyholder.first_name}`}</TableCell>
                            <TableCell>
                                <Link href={`/charge-affaire/${policyholder.business_manager.id}`} className="text-black underline font-bold">
                                    {`${policyholder.business_manager.last_name} ${policyholder.business_manager.first_name}`}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {policyholder.business_provider && (
                                    <Link href={`/apporteur-affaire/${policyholder.business_provider.id}`} className="text-black underline font-bold">
                                        {`${policyholder.business_provider.last_name} ${policyholder.business_provider.first_name}`}
                                    </Link>
                                )}
                            </TableCell>
                            <TableCell>
                                {policyholder.notes && <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <FileText className="w-4 h-4" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{policyholder.notes}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>}
                            </TableCell>
                            <TableCell>
                                <MoreHorizontal className="w-4 h-4" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination meta={meta} basePath="/assure" />
        </div>
    );
}