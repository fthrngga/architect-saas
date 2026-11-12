import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import ArchitectLayout from '@/Layouts/Architect/ArchitectLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/Components/ui/card';
import { Plus, Settings, Box } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"

export default function ProjectsIndex({ projects = [] }: { projects: any[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        repository_url: '',
    });
    const [open, setOpen] = useState(false);
    const { auth } = usePage().props as any;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('architect.projects.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <ArchitectLayout title="My Projects">
            <Head title="My Projects" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium">Active Projects</h3>
                    <p className="text-sm text-muted-foreground">Manage your software architecture projects.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={submit}>
                            <DialogHeader>
                                <DialogTitle>Create Project</DialogTitle>
                                <DialogDescription>
                                    Start a new architecture project. You can link a repository later.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="col-span-3"
                                        placeholder="E-Commerce API"
                                        required
                                    />
                                    {errors.name && <span className="col-span-4 text-right text-destructive text-xs">{errors.name}</span>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="repo" className="text-right">
                                        Repo URL
                                    </Label>
                                    <Input
                                        id="repo"
                                        value={data.repository_url}
                                        onChange={(e) => setData('repository_url', e.target.value)}
                                        className="col-span-3"
                                        placeholder="https://github.com/..."
                                    />
                                    {errors.repository_url && <span className="col-span-4 text-right text-destructive text-xs">{errors.repository_url}</span>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={processing}>Create Project</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card key={project.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <Link href={route('architect.modules.index', project.id)} className="block h-full">
                            <CardHeader>
                                <CardTitle className="group-hover:text-primary flex items-center gap-2">
                                    <Box className="w-4 h-4" />
                                    {project.name}
                                </CardTitle>
                                <CardDescription>Created {new Date(project.created_at).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                    <span className="px-2 py-1 bg-secondary rounded-md">Laravel 11</span>
                                    <span className="px-2 py-1 bg-secondary rounded-md">React</span>
                                </div>
                            </CardContent>
                        </Link>
                        <CardFooter className="border-t pt-4 flex justify-between">
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); /* open settings */ }}>
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </Button>
                            <div className="flex gap-2">
                                <a href={route('architect.projects.export', project.id)} target="_blank">
                                    <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                        Export
                                    </Button>
                                </a>
                                <Link href={`/app/${auth.user.handle}/${project.slug}/dashboard`} target="_blank" onClick={(e) => e.stopPropagation()}>
                                    <Button size="sm" variant="secondary">
                                        Open App
                                    </Button>
                                </Link>
                                <Link href={route('architect.editor.canvas', project.id)} onClick={(e) => e.stopPropagation()}>
                                    <Button size="sm" variant="outline">Canvas</Button>
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/10">
                    <h3 className="text-muted-foreground">No projects found. Create one to get started.</h3>
                </div>
            )}
        </ArchitectLayout>
    );
}
