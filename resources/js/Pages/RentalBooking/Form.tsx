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
        customer_name: item?.customer_name ?? '',
        customer_phone: item?.customer_phone ?? '',
        start_date: item?.start_date ?? '',
        end_date: item?.end_date ?? '',
        total_cost: item?.total_cost ?? 0,
        payment_status: item?.payment_status ?? '',
        
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing 
            ? `/app/SzktrqzZ6z/fleetlease-automotive-saas/rental_bookings/${item.id}`
            : `/app/SzktrqzZ6z/fleetlease-automotive-saas/rental_bookings`;
            
        if (isEditing) {
            put(url);
        } else {
            post(url);
        }
    };

    return (
        <UserAppLayout project={project} title={isEditing ? 'Edit RentalBooking' : 'Create RentalBooking'}>
            <Head title={isEditing ? 'Edit RentalBooking' : 'Create RentalBooking'} />
            
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit RentalBooking' : 'Create New RentalBooking'}</CardTitle>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-4">
                            
                            <div className="grid gap-2">
                                <Label htmlFor="customer_name">Customer Name</Label>
                                <Input
                                    id="customer_name"
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    required
                                />
                                {errors.customer_name && <p className="text-sm text-destructive">{errors.customer_name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="customer_phone">Customer Phone</Label>
                                <Input
                                    id="customer_phone"
                                    type="text"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    required
                                />
                                {errors.customer_phone && <p className="text-sm text-destructive">{errors.customer_phone}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    required
                                />
                                {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    required
                                />
                                {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="total_cost">Total Cost</Label>
                                <Input
                                    id="total_cost"
                                    type="number"
                                    value={data.total_cost}
                                    onChange={(e) => setData('total_cost', e.target.value)}
                                    required
                                />
                                {errors.total_cost && <p className="text-sm text-destructive">{errors.total_cost}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="payment_status">Payment Status</Label>
                                <Input
                                    id="payment_status"
                                    type="text"
                                    value={data.payment_status}
                                    onChange={(e) => setData('payment_status', e.target.value)}
                                    required
                                />
                                {errors.payment_status && <p className="text-sm text-destructive">{errors.payment_status}</p>}
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
