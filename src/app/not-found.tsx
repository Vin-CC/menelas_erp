import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
    return (
        <main className="relative isolate min-h-full">
            <Image
                alt="Fond abstrait représentant un champignon Mycena stylisé"
                src="/404.avif"
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
                    <Link href="/dashboard" className="text-sm font-semibold leading-7 text-white hover:text-gray-300 transition-colors">
                        <span aria-hidden="true">&larr;</span> {`Retour à la page d'accueil`}
                    </Link>
                </div>
            </div>
        </main>
    )
}