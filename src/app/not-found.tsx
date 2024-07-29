import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
    return (
        <main className="relative isolate min-h-full">
            <Image
                alt="Fond abstrait représentant un champignon Mycena stylisé"
                src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
                layout="fill"
                priority
            />
            <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
                <p className="text-base font-semibold leading-8 text-white">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Page non trouvée</h1>
                <p className="mt-4 text-base text-white/70 sm:mt-6">
                    {`Désolé, nous n'avons pas pu trouver la page que vous recherchez.`}
                </p>
                <div className="mt-10 flex justify-center">
                    <Link href="/" className="text-sm font-semibold leading-7 text-white hover:text-gray-300 transition-colors">
                        <span aria-hidden="true">&larr;</span> {`Retour à la page d'accueil`}
                    </Link>
                </div>
            </div>
        </main>
    )
}