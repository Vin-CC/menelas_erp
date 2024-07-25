import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Policyholder, User, BusinessProvider } from '@prisma/client';

type PolicyholderWithRelations = Policyholder & {
    business_manager: User;
    business_provider: BusinessProvider | null;
};

type PolicyholderTableProps = {
    data: PolicyholderWithRelations[];
    meta: {
        limit: number;
        last_seen_id: string;
        next_page: string | null;
        prev_page: string | null;
        current_page: number;
        max_page: number;
        total: number;
    };
};

export default function PolicyholderTable({ data, meta }: PolicyholderTableProps) {
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
                    {data.map((policyholder) => (
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
                                {policyholder.notes && <FileText className="w-4 h-4" />}
                            </TableCell>
                            <TableCell>
                                <MoreHorizontal className="w-4 h-4" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                    <select className="border rounded p-2">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    <Button variant="outline" disabled={!meta.prev_page}>
                        <Link href={meta.prev_page || '#'} className="flex items-center">
                            <ChevronLeft className="mr-2" /> Précédente
                        </Link>
                    </Button>
                    <div className="flex space-x-2">
                        {[...Array(meta.max_page)].map((_, i) => (
                            <Button
                                key={i}
                                variant={meta.current_page === i + 1 ? "default" : "outline"}
                            >
                                <Link href={`/api/policyholder?limit=${meta.limit}&last_seen_id=${i * meta.limit}`}>
                                    {i + 1}
                                </Link>
                            </Button>
                        ))}
                    </div>
                    <Button variant="outline" disabled={!meta.next_page}>
                        <Link href={meta.next_page || '#'} className="flex items-center">
                            Suivante <ChevronRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}