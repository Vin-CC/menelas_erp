'use server'

import { prisma } from '@/server/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

type GetPartnersParams = {
    search?: string;
    last_seen_id?: string;
    limit?: string;
};

export async function getPartners({ search, last_seen_id, limit = '10' }: GetPartnersParams) {
    const parsedLimit = parseInt(limit, 10);

    let where: Prisma.PartnerWhereInput = {};
    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }
    if (last_seen_id) {
        where.id = { gt: last_seen_id };
    }

    try {
        const [partners, total] = await Promise.all([
            prisma.partner.findMany({
                where,
                take: parsedLimit + 1,
                orderBy: { id: 'asc' },
                include: {
                    project_contracts: true,
                },
            }),
            prisma.partner.count({ where }),
        ]);

        const hasNextPage = partners.length > parsedLimit;
        const data = hasNextPage ? partners.slice(0, -1) : partners;
        const lastId = data[data.length - 1]?.id;

        const currentPage = last_seen_id ? Math.floor(parseInt(last_seen_id) / parsedLimit) + 1 : 1;
        const maxPage = Math.ceil(total / parsedLimit);

        revalidatePath('/partenaires')

        return {
            data,
            meta: {
                limit: parsedLimit,
                last_seen_id: lastId,
                next_page: hasNextPage ? `/api/partners?limit=${parsedLimit}&last_seen_id=${lastId}${search ? `&search=${encodeURIComponent(search)}` : ''}` : null,
                prev_page: currentPage > 1 ? `/api/partners?limit=${parsedLimit}&last_seen_id=${Math.max(0, (currentPage - 2) * parsedLimit)}${search ? `&search=${encodeURIComponent(search)}` : ''}` : null,
                current_page: currentPage,
                max_page: maxPage,
                total,
            },
        };
    } catch (error) {
        console.error('Error fetching partners:', error);
        throw new Error('Failed to fetch partners');
    }
}