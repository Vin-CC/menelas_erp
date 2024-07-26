'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { createPolicyholder } from '@/actions/policyholder/create';

export default function AddPolicyholderForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        last_name: '',
        first_name: '',
        phone: '',
        email: '',
        company_name: '',
        siret: '',
        street_number: '',
        street_type: '',
        street_name: '',
        zip_code: '',
        town: '',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await createPolicyholder(formData);
            router.push('/assure');
        } catch (error) {
            console.error('Error creating policyholder:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-2">Ajouter un assuré</h1>
            <p className="text-gray-600 mb-6">Completez les informations nécessaires</p>
            <h2 className='font-bold mb-4'>Identité</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="last_name">Nom <span className="text-xs text-gray-500">(Requis)</span></Label>
                        <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="first_name">Prénom <span className="text-xs text-gray-500">(Requis)</span></Label>
                        <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="phone">Numéro de téléphone</Label>
                        <Input id="phone" placeholder='0612457809' name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="adresse">
                        <AccordionTrigger className="font-semibold">Adresse</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="street_number">Numéro de rue</Label>
                                    <Input id="street_number" name="street_number" value={formData.street_number} onChange={handleChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="street_type">Type de rue</Label>
                                    <Input id="street_type" name="street_type" value={formData.street_type} onChange={handleChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="street_name">Nom de rue</Label>
                                    <Input id="street_name" name="street_name" value={formData.street_name} onChange={handleChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="zip_code">Code postal</Label>
                                    <Input id="zip_code" name="zip_code" value={formData.zip_code} onChange={handleChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="town">Ville</Label>
                                    <Input id="town" name="town" value={formData.town} onChange={handleChange} required />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="societe">
                        <AccordionTrigger className="font-semibold">Société</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="company_name">Nom de la société</Label>
                                    <Input id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="siret">SIRET</Label>
                                    <Input id="siret" name="siret" value={formData.siret} onChange={handleChange} />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="autre">
                        <AccordionTrigger className="font-semibold">Autre</AccordionTrigger>
                        <AccordionContent>
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Input id="notes" name="notes" value={formData.notes} onChange={handleChange} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div className="flex justify-between space-x-2 mt-6">
                    <Button type="button" variant="outline" onClick={() => router.push('/assure')} className="flex-1">
                        Annuler
                    </Button>
                    <Button type="submit" className="flex-1 bg-black text-white" disabled={isSubmitting}>Enregistrer</Button>
                </div>
            </form>
        </div>
    );
}