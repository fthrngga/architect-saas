import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import ArchitectLayout from '@/Layouts/Architect/ArchitectLayout';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/Components/ui/card';
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Plus, Trash, ArrowLeft, Loader2, Play } from 'lucide-react';

interface Attribute {
    name: string;
    type: string;
    nullable: boolean;
}

export default function ModulesIndex({ project, modules = [] }: { project: any, modules: any[] }) {
    const [attributes, setAttributes] = useState<Attribute[]>([
        { name: '', type: 'string', nullable: false }
    ]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        table_name: '',
        attributes: [] as Attribute[]
    });

    const addAttribute = () => {
        setAttributes([...attributes, { name: '', type: 'string', nullable: false }]);
    };

    const removeAttribute = (index: number) => {
        const newAttrs = [...attributes];
        newAttrs.splice(index, 1);
        setAttributes(newAttrs);
    };

    const updateAttribute = (index: number, field: keyof Attribute, value: any) => {
        const newAttrs = [...attributes];
        // @ts-ignore
        newAttrs[index][field] = value;
        setAttributes(newAttrs);
    };

    const generate = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation before submission
        const validAttributes = attributes.filter(attr => attr.name.trim() !== '');

        // Auto-generate table name from module name if empty
        const tableName = data.table_name || data.name.toLowerCase().replace(/\s+/g, '_') + 's';

        data.attributes = validAttributes;
        data.table_name = tableName;

        post(route('architect.modules.store', project.id), {
            onSuccess: () => {
                reset();
                setAttributes([{ name: '', type: 'string', nullable: false }]);
            }
        });
    };

    const deleteModule = (moduleId: string) => {
        if (confirm('Are you sure? This will delete these files and drop the table.')) {
            // @ts-ignore
            router.delete(route('architect.modules.destroy', moduleId));
        }
    }

    return (
        <ArchitectLayout title={`Modules - ${project.name}`}>
            <Head title={`Modules - ${project.name}`} />

            <div className="mb-6">
                <Link href={route('architect.projects.index')} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Module Builder</h2>
                <p className="text-muted-foreground">Define your data structure and generate CRUD pages automatically.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Builder Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Module</CardTitle>
                            <CardDescription>Create a new entity for your application.</CardDescription>
                        </CardHeader>
                        <form onSubmit={generate}>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Module Name (Singular)</Label>
                                        <Input
                                            id="name"
                                            placeholder="Product"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">e.g. Product, Order, Customer</p>
                                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="table_name">Table Name (Optional)</Label>
                                        <Input
                                            id="table_name"
                                            placeholder="products"
                                            value={data.table_name}
                                            onChange={e => setData('table_name', e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">Will be auto-generated if empty.</p>
                                        {errors.table_name && <p className="text-xs text-destructive">{errors.table_name}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Attributes (Columns)</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                                            <Plus className="w-4 h-4 mr-2" /> Add Column
                                        </Button>
                                    </div>

                                    <div className="space-y-2 border rounded-md p-4 bg-muted/20">
                                        {attributes.map((attr, index) => (
                                            <div key={index} className="flex gap-2 items-start">
                                                <div className="flex-1">
                                                    <Input
                                                        placeholder="Column Name (e.g. price)"
                                                        value={attr.name}
                                                        onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="w-32">
                                                    <Select
                                                        value={attr.type}
                                                        onValueChange={(value) => updateAttribute(index, 'type', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="string">String</SelectItem>
                                                            <SelectItem value="integer">Integer</SelectItem>
                                                            <SelectItem value="text">Text</SelectItem>
                                                            <SelectItem value="boolean">Boolean</SelectItem>
                                                            <SelectItem value="date">Date</SelectItem>
                                                            <SelectItem value="float">Float</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeAttribute(index)}
                                                    disabled={attributes.length === 1}
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.attributes && <p className="text-xs text-destructive">{errors.attributes}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={processing} className="w-full">
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="mr-2 h-4 w-4" /> Generate Module
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>

                {/* Existing Modules List */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Existing Modules</CardTitle>
                            <CardDescription>Modules generated for this project.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {modules.map((module) => (
                                        <TableRow key={module.id}>
                                            <TableCell className="font-medium">{module.name}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${module.status === 'generated'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {module.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => deleteModule(module.id)}
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {modules.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-6 text-muted-foreground text-sm">
                                                No modules yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-sm">Quick Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>• <strong>Strings</strong> are for short text (names, titles).</p>
                            <p>• <strong>Text</strong> is for long descriptions.</p>
                            <p>• <strong>Integers</strong> show as number inputs.</p>
                            <p>• <strong>Booleans</strong> show as checkboxes.</p>
                            <p>• Generated files will appear in <code>app/Modules</code> and <code>resources/js/Pages/Apps</code>.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ArchitectLayout>
    );
}
