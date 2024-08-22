'use server'

import { prisma } from '@/server/db';
import { revalidateTag } from 'next/cache';

type CreatePolicyholderData = {
    last_name: string;
    first_name: string;
    phone: string;
    email: string;
    company_name: string;
    siret: string;
    street_number: string;
    street_type: string;
    street_name: string;
    zip_code: string;
    town: string;
    notes: string;
};

export async function createPolicyholder(data: CreatePolicyholderData) {
    try {

        const userId = "clz9sspol0001p3hxt673m2va"
        const managerId = "clz9sspol0001p3hxt673m2va"

        const newPolicyholder = await prisma.policyholder.create({
            data: {
                ...data,
                business_provider: { connect: { id: managerId } },
                business_manager: { connect: { id: userId } },
                creator: { connect: { id: userId } },
                last_editor: { connect: { id: userId } },
            },
        });

        revalidateTag('policyholders');
        return newPolicyholder;
    } catch (error) {
        console.error('Error creating policyholder:', error);
        throw new Error('Failed to create policyholder');
    }
}