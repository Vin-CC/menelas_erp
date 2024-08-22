'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Policyholder = {
    id: string;
    last_name: string;
    first_name: string;
    street_number: string;
    street_type: string;
    street_name: string;
    zip_code: string;
    town: string;
};

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [results, setResults] = useState<Policyholder[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const debouncedFetchResults = useCallback((searchTerm: string) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => fetchResults(searchTerm), 500);
    }, []);

    const fetchResults = useCallback(async (searchTerm: string) => {
        if (searchTerm) {
            setIsSearching(true);
            try {
                const response = await fetch(`/api/policyholder?search=${searchTerm}&limit=5`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const policyholders = await response.json();
                setResults(policyholders.data);
            } catch (error) {
                console.error('Error fetching results:', error);
                setResults([]);
                setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
            } finally {
                setIsSearching(false);
            }
        } else {
            setResults([]);
            setIsSearching(false);
        }
    }, []);

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
            {search && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md rounded-md mt-1 z-10 border border-gray-200">
                    {isSearching ? (
                        <div className="p-3 text-gray-600">Recherche en cours...</div>
                    ) : error ? (
                        <div className="p-3 text-red-600">{error}</div>
                    ) : results.length > 0 ? (
                        results.map((policyholder) => (
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
                        ))
                    ) : (
                        <div className="p-3 text-gray-600">Aucun résultat trouvé</div>
                    )}
                </div>
            )}
        </div>
    );
}