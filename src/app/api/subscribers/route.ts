import { NextRequest, NextResponse } from 'next/server';
import { getSubscribers } from '../../../services/userService';
import { currentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const user = await currentUser()

    if (!user) {
        return NextResponse.json(
            { error: "You must be logged in" },
            { status: 401 }
        );
    }

    try {
        const subscribers = await getSubscribers();
        return NextResponse.json(subscribers);
    } catch (error) {
        console.error('Erreur lors de la récupération des souscripteurs:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}