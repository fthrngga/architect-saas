import React from 'react';
import UserAppLayout from '@/Layouts/UserAppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/Components/ui/card';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function Form({ project, item }: any) {
    const isEditing = !!item;
    const { data, setData, post, put, processing, errors } = useForm({
        brand: item?.brand ?? '',
        plate: item?.plate ?? '',
        rate: item?.rate ?? 0,
        
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing 
            ? `/app/gReXkFiDKb/test-architecture-536/vehicles_95/${item.id}`
            : `/app/gReXkFiDKb/test-architecture-536/vehicles_95`;
            
        if (isEditing) {
            put(url);
        } else {
            post(url);
        }
    };

    return (
        <UserAppLayout project={project} title={isEditing ? 'Edit Vehicle' : 'Create Vehicle'}>
            <Head title={isEditing ? 'Edit Vehicle' : 'Create Vehicle'} />
            
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit Vehicle' : 'Create New Vehicle'}</CardTitle>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-4">
                            
                            <div className="grid gap-2">
                                <Label htmlFor="brand">Brand</Label>
                                <Input
                                    id="brand"
                                    type="text"
                                    value={data.brand}
                                    onChange={(e) => setData('brand', e.target.value)}
                                    required
                                />
                                {errors.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="plate">Plate</Label>
                                <Input
                                    id="plate"
                                    type="text"
                                    value={data.plate}
                                    onChange={(e) => setData('plate', e.target.value)}
                                    required
                                />
                                {errors.plate && <p className="text-sm text-destructive">{errors.plate}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="rate">Rate</Label>
                                <Input
                                    id="rate"
                                    type="number"
                                    value={data.rate}
                                    onChange={(e) => setData('rate', e.target.value)}
                                    required
                                />
                                {errors.rate && <p className="text-sm text-destructive">{errors.rate}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" type="button" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {isEditing ? 'Update' : 'Create'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </UserAppLayout>
    );
}
