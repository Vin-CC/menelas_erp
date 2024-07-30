'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const EventPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <div>Chargement...</div>;
    }

    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Page des événements</h1>

            {session?.user && (
                <div className="mb-4">
                    <h2 className="text-xl mb-2">{`Informations de l'utilisateur :`}</h2>
                    <p>Nom : {session.user.name}</p>
                    <p>Email : {session.user.email}</p>
                    <p>Prenom : {session.user.first_name}</p>
                    <p>Nom : {session.user.last_name}</p>
                </div>
            )}

            <Button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full max-w-xs"
                variant="outline"
            >
                Déconnexion
            </Button>
        </div>
    );
};

export default EventPage;