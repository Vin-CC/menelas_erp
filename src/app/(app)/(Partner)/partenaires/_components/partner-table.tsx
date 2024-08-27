"use client"
import React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Pencil } from 'lucide-react';
import { Partner, PartnerType, PaymentType } from '@prisma/client';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Pagination, PaginationMeta } from '@/components/ui/pagination';

type PartnerWithRelations = Partner & {
    products: { id: string }[];
    project_contracts: { id: string }[];
};

type PartnerTableProps = {
    data: PartnerWithRelations[];
    meta: PaginationMeta;
};

const typeLabels: Record<PartnerType, string> = {
    INSURER: 'Assureur',
    WHOLESALER: 'Grossiste',
    AGENCY: 'Agence',
};

const paymentTypeLabels: Record<PaymentType, string> = {
    ENTRUSTED: 'Confié',
    NOT_ENTRUSTED: 'Non Confié',
};

export function PartnerTable({ data, meta }: PartnerTableProps) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>{`Type d'encaissement`}</TableHead>
                        <TableHead>Contrats rattachés</TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((partner, index) => (
                        <TableRow key={partner.id}>
                            <TableCell>{meta.current_page * meta.limit - meta.limit + index + 1}</TableCell>
                            <TableCell className='font-bold'>{partner.name}</TableCell>
                            <TableCell>{typeLabels[partner.type]}</TableCell>
                            <TableCell>
                                {partner.notes && <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <FileText className="w-4 h-4" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{partner.notes}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>}
                            </TableCell>
                            <TableCell>{paymentTypeLabels[partner.payment_type]}</TableCell>
                            <TableCell>{partner.project_contracts.length}</TableCell>
                            <TableCell>
                                <Link href={`/partenaires/${partner.id}/edit`}>
                                    <Pencil className="w-4 h-4" />
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination meta={meta} basePath="/partenaires" />
        </div>
    );
}