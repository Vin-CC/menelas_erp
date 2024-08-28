import { NextRequest, NextResponse } from 'next/server';
import { getBusinessProviders } from '../../../services/businessProviderService';
import { currentUser } from "@/lib/auth";

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

    try {
        const result = await getBusinessProviders({ search, last_seen_id, limit });
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching business providers:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}