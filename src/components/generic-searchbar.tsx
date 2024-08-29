'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type SearchResult = {
    id: string;
    name: string;
    type?: string;
};

type SearchBarProps = {
    placeholder: string;
    apiEndpoint: string;
    resultPath: string;
    typeLabels: Record<string, string>;
};

export function SearchBar({ placeholder, apiEndpoint, resultPath, typeLabels }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const debouncedFetchResults = useCallback((searchTerm: string) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => fetchResults(searchTerm), 300);
    }, []);

    const fetchResults = useCallback(async (searchTerm: string) => {
        if (searchTerm) {
            setIsSearching(true);
            setError(null);
            try {
                const response = await fetch(`${apiEndpoint}?search=${encodeURIComponent(searchTerm)}&limit=5`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Résultats de la recherche:", data);
                setResults(data.data);
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
    }, [apiEndpoint]);

    useEffect(() => {
        debouncedFetchResults(search);
    }, [search, debouncedFetchResults]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleResultClick = (id: string) => {
        router.push(`${resultPath}/${id}`);
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 w-full border rounded-md"
                />
            </div>
            {search && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white shadow-md rounded-md z-50 border border-gray-200 max-h-60 overflow-y-auto">
                    {isSearching ? (
                        <div className="p-3 text-gray-600">Recherche en cours...</div>
                    ) : error ? (
                        <div className="p-3 text-red-600">{error}</div>
                    ) : results.length > 0 ? (
                        results.map((result) => (
                            <div
                                key={result.id}
                                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                                onClick={() => handleResultClick(result.id)}
                            >
                                <div className="font-semibold">{result.name}</div>
                                {result.type && (
                                    <div className="text-sm text-gray-600">{typeLabels[result.type]}</div>
                                )}
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