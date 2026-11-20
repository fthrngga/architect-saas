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
        mr_number: item?.mr_number ?? '',
        full_name: item?.full_name ?? '',
        birth_date: item?.birth_date ?? '',
        phone_number: item?.phone_number ?? '',
        blood_type: item?.blood_type ?? '',
        
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing 
            ? `/app/SzktrqzZ6z/medika-health-enterprise/patients/${item.id}`
            : `/app/SzktrqzZ6z/medika-health-enterprise/patients`;
            
        if (isEditing) {
            put(url);
        } else {
            post(url);
        }
    };

    return (
        <UserAppLayout project={project} title={isEditing ? 'Edit Patient' : 'Create Patient'}>
            <Head title={isEditing ? 'Edit Patient' : 'Create Patient'} />
            
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit Patient' : 'Create New Patient'}</CardTitle>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-4">
                            
                            <div className="grid gap-2">
                                <Label htmlFor="mr_number">Mr Number</Label>
                                <Input
                                    id="mr_number"
                                    type="text"
                                    value={data.mr_number}
                                    onChange={(e) => setData('mr_number', e.target.value)}
                                    required
                                />
                                {errors.mr_number && <p className="text-sm text-destructive">{errors.mr_number}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    type="text"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    required
                                />
                                {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="birth_date">Birth Date</Label>
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                    required
                                />
                                {errors.birth_date && <p className="text-sm text-destructive">{errors.birth_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input
                                    id="phone_number"
                                    type="text"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    required
                                />
                                {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="blood_type">Blood Type</Label>
                                <Input
                                    id="blood_type"
                                    type="text"
                                    value={data.blood_type}
                                    onChange={(e) => setData('blood_type', e.target.value)}
                                    required
                                />
                                {errors.blood_type && <p className="text-sm text-destructive">{errors.blood_type}</p>}
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
