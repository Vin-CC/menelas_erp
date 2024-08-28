"use client"
import React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Pencil } from 'lucide-react';
import { BusinessProvider, User, ProjectContract } from '@prisma/client';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Pagination, PaginationMeta } from '@/components/ui/pagination';

type BusinessProviderWithRelations = BusinessProvider & {
    business_manager: User;
    project_contracts: ProjectContract[];
};

type BusinessProviderTableProps = {
    data: BusinessProviderWithRelations[];
    meta: PaginationMeta;
};

export function BusinessProviderTable({ data, meta }: BusinessProviderTableProps) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Identité</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>{`Chargé d'affaire`}</TableHead>
                        <TableHead>Contrats rattachés</TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((businessProvider, index) => (
                        <TableRow key={businessProvider.id}>
                            <TableCell>{meta.current_page * meta.limit - meta.limit + index + 1}</TableCell>
                            <TableCell>
                                <div className='font-bold'>{`${businessProvider.last_name} ${businessProvider.first_name}`}</div>
                                <div className="text-sm text-gray-500">{businessProvider.company_name}</div>
                            </TableCell>
                            <TableCell>{businessProvider.phone}</TableCell>
                            <TableCell>
                                {businessProvider.notes && <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <FileText className="w-4 h-4" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{businessProvider.notes}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>}
                            </TableCell>
                            <TableCell>
                                <Link href={`/charge-affaire/${businessProvider.business_manager.id}`}>
                                    {`${businessProvider.business_manager.last_name} ${businessProvider.business_manager.first_name}`}
                                </Link>
                            </TableCell>
                            <TableCell>{businessProvider.project_contracts?.length || 0}</TableCell>
                            <TableCell>
                                <Link href={`/charges-affaire/${businessProvider.id}/edit`}>
                                    <Pencil className="w-4 h-4" />
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination meta={meta} basePath="/charges-affaire" />
        </div>
    );
}