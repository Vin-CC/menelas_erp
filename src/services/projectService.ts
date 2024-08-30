'use server'

import { prisma } from '@/server/db';
import { ProjectContractState, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

type QueryParams = {
    search?: string;
    last_seen_id?: string;
    limit?: string;
    state?: ProjectContractState;
    manager_id?: string;
};

const buildWhereClause = (params: QueryParams) => {
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
    if (params.state) where.state = params.state;
    if (params.manager_id) where.manager_id = params.manager_id;
    if (params.last_seen_id) where.id = { gt: params.last_seen_id };
    return where;
};

const getTotalByState = async (where: any) => {
    const totalByState = await prisma.projectContract.groupBy({
        by: ['state'],
        _count: { _all: true },
        where: { ...where, id: undefined }
    });

    const totalByStateObject = Object.values(ProjectContractState).reduce((acc, state) => {
        acc[state] = 0;
        return acc;
    }, {} as Record<ProjectContractState, number>);

    totalByState.forEach(({ state, _count }) => {
        totalByStateObject[state] = _count._all;
    });

    return totalByStateObject;
};

export async function getProjectContracts(params: QueryParams) {
    const limit = parseInt(params.limit || '10', 10);
    if (params.state && !Object.values(ProjectContractState).includes(params.state)) {
        throw new Error('État de projet invalide');
    }
    const where = buildWhereClause(params);

    const [projectContracts, total, totalByState] = await Promise.all([
        prisma.projectContract.findMany({
            where,
            take: limit + 1,
            orderBy: { id: 'asc' },
            include: {
                policyholder: true,
                product: true,
                manager: true,
            },
        }),
        prisma.projectContract.count({ where }),
        getTotalByState(where)
    ]);

    const hasNextPage = projectContracts.length > limit;
    const data = hasNextPage ? projectContracts.slice(0, -1) : projectContracts;
    const lastId = data[data.length - 1]?.id;

    const currentPage = params.last_seen_id ? Math.floor(parseInt(params.last_seen_id) / limit) + 1 : 1;
    const maxPage = Math.ceil(total / limit);

    revalidatePath('/projets')

    return {
        data,
        meta: {
            limit,
            last_seen_id: lastId,
            next_page: hasNextPage ? `/api/projects?limit=${limit}&last_seen_id=${lastId}${params.search ? `&search=${params.search}` : ''}${params.state ? `&state=${params.state}` : ''}${params.manager_id ? `&manager_id=${params.manager_id}` : ''}` : null,
            prev_page: currentPage > 1 ? `/api/projects?limit=${limit}&last_seen_id=${Math.max(0, parseInt(params.last_seen_id || '0') - limit)}${params.search ? `&search=${params.search}` : ''}${params.state ? `&state=${params.state}` : ''}${params.manager_id ? `&manager_id=${params.manager_id}` : ''}` : null,
            current_page: currentPage,
            max_page: maxPage,
            total,
            totalByState,
        },
    };
}