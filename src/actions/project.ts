'use server'

import { prisma } from '@/server/db'
import { ProjectContractState } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function updateProjectState(projectId: string, newState: ProjectContractState) {
    try {
        await prisma.projectContract.update({
            where: { id: projectId },
            data: { state: newState },
        })

        revalidatePath('/projets')
        return { success: true, message: "L'état du projet a été modifié avec succès." }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'état du projet: `, error)
        return { success: false, message: "Une erreur est survenue lors de la mise à jour de l'état du projet." }
    }
}