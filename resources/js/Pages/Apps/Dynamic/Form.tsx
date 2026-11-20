import React from 'react';
import UserAppLayout from '@/Layouts/UserAppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Loader2,
    Database,
    Hash,
    Calendar,
    Type,
    FileText,
    ToggleLeft,
    Save,
    ChevronDown
} from 'lucide-react';

interface ModuleAttribute {
    name: string;
    type: string;
    nullable?: boolean;
}

interface DynamicFormProps {
    project: any;
    module: {
        id: string;
        name: string;
        table_name: string;
        attributes: ModuleAttribute[];
        relations?: any[];
    };
    item?: any;
    modules?: any[];
    relationLookups?: Record<string, { target_module: string; target_table: string; options: Array<{ id: string; label: string }> }>;
}

export default function DynamicForm({ project, module, item = null, modules = [], relationLookups = {} }: DynamicFormProps) {
    const isEditing = Boolean(item && item.id);
    const ownerHandle = project?.owner?.handle || '';
    const projectSlug = project?.slug || '';
    const baseUrl = `/app/${ownerHandle}/${projectSlug}/${module.table_name}`;

    // Initialize form state dynamically from attributes
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialValues: Record<string, any> = {};
    module.attributes.forEach((attr) => {
        if (item && item[attr.name] !== undefined) {
            initialValues[attr.name] = item[attr.name];
        } else if (urlParams && urlParams.get(attr.name)) {
            initialValues[attr.name] = urlParams.get(attr.name);
        } else {
            if (attr.type === 'boolean') {
                initialValues[attr.name] = false;
            } else if (attr.type === 'integer' || attr.type === 'float') {
                initialValues[attr.name] = '';
            } else {
                initialValues[attr.name] = '';
            }
        }
    });

    const { data, setData, post, put, processing, errors } = useForm(initialValues);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`${baseUrl}/${item.id}`);
        } else {
            post(baseUrl);
        }
    };

    const formatLabel = (name: string) => {
        return name
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const renderFieldInput = (attr: ModuleAttribute) => {
        const isRequired = !attr.nullable;

        // Relation Foreign Key Select
        if (relationLookups && relationLookups[attr.name]) {
            const lookup = relationLookups[attr.name];
            return (
                <div className="relative">
                    <select
                        id={attr.name}
                        value={data[attr.name] || ''}
                        onChange={(e) => setData(attr.name, e.target.value)}
                        required={isRequired}
                        className="w-full text-xs font-mono py-2.5 pl-3.5 pr-8 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none shadow-sm cursor-pointer"
                    >
                        <option value="">-- Pilih {lookup.target_module} --</option>
                        {lookup.options.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.label} ({opt.id.slice(0, 8)}...)
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                        <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                </div>
            );
        }

        // Currency Format Input
        if (attr.type === 'currency') {
            return (
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground font-mono text-xs font-bold">
                        Rp
                    </div>
                    <input
                        type="number"
                        step="1000"
                        value={data[attr.name] || ''}
                        onChange={(e) => setData(attr.name, e.target.value)}
                        required={isRequired}
                        placeholder="0"
                        className="w-full text-xs font-mono py-2.5 pl-11 pr-3.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring shadow-sm font-bold"
                    />
                </div>
            );
        }

        if (attr.type === 'boolean') {
            return (
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-muted/40 hover:bg-muted/70 cursor-pointer transition-all">
                    <input
                        type="checkbox"
                        checked={Boolean(data[attr.name])}
                        onChange={(e) => setData(attr.name, e.target.checked)}
                        className="w-4 h-4 rounded border-input text-primary focus:ring-ring cursor-pointer"
                    />
                    <div className="space-y-0.5">
                        <span className="font-bold text-xs text-foreground block">
                            {formatLabel(attr.name)}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            Centang untuk menetapkan nilai benar (true / aktif)
                        </span>
                    </div>
                </label>
            );
        }

        if (attr.type === 'text') {
            return (
                <textarea
                    rows={4}
                    value={data[attr.name] || ''}
                    onChange={(e) => setData(attr.name, e.target.value)}
                    required={isRequired}
                    placeholder={`Masukkan teks ${formatLabel(attr.name)}...`}
                    className="w-full text-xs font-mono p-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring shadow-sm transition-all"
                />
            );
        }

        if (attr.type === 'date') {
            return (
                <input
                    type="date"
                    value={data[attr.name] || ''}
                    onChange={(e) => setData(attr.name, e.target.value)}
                    required={isRequired}
                    className="w-full text-xs font-mono py-2.5 px-3.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring shadow-sm transition-all"
                />
            );
        }

        if (attr.type === 'integer') {
            return (
                <input
                    type="number"
                    step="1"
                    value={data[attr.name] || ''}
                    onChange={(e) => setData(attr.name, e.target.value)}
                    required={isRequired}
                    placeholder="0"
                    className="w-full text-xs font-mono py-2.5 px-3.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring shadow-sm transition-all"
                />
            );
        }

        if (attr.type === 'float') {
            return (
                <input
                    type="number"
                    step="0.01"
                    value={data[attr.name] || ''}
                    onChange={(e) => setData(attr.name, e.target.value)}
                    required={isRequired}
                    placeholder="0.00"
                    className="w-full text-xs font-mono py-2.5 px-3.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring shadow-sm transition-all"
                />
            );
        }

        // Default: String
        return (
            <input
                type="text"
                value={data[attr.name] || ''}
                onChange={(e) => setData(attr.name, e.target.value)}
                required={isRequired}
                placeholder={`Contoh nilai ${formatLabel(attr.name)}...`}
                className="w-full text-xs font-mono py-2.5 px-3.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring shadow-sm transition-all"
            />
        );
    };

    return (
        <UserAppLayout project={project} modules={modules} title={`${isEditing ? 'Ubah' : 'Tambah'} ${module.name}`}>
            <Head title={`${isEditing ? 'Ubah' : 'Tambah'} ${module.name} - ${project.name}`} />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Back Link */}
                <Link
                    href={baseUrl}
                    className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground font-bold transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Daftar {module.name}</span>
                </Link>

                {/* Main Form Card */}
                <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-2 mb-1 text-xs font-mono">
                            <span className="text-muted-foreground">Tabel MySQL:</span>
                            <code className="px-2 py-0.5 rounded bg-muted text-primary font-bold border border-border">
                                {module.table_name}
                            </code>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                            {isEditing ? `Ubah Data ${module.name}` : `Tambah Record ${module.name} Baru`}
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            {isEditing
                                ? 'Perbarui data yang sudah tersimpan di database AWS RDS.'
                                : 'Masukkan data baru. Data akan langsung terinsert ke tabel database RDS.'}
                        </p>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 sm:p-8 space-y-5">
                            {module.attributes.map((attr) => (
                                <div key={attr.name} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor={attr.name}
                                            className="font-mono text-xs font-bold text-foreground flex items-center gap-1.5"
                                        >
                                            <span>{formatLabel(attr.name)}</span>
                                            {!attr.nullable && (
                                                <span className="text-primary text-sm" title="Wajib diisi">*</span>
                                            )}
                                        </label>
                                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                            <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border uppercase">
                                                {attr.type}
                                            </span>
                                            {attr.nullable && (
                                                <span className="text-muted-foreground/60">opsional</span>
                                            )}
                                        </div>
                                    </div>

                                    {renderFieldInput(attr)}

                                    {errors[attr.name] && (
                                        <p className="text-xs font-mono text-destructive mt-1 font-bold">
                                            {errors[attr.name]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer Action Buttons */}
                        <div className="p-6 border-t border-border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <Link
                                href={baseUrl}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-mono font-bold text-center transition-colors"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Menyimpan ke RDS...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Data ke Database'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </UserAppLayout>
    );
}
