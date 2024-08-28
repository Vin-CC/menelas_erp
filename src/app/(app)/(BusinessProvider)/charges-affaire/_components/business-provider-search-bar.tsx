'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type BusinessProvider = {
    id: string;
    last_name: string;
    first_name: string;
    company_name: string;
};

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [results, setResults] = useState<BusinessProvider[]>([]);
    const [isSearching, setIsSearching] = useState(false);
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
                const response = await fetch(`/api/businessprovider?search=${searchTerm}&limit=5`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const businessProviders = await response.json();
                setResults(businessProviders.data);
            } catch (error) {
                console.error('Error fetching results:', error);
                setResults([]);
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
        router.push(`/apporteur-affaire/${id}`);
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Chercher un apporteur d'affaire"
                    value={search}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 w-full border rounded-md"
                />
            </div>
            {search && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md rounded-md mt-1 z-10 border border-gray-200">
                    {isSearching ? (
                        <div className="p-3 text-gray-600">Recherche en cours...</div>
                    ) : results.length > 0 ? (
                        results.map((businessProvider) => (
                            <div
                                key={businessProvider.id}
                                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                                onClick={() => handleResultClick(businessProvider.id)}
                            >
                                <div className="font-semibold">
                                    {`${businessProvider.last_name} ${businessProvider.first_name}`}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {businessProvider.company_name}
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