'use server'

import { prisma } from '@/server/db';
import { revalidateTag } from 'next/cache';
import { Prisma } from '@prisma/client';

type GetPolicyholdersParams = {
    search?: string;
    last_seen_id?: string;
    limit?: string;
};

export async function getPolicyholders({ search, last_seen_id, limit = '10' }: GetPolicyholdersParams) {
    const parsedLimit = parseInt(limit, 10);

    let where: Prisma.PolicyholderWhereInput = {};
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

    try {
        const [policyholders, total] = await Promise.all([
            prisma.policyholder.findMany({
                where,
                take: parsedLimit + 1,
                orderBy: { id: 'asc' },
                include: {
                    business_manager: true,
                    business_provider: true,
                },
            }),
            prisma.policyholder.count({ where }),
        ]);

        const hasNextPage = policyholders.length > parsedLimit;
        const data = hasNextPage ? policyholders.slice(0, -1) : policyholders;
        const lastId = data[data.length - 1]?.id;

        const currentPage = last_seen_id ? Math.floor(parseInt(last_seen_id) / parsedLimit) + 1 : 1;
        const maxPage = Math.ceil(total / parsedLimit);

        revalidateTag('policyholders');

        return {
            data,
            meta: {
                limit: parsedLimit,
                last_seen_id: lastId,
                next_page: hasNextPage ? `/api/policyholder?limit=${parsedLimit}&last_seen_id=${lastId}${search ? `&search=${encodeURIComponent(search)}` : ''}` : null,
                prev_page: currentPage > 1 ? `/api/policyholder?limit=${parsedLimit}&last_seen_id=${Math.max(0, (currentPage - 2) * parsedLimit)}${search ? `&search=${encodeURIComponent(search)}` : ''}` : null,
                current_page: currentPage,
                max_page: maxPage,
                total,
            },
        };
    } catch (error) {
        console.error('Error fetching policyholders:', error);
        throw new Error('Failed to fetch policyholders');
    }
}