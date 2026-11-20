import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserAppLayout from '@/Layouts/UserAppLayout';
import {
    Table2,
    Database,
    Plus,
    ArrowRight,
    SlidersHorizontal,
    Download,
    Layers,
    Server,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';

interface ModuleAttribute {
    name: string;
    type: string;
    nullable?: boolean;
}

interface ProjectModule {
    id: string;
    name: string;
    table_name: string;
    status: string;
    attributes: ModuleAttribute[];
}

export default function Dashboard({ project, modules = [] }: { project: any; modules: ProjectModule[] }) {
    const ownerHandle = project?.owner?.handle || '';
    const projectSlug = project?.slug || '';

    return (
        <UserAppLayout project={project} modules={modules} title={`Dashboard - ${project.name}`}>
            <Head title={`Dashboard - ${project.name}`} />

            <div className="space-y-8">
                {/* Hero Banner */}
                <div className="bg-card text-card-foreground rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Aplikasi Live & Terhubung ke AWS RDS MySQL</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                                {project.name}
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-2xl">
                                {project.description || 'Sistem operasional database terstruktur hasil arsitektur otomatis.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <Link
                                href={route('architect.modules.index', project.id)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-mono font-bold text-foreground transition-colors shadow-sm"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                <span>Schema Editor</span>
                            </Link>

                            <a
                                href={route('architect.projects.export', project.id)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-mono font-bold transition-all shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                <span>Unduh ZIP Codebase</span>
                            </a>
                        </div>
                    </div>

                    {/* Stats Ribbon */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
                        <div className="p-4 rounded-xl bg-muted/40 border border-border">
                            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                                <span>Total Modul Aktif</span>
                                <Layers className="w-4 h-4 text-primary" />
                            </div>
                            <div className="text-2xl font-bold font-mono text-foreground mt-2">
                                {modules.length} <span className="text-xs font-normal text-muted-foreground">Tabel</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-muted/40 border border-border">
                            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                                <span>Infrastruktur Database</span>
                                <Server className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="text-2xl font-bold font-mono text-foreground mt-2">
                                MySQL 8.0 <span className="text-xs font-normal text-muted-foreground">AWS RDS</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-muted/40 border border-border">
                            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                                <span>Multi-Tenancy</span>
                                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                            </div>
                            <div className="text-2xl font-bold font-mono text-foreground mt-2 truncate">
                                {project.owner?.name || 'Owner'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modules Grid */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                            <Table2 className="w-5 h-5 text-primary" />
                            <span>Daftar Modul & Tabel Database Operasional</span>
                        </h2>

                        <Link
                            href={route('architect.modules.index', project.id)}
                            className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1"
                        >
                            <Plus className="w-3.5 h-3.5" /> Tambah Modul Baru
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {modules.map((mod) => {
                            const tableUrl = `/app/${ownerHandle}/${projectSlug}/${mod.table_name}`;
                            const createUrl = `${tableUrl}/create`;

                            return (
                                <div
                                    key={mod.id || mod.table_name}
                                    className="bg-card text-card-foreground rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground">
                                                <Table2 className="w-4 h-4" />
                                            </div>
                                            <code className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                                                {mod.table_name}
                                            </code>
                                        </div>

                                        <h3 className="font-bold text-base text-foreground tracking-tight">
                                            {mod.name}
                                        </h3>

                                        <div className="mt-3 space-y-1.5">
                                            <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground block">
                                                Kolom Database:
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                                {mod.attributes && mod.attributes.map((attr, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-foreground border border-border"
                                                    >
                                                        {attr.name} <span className="text-primary">({attr.type})</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
                                        <Link
                                            href={tableUrl}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-mono font-bold transition-colors shadow-sm"
                                        >
                                            <span>Buka Data</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>

                                        <Link
                                            href={createUrl}
                                            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-primary transition-colors"
                                            title="Tambah Data Baru"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </UserAppLayout>
    );
}
