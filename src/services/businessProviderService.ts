'use server'

import { prisma } from '@/server/db';
import { revalidateTag } from 'next/cache';
import { Prisma } from '@prisma/client';

type GetBusinessProvidersParams = {
    search?: string;
    last_seen_id?: string;
    limit?: string;
};

export async function getBusinessProviders({ search, last_seen_id, limit = '10' }: GetBusinessProvidersParams) {
    const parsedLimit = parseInt(limit, 10);

    let where: Prisma.BusinessProviderWhereInput = {};
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
        const [businessProviders, total] = await Promise.all([
            prisma.businessProvider.findMany({
                where,
                take: parsedLimit + 1,
                orderBy: { id: 'asc' },
                include: {
                    business_manager: true,
                    project_contracts: true,
                },
            }),
            prisma.businessProvider.count({ where }),
        ]);

        const hasNextPage = businessProviders.length > parsedLimit;
        const data = hasNextPage ? businessProviders.slice(0, -1) : businessProviders;
        const lastId = data[data.length - 1]?.id;

        const currentPage = last_seen_id ? Math.floor(parseInt(last_seen_id) / parsedLimit) + 1 : 1;
        const maxPage = Math.ceil(total / parsedLimit);

        revalidateTag('businessproviders');
        return {
            data,
            meta: {
                limit: parsedLimit,
                last_seen_id: lastId,
                next_page: hasNextPage ? `/api/businessprovider?limit=${parsedLimit}&last_seen_id=${lastId}${search ? `&search=${encodeURIComponent(search)}` : ''}` : null,
                prev_page: currentPage > 1 ? `/api/businessprovider?limit=${parsedLimit}&last_seen_id=${Math.max(0, (currentPage - 2) * parsedLimit)}${search ? `&search=${encodeURIComponent(search)}` : ''}` : null,
                current_page: currentPage,
                max_page: maxPage,
                total,
            },
        };
    } catch (error) {
        console.error('Error fetching business providers:', error);
        throw new Error('Failed to fetch business providers');
    }
}