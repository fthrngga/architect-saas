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
        card_id: item?.card_id ?? '',
        full_name: item?.full_name ?? '',
        phone: item?.phone ?? '',
        package_plan: item?.package_plan ?? '',
        expiry_date: item?.expiry_date ?? '',
        status: item?.status ?? '',
        
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing 
            ? `/app/SzktrqzZ6z/fitcore-athletic-club/members/${item.id}`
            : `/app/SzktrqzZ6z/fitcore-athletic-club/members`;
            
        if (isEditing) {
            put(url);
        } else {
            post(url);
        }
    };

    return (
        <UserAppLayout project={project} title={isEditing ? 'Edit Member' : 'Create Member'}>
            <Head title={isEditing ? 'Edit Member' : 'Create Member'} />
            
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit Member' : 'Create New Member'}</CardTitle>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-4">
                            
                            <div className="grid gap-2">
                                <Label htmlFor="card_id">Card Id</Label>
                                <Input
                                    id="card_id"
                                    type="text"
                                    value={data.card_id}
                                    onChange={(e) => setData('card_id', e.target.value)}
                                    required
                                />
                                {errors.card_id && <p className="text-sm text-destructive">{errors.card_id}</p>}
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
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    required
                                />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="package_plan">Package Plan</Label>
                                <Input
                                    id="package_plan"
                                    type="text"
                                    value={data.package_plan}
                                    onChange={(e) => setData('package_plan', e.target.value)}
                                    required
                                />
                                {errors.package_plan && <p className="text-sm text-destructive">{errors.package_plan}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="expiry_date">Expiry Date</Label>
                                <Input
                                    id="expiry_date"
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                    required
                                />
                                {errors.expiry_date && <p className="text-sm text-destructive">{errors.expiry_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Input
                                    id="status"
                                    type="text"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    required
                                />
                                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
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
