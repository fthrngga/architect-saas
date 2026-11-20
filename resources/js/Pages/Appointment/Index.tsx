import React from 'react';
import UserAppLayout from '@/Layouts/UserAppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Plus, Pencil, Trash } from 'lucide-react';

export default function Index({ project, items }: any) {
    const handleDelete = (id: string) => {
        if (confirm('Are you sure?')) {
            router.delete(`/app/SzktrqzZ6z/medika-health-enterprise/appointments/${id}`);
        }
    };

    return (
        <UserAppLayout project={project} title="Appointments">
            <Head title="Appointments" />
            
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
                <Link href={`/app/SzktrqzZ6z/medika-health-enterprise/appointments/create`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Appointment
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient Name</TableHead>
                                <TableHead>Doctor Name</TableHead>
                                <TableHead>Appointment Date</TableHead>
                                <TableHead>Complaint Summary</TableHead>
                                <TableHead>Status</TableHead>
                                
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.data.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.patient_name}</TableCell>
                                    <TableCell>{item.doctor_name}</TableCell>
                                    <TableCell>{item.appointment_date}</TableCell>
                                    <TableCell>{item.complaint_summary}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/app/SzktrqzZ6z/medika-health-enterprise/appointments/${item.id}/edit`}>
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {items.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={100} className="text-center py-10 text-muted-foreground">
                                        No entries found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </UserAppLayout>
    );
}
