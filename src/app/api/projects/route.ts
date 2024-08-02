import { NextRequest, NextResponse } from 'next/server';
import { getProjectContracts } from '../../../services/project/read';
import { ProjectContractState } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { currentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const user = await currentUser()

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
    const last_seen_id = searchParams.get('last_seen_id') || undefined;
    const limit = searchParams.get('limit') || undefined;
    const state = searchParams.get('state') as ProjectContractState | undefined;
    const manager_id = searchParams.get('manager_id') || undefined;

    if (state && !Object.values(ProjectContractState).includes(state)) {
        return NextResponse.json({ error: 'État de projet invalide' }, { status: 400 });
    }

    try {
        const result = await getProjectContracts({
            search,
            last_seen_id,
            limit,
            state,
            manager_id,
        });

        revalidateTag('projects');
        return NextResponse.json(result);
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}