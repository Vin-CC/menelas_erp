import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import AddPolicyholderForm from './_components/AddPolicyholderForm';

export default function NewPolicyholderPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Assurés</h1>
            <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link href="/" className="text-gray-700 hover:text-blue-600">
                            Dashboard
                        </Link>
                    </li>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <li className="inline-flex items-center">
                        <Link href="/assure" className="text-gray-700 hover:text-blue-600">
                            Assurés
                        </Link>
                    </li>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <li className="inline-flex items-center">
                        <span className="text-gray-500">Nouveau</span>
                    </li>
                </ol>
            </nav>
            <AddPolicyholderForm />
        </div>
    );
}