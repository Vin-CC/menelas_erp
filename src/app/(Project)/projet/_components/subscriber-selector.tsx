// app/Project/_components/subscriber-selector.tsx
'use client'
import { useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type SubscriberSelectorProps = {
    souscripteursData: { id: string; last_name: string; first_name: string; }[];
    onSubscriberChange: (subscriberId: string) => void;
}

export const SubscriberSelector = ({ souscripteursData, onSubscriberChange }: SubscriberSelectorProps) => {
    const [selectedSubscriber, setSelectedSubscriber] = useState<string>('ALL');

    const handleChange = (value: string) => {
        setSelectedSubscriber(value);
        onSubscriberChange(value);
    }

    return (
        <Select onValueChange={handleChange} value={selectedSubscriber}>
            <SelectTrigger>
                <SelectValue placeholder="Sélectionner un souscripteur" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">Tous</SelectItem>
                {souscripteursData.map((souscripteur) => (
                    <SelectItem key={souscripteur.id} value={souscripteur.id}>
                        {souscripteur.last_name} {souscripteur.first_name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}