'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';


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

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [results, setResults] = useState<any[]>([]);

    const fetchResults = useCallback(async (searchTerm: string) => {
        if (searchTerm) {
            const response = await fetch(`/api/policyholder?search=${searchTerm}&limit=5`);
            const policyholders = await response.json();
            setResults(policyholders.data);
        } else {
            setResults([]);
        }
    }, []);

    const debouncedFetchResults = useCallback(
        debounce((searchTerm: string) => fetchResults(searchTerm), 500),
        [fetchResults]
    );

    useEffect(() => {
        debouncedFetchResults(search);
    }, [search, debouncedFetchResults]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleResultClick = (id: string) => {
        router.push(`/assure/${id}`);
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Chercher un assuré"
                    value={search}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 w-full border rounded-md"
                />
            </div>
            {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md rounded-md mt-1 z-10 border border-gray-200">
                    {results.map((policyholder) => (
                        <div
                            key={policyholder.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                            onClick={() => handleResultClick(policyholder.id)}
                        >
                            <div className="font-semibold">
                                {`${policyholder.last_name} ${policyholder.first_name}`}
                            </div>
                            <div className="text-sm text-gray-600">
                                {`${policyholder.street_number} ${policyholder.street_type} ${policyholder.street_name}, ${policyholder.zip_code} ${policyholder.town}`}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}