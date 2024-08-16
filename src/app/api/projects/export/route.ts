import { NextRequest, NextResponse } from 'next/server';
import { getProjectContracts } from '../../../../services/project';
import { ProjectContractState } from '@prisma/client';
import { stringify } from 'csv-stringify/sync';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { currentUser } from "@/lib/auth";

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

export async function GET(request: NextRequest) {
    // const user = await currentUser();

    // if (!user) {
    //     return new Response("You must be logged in", {
    //         status: 401,
    //         headers: {
    //             "content-type": "application/json",
    //         },
    //     });
    // }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    const state = searchParams.get('state') as ProjectContractState | undefined;
    const manager_id = searchParams.get('manager_id') || undefined;

    if (state && !Object.values(ProjectContractState).includes(state)) {
        return NextResponse.json({ error: 'État de projet invalide' }, { status: 400 });
    }

    try {
        const result = await getProjectContracts({
            search,
            state,
            manager_id,
            limit: undefined,
            last_seen_id: undefined,
        });

        const csvData = result.data.map(project => ({
            ID: project.id,
            Interlocuteur: `${project.policyholder.last_name} ${project.policyholder.first_name}`,
            Produit: project.product.name,
            Etat: stateLabels[project.state],
            'Date de dernière action': format(new Date(project.updated_at), 'dd/MM/yyyy', { locale: fr }),
            'A recontacter le': project.to_be_recontacted_on ? format(new Date(project.to_be_recontacted_on), 'dd/MM/yyyy', { locale: fr }) : '',
            Notes: project.notes || ''
        }));


        const csv = stringify(csvData, { header: true });

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename=projets_export_${new Date().toISOString().split('T')[0]}.csv`
            }
        });

    } catch (error) {
        console.error('Erreur lors de l\'export des projets:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
