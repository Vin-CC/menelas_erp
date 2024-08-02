'use client'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation'

type SouscripteurSelectProps = {
    souscripteursData: { id: string; last_name: string; first_name: string; }[];
}

const ALL_SUBSCRIBERS = 'ALL_SUBSCRIBERS';

export const SouscripteurSelect = ({ souscripteursData }: SouscripteurSelectProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const selectedSubscriber = searchParams.get('subscriber') || ALL_SUBSCRIBERS

    const handleChange = (value: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())
        if (value && value !== ALL_SUBSCRIBERS) {
            newSearchParams.set('subscriber', value)
        } else {
            newSearchParams.delete('subscriber')
        }
        router.push(`?${newSearchParams.toString()}`, { scroll: false })
    }

    return (
        <Select onValueChange={handleChange} value={selectedSubscriber}>
            <SelectTrigger className="w-96">
                <SelectValue placeholder="Sélectionner un souscripteur" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={ALL_SUBSCRIBERS}>Tous les souscripteurs</SelectItem>
                {souscripteursData.map((souscripteur) => (
                    <SelectItem key={souscripteur.id} value={souscripteur.id}>
                        {souscripteur.last_name} {souscripteur.first_name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}