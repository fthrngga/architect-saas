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
        availabel: item?.availabel ?? '',
        
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing 
            ? `/app/aWx0BOGpqh/website-rifa/cars/${item.id}`
            : `/app/aWx0BOGpqh/website-rifa/cars`;
            
        if (isEditing) {
            put(url);
        } else {
            post(url);
        }
    };

    return (
        <UserAppLayout project={project} title={isEditing ? 'Edit Car' : 'Create Car'}>
            <Head title={isEditing ? 'Edit Car' : 'Create Car'} />
            
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit Car' : 'Create New Car'}</CardTitle>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-4">
                            
                            <div className="grid gap-2">
                                <Label htmlFor="availabel">Availabel</Label>
                                <Input
                                    id="availabel"
                                    type="checkbox"
                                    value={data.availabel}
                                    onChange={(e) => setData('availabel', e.target.value)}
                                    required
                                />
                                {errors.availabel && <p className="text-sm text-destructive">{errors.availabel}</p>}
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
