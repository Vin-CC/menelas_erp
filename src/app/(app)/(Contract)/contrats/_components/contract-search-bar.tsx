'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ContractResult {
    id: string;
    policyholder: {
        company_name: string;
        last_name: string;
        first_name: string;
    };
    product: {
        name: string;
    };
}

const debounce = (func: (...args: any) => any, delay: number) => {
    let timerId: NodeJS.Timeout;
    return (...args: any[]) => {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export default function ContractSearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [results, setResults] = useState<ContractResult[]>([]);

    const fetchResults = useCallback(async (searchTerm: string) => {
        if (searchTerm) {
            const response = await fetch(`/api/contracts?search=${encodeURIComponent(searchTerm)}&limit=5`, { next: { tags: ['contracts'] } });
            const contracts = await response.json();
            setResults(contracts.data);
        } else {
            setResults([]);
        }
    }, []);

    const debouncedFetchResults = useCallback(
        debounce((searchTerm: string) => fetchResults(searchTerm), 300),
        [fetchResults]
    );

    useEffect(() => {
        debouncedFetchResults(search);
    }, [search, debouncedFetchResults]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Chercher un contrat"
                    value={search}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 w-full border rounded-md"
                />
            </div>
            {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md rounded-md mt-1 z-10 border border-gray-200">
                    {results.map((contract) => (
                        <div
                            key={contract.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                            onClick={() => router.push(`/assure/${contract.policyholder.company_name ? contract.policyholder.company_name : `${contract.policyholder.last_name}-${contract.policyholder.first_name}`}/contrats/${contract.id}`)}
                        >
                            <div className="font-semibold">
                                {contract.policyholder.company_name || `${contract.policyholder.last_name} ${contract.policyholder.first_name}`}
                            </div>
                            <div className="text-sm text-gray-600">
                                {contract.product.name}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}