'use server'

import { prisma } from '@/server/db';
import { Prisma, ContractState } from '@prisma/client';
import { revalidateTag } from 'next/cache';

type QueryParams = {
    search?: string;
    last_seen_id?: string;
    limit?: string;
    contract_state?: ContractState;
    manager_id?: string;
};

export async function getProjectContracts(params: QueryParams) {
    const limit = parseInt(params.limit || '10', 10);
    const where: Prisma.ProjectContractWhereInput = {};

    if (params.search) {
        where.OR = [
            { product: { name: { contains: params.search, mode: 'insensitive' } } },
            {
                policyholder: {
                    OR: [
                        { last_name: { contains: params.search, mode: 'insensitive' } },
                        { first_name: { contains: params.search, mode: 'insensitive' } },
                        { company_name: { contains: params.search, mode: 'insensitive' } }
                    ]
                }
            },
        ];
    }
    if (params.contract_state) where.contract_state = params.contract_state;
    if (params.manager_id) where.manager_id = params.manager_id;
    if (params.last_seen_id) where.id = { gt: params.last_seen_id };

    const [projectContracts, total, totalByState] = await Promise.all([
        prisma.projectContract.findMany({
            where,
            take: limit,
            orderBy: { id: 'asc' },
            include: {
                policyholder: true,
                product: true,
                manager: true,
            },
        }),
        prisma.projectContract.count({ where }),
        prisma.projectContract.groupBy({
            by: ['contract_state'],
            _count: true,
            where,
        })
    ]);

    const lastId = projectContracts[projectContracts.length - 1]?.id;
    const hasNextPage = total > limit;

    const totalByStateFormatted = Object.fromEntries(
        totalByState.map(({ contract_state, _count }) => [contract_state, _count])
    );

    revalidateTag('contracts');

    return {
        data: projectContracts,
        meta: {
            limit,
            last_seen_id: lastId,
            next_page: hasNextPage ? `/api/contracts?limit=${limit}&last_seen_id=${lastId}${params.search ? `&search=${params.search}` : ''}${params.contract_state ? `&state=${params.contract_state}` : ''}${params.manager_id ? `&manager_id=${params.manager_id}` : ''}` : null,
            prev_page: params.last_seen_id ? `/api/contracts?limit=${limit}&last_seen_id=${params.last_seen_id}${params.search ? `&search=${params.search}` : ''}${params.contract_state ? `&state=${params.contract_state}` : ''}${params.manager_id ? `&manager_id=${params.manager_id}` : ''}` : null,
            current_page: params.last_seen_id ? Math.floor(parseInt(params.last_seen_id) / limit) + 1 : 1,
            max_page: Math.ceil(total / limit),
            total,
            totalByState: totalByStateFormatted,
        },
    };
}