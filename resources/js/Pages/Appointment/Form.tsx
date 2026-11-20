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
        patient_name: item?.patient_name ?? '',
        doctor_name: item?.doctor_name ?? '',
        appointment_date: item?.appointment_date ?? '',
        complaint_summary: item?.complaint_summary ?? '',
        status: item?.status ?? '',
        
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing 
            ? `/app/SzktrqzZ6z/medika-health-enterprise/appointments/${item.id}`
            : `/app/SzktrqzZ6z/medika-health-enterprise/appointments`;
            
        if (isEditing) {
            put(url);
        } else {
            post(url);
        }
    };

    return (
        <UserAppLayout project={project} title={isEditing ? 'Edit Appointment' : 'Create Appointment'}>
            <Head title={isEditing ? 'Edit Appointment' : 'Create Appointment'} />
            
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit Appointment' : 'Create New Appointment'}</CardTitle>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-4">
                            
                            <div className="grid gap-2">
                                <Label htmlFor="patient_name">Patient Name</Label>
                                <Input
                                    id="patient_name"
                                    type="text"
                                    value={data.patient_name}
                                    onChange={(e) => setData('patient_name', e.target.value)}
                                    required
                                />
                                {errors.patient_name && <p className="text-sm text-destructive">{errors.patient_name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="doctor_name">Doctor Name</Label>
                                <Input
                                    id="doctor_name"
                                    type="text"
                                    value={data.doctor_name}
                                    onChange={(e) => setData('doctor_name', e.target.value)}
                                    required
                                />
                                {errors.doctor_name && <p className="text-sm text-destructive">{errors.doctor_name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="appointment_date">Appointment Date</Label>
                                <Input
                                    id="appointment_date"
                                    type="date"
                                    value={data.appointment_date}
                                    onChange={(e) => setData('appointment_date', e.target.value)}
                                    required
                                />
                                {errors.appointment_date && <p className="text-sm text-destructive">{errors.appointment_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="complaint_summary">Complaint Summary</Label>
                                <textarea
                                    id="complaint_summary"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.complaint_summary}
                                    onChange={(e) => setData('complaint_summary', e.target.value)}
                                    required
                                />
                                {errors.complaint_summary && <p className="text-sm text-destructive">{errors.complaint_summary}</p>}
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
