import { NextRequest, NextResponse } from 'next/server';
import { getProjectContracts } from '../../../services/projectContractService';
import { revalidateTag } from 'next/cache';
import { currentUser } from "@/lib/auth";
import { ContractState } from '@prisma/client';

export async function GET(request: NextRequest) {
    const user = await currentUser()

    if (!user) {
        return NextResponse.json(
            { error: "You must be logged in" },
            { status: 401 }
        );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    const last_seen_id = searchParams.get('last_seen_id') || undefined;
    const limit = searchParams.get('limit') || undefined;
    const stateParam = searchParams.get('state');
    const contract_state = stateParam ? (ContractState[stateParam as keyof typeof ContractState] || undefined) : undefined;
    const manager_id = searchParams.get('manager_id') || undefined;

    if (stateParam && !contract_state) {
        return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
    }

    try {
        const result = await getProjectContracts({
            search,
            last_seen_id,
            limit,
            contract_state,
            manager_id,
        });

        revalidateTag('contracts');
        return NextResponse.json(result);
    } catch (error) {
        console.error('Erreur lors de la récupération des contrats:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}