'use server'

import { prisma } from '@/server/db'
import { ProjectContractState } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { currentUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function updateProjectState(projectId: string, newState: ProjectContractState) {
    const user = await currentUser()

    if (!user) {
        return NextResponse.json(
            { error: "You must be logged in" },
            { status: 401 }
        );
    }

    try {
        await prisma.projectContract.update({
            where: { id: projectId },
            data: { state: newState },
        })

        revalidateTag('projects')
        return { success: true, message: "L'état du projet a été modifié avec succès." }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'état du projet: `, error)
        return { success: false, message: "Une erreur est survenue lors de la mise à jour de l'état du projet." }
    }
}