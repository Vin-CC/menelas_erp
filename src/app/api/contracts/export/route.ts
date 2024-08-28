import { NextRequest, NextResponse } from 'next/server';
import { getProjectContracts } from '../../../../services/projectContractService';
import { ContractState } from '@prisma/client';
import { stringify } from 'csv-stringify/sync';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { currentUser } from "@/lib/auth";

const stateLabels: Record<ContractState, string> = {
    IN_PROGRESS: 'En cours',
    IN_COLLECTION: 'En recouvrement',
    SUSPENDED: 'Suspendu',
    TERMINATED: 'Résilié',
};

export async function GET(request: NextRequest) {
    const user = await currentUser();

    if (!user) {
        return new Response("You must be logged in", {
            status: 401,
            headers: {
                "content-type": "application/json",
            },
        });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    const stateParam = searchParams.get('state');
    const contract_state = stateParam ? (ContractState[stateParam as keyof typeof ContractState] || undefined) : undefined;
    const manager_id = searchParams.get('manager_id') || undefined;

    if (contract_state && !Object.values(ContractState).includes(contract_state)) {
        return NextResponse.json({ error: 'État de contrat invalide' }, { status: 400 });
    }

    try {
        const result = await getProjectContracts({
            search,
            manager_id,
            limit: undefined,
            last_seen_id: undefined,
            contract_state,
        });

        const csvData = result.data.map(contract => ({
            'Numéro de contrat': contract.contract_number,
            Interlocuteur: `${contract.policyholder.last_name} ${contract.policyholder.first_name}`,
            Produit: contract.product.name,
            Etat: contract.contract_state ? stateLabels[contract.contract_state] : 'Non défini',
            'Date de dernière action': format(new Date(contract.updated_at), 'dd/MM/yyyy', { locale: fr }),
            'A recontacter le': contract.to_be_recontacted_on ? format(new Date(contract.to_be_recontacted_on), 'dd/MM/yyyy', { locale: fr }) : '',
            Notes: contract.notes || ''
        }));

        const csv = stringify(csvData, { header: true });

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename=contrats_export_${new Date().toISOString().split('T')[0]}.csv`
            }
        });

    } catch (error) {
        console.error('Erreur lors de l\'export des contrats:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}