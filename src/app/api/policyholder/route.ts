import { NextRequest, NextResponse } from 'next/server';
import { getPolicyholders } from '../../../../services/policyholder/read';
import { currentUser } from "@/lib/user-auth";
import { auth } from '@/server/auth';
import { NextApiRequest } from 'next';

export async function GET(request: NextApiRequest) {
    const session = await auth();
    console.log("GET session:", session);
    // auth(request, res)
    // console.log("req.auth", request.auth);

    // const user = await currentUser()

    // if (!user) {
    //     return new Response("You must be logged in", {
    //         status: 401,
    //         headers: {
    //             "content-type": "application/json",
    //         },
    //     });
    // }

    // const searchParams = request.nextUrl.searchParams;
    const searchParams = request.url;
    console.log("searchParams", searchParams);

    // const search = searchParams.get('search') || undefined;
    // const last_seen_id = searchParams.get('last_seen_id') || undefined;
    // const limit = searchParams.get('limit') || undefined;

    try {
        // const result = await getPolicyholders({ search, last_seen_id, limit });
        // return NextResponse.json(result);
        return NextResponse.json({});
    } catch (error) {
        console.error('Error fetching policyholders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}