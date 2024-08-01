//app/()Project()/_components/project_search-bar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProjectResult {
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

export default function ProjectSearchBar() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<ProjectResult[]>([]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (search) {
                const response = await fetch(`/api/projects?search=${encodeURIComponent(search)}&limit=5`, { next: { tags: ['projects'] } });
                const projects = await response.json();
                setResults(projects.data);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleResultClick = (projectId: string) => {
        router.push(`/user/:userId/projets/${projectId}`);
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Chercher un projet"
                    value={search}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 w-full border rounded-md"
                />
            </div>
            {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md rounded-md mt-1 z-10 border border-gray-200">
                    {results.map((project) => (
                        <div
                            key={project.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                            onClick={() => handleResultClick(project.id)}
                        >
                            <div className="font-semibold">
                                {project.policyholder.company_name || `${project.policyholder.last_name} ${project.policyholder.first_name}`}
                            </div>
                            <div className="text-sm text-gray-600">
                                {project.product.name}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}