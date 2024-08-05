'use client'
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';

export const ExportButton = () => {
    const searchParams = useSearchParams();

    const handleExport = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('export', 'csv');

        const response = await fetch(`${baseUrl}/api/projects/export?${currentParams.toString()}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'projets.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <Button variant="outline" onClick={handleExport}>
            Exporter projets
        </Button>
    );
};