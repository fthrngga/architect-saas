import React from 'react';
import { Head } from '@inertiajs/react';
import UserAppLayout from '@/Layouts/UserAppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';

export default function Dashboard({ project, modules }: { project: any, modules: any[] }) {
    return (
        <UserAppLayout project={project} modules={modules}>
            <Head title="Dashboard" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Modules
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{modules.length}</div>
                    </CardContent>
                </Card>
                {/* Add more widgets here */}
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Welcome to your App</h2>
                <div className="p-6 border rounded-lg bg-muted/10 border-dashed">
                    <p className="text-center text-muted-foreground">
                        This is the dashboard for <strong>{project.name}</strong>.
                        <br />
                        Select a module from the sidebar to view data.
                    </p>
                </div>
            </div>
        </UserAppLayout>
    );
}
