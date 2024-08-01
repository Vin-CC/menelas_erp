'use server'

import { prisma } from '@/server/db';
import { revalidateTag } from 'next/cache';

export async function getPolicyholders(params: {
    search?: string;
    last_seen_id?: string;
    limit?: string;
}) {
    const limit = parseInt(params.limit || '10', 10);
    const last_seen_id = params.last_seen_id;
    const search = params.search;

    let where: any = {};
    if (search) {
        where.OR = [
            { company_name: { contains: search, mode: 'insensitive' } },
            { last_name: { contains: search, mode: 'insensitive' } },
            { first_name: { contains: search, mode: 'insensitive' } },
        ];
    }
    if (last_seen_id) {
        where.id = { gt: last_seen_id };
    }

    const [policyholders, total] = await Promise.all([
        prisma.policyholder.findMany({
            where,
            take: limit + 1,
            orderBy: { id: 'asc' },
            include: {
                business_manager: true,
                business_provider: true,
            },
        }),
        prisma.policyholder.count({ where }),
    ]);

    const hasNextPage = policyholders.length > limit;
    const data = hasNextPage ? policyholders.slice(0, -1) : policyholders;
    const lastId = data[data.length - 1]?.id;

    const currentPage = last_seen_id ? Math.floor(parseInt(last_seen_id) / limit) + 1 : 1;
    const maxPage = Math.ceil(total / limit);

    revalidateTag('policyholders');

    return {
        data,
        meta: {
            limit,
            last_seen_id: lastId,
            next_page: hasNextPage ? `/api/policyholder?limit=${limit}&last_seen_id=${lastId}${search ? `&search=${search}` : ''}` : null,
            prev_page: currentPage > 1 ? `/api/policyholder?limit=${limit}&last_seen_id=${Math.max(0, parseInt(last_seen_id || '0') - limit)}${search ? `&search=${search}` : ''}` : null,
            current_page: currentPage,
            max_page: maxPage,
            total,
        },
    };
}