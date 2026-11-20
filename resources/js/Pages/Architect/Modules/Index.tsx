import React, { useState, useMemo } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import ArchitectLayout from '@/Layouts/Architect/ArchitectLayout';
import {
    Plus,
    Trash2,
    ArrowLeft,
    Loader2,
    Database,
    Table2,
    ExternalLink,
    SlidersHorizontal,
    Download,
    Eye,
    ChevronDown,
    Layers,
    Save,
    Sparkles,
    CheckCircle2,
    Hash,
    Calendar,
    Type,
    FileText,
    ToggleLeft,
    Network,
    Link2,
    ArrowRightLeft,
    DollarSign,
    Unlink,
    Code2
} from 'lucide-react';
import CodeInspectorModal from '@/Pages/Architect/Components/CodeInspectorModal';

interface Attribute {
    name: string;
    type: string;
    nullable: boolean;
}

interface ModuleRelation {
    id: string;
    type: 'belongsTo' | 'hasMany';
    target_module_id: string;
    target_module_name: string;
    target_table: string;
    foreign_key: string;
    display_column?: string;
    created_at?: string;
}

interface ProjectModule {
    id: string;
    name: string;
    table_name: string;
    status: string;
    attributes: Attribute[];
    relations?: ModuleRelation[];
    created_at?: string;
}

export default function ModulesIndex({ project, modules = [] }: { project: any; modules: ProjectModule[] }) {
    const { auth } = usePage().props as any;
    const ownerHandle = project?.owner?.handle || auth?.user?.handle || '';
    const projectSlug = project?.slug || '';

    // --- Module Form State ---
    const [attributes, setAttributes] = useState<Attribute[]>([
        { name: 'name', type: 'string', nullable: false },
        { name: 'price', type: 'currency', nullable: true },
        { name: 'status', type: 'string', nullable: false },
    ]);

    const { data, setData, processing, errors, reset } = useForm({
        name: '',
        table_name: '',
        attributes: [] as Attribute[]
    });

    // --- Relation Form State ---
    const [relationForm, setRelationForm] = useState({
        from_module_id: '',
        to_module_id: '',
        foreign_key: '',
        display_column: 'name'
    });
    const [isSubmittingRelation, setIsSubmittingRelation] = useState(false);
    const [inspectModule, setInspectModule] = useState<any | null>(null);

    // Collect all active relations across modules (deduplicated by belongsTo)
    const activeRelations = useMemo(() => {
        const list: Array<{
            id: string;
            from_name: string;
            to_name: string;
            foreign_key: string;
            display_column?: string;
        }> = [];

        modules.forEach(m => {
            if (m.relations) {
                m.relations.forEach(r => {
                    if (r.type === 'belongsTo') {
                        list.push({
                            id: r.id,
                            from_name: m.name,
                            to_name: r.target_module_name,
                            foreign_key: r.foreign_key,
                            display_column: r.display_column
                        });
                    }
                });
            }
        });
        return list;
    }, [modules]);

    const handleModuleNameChange = (val: string) => {
        setData(prev => {
            const autoTable = val.trim() ? val.toLowerCase().replace(/\s+/g, '_') + 's' : '';
            return {
                ...prev,
                name: val,
                table_name: autoTable
            };
        });
    };

    const addAttribute = () => {
        setAttributes(prev => [...prev, { name: '', type: 'string', nullable: false }]);
    };

    const removeAttribute = (index: number) => {
        setAttributes(prev => prev.filter((_, i) => i !== index));
    };

    const updateAttribute = (index: number, field: keyof Attribute, value: any) => {
        setAttributes(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const generateModule = (e: React.FormEvent) => {
        e.preventDefault();

        const validAttributes = attributes.filter(attr => attr.name.trim() !== '');
        if (validAttributes.length === 0) {
            alert('Minimal harus ada 1 kolom atribut!');
            return;
        }

        const tableName = data.table_name || data.name.toLowerCase().replace(/\s+/g, '_') + 's';

        router.post(route('architect.modules.store', project.id), {
            name: data.name,
            table_name: tableName,
            attributes: validAttributes
        }, {
            onSuccess: () => {
                reset();
                setAttributes([
                    { name: 'name', type: 'string', nullable: false },
                    { name: 'price', type: 'currency', nullable: true },
                    { name: 'status', type: 'string', nullable: false },
                ]);
            }
        });
    };

    const deleteModule = (moduleId: string, moduleName: string) => {
        if (confirm(`Yakin ingin menghapus modul "${moduleName}"? Tabel fisik database akan didrop dari AWS RDS.`)) {
            router.delete(route('architect.modules.destroy', moduleId));
        }
    };

    const handleCreateRelation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!relationForm.from_module_id || !relationForm.to_module_id) {
            alert('Pilih kedua modul yang ingin dihubungkan!');
            return;
        }
        if (relationForm.from_module_id === relationForm.to_module_id) {
            alert('Modul asal dan modul tujuan tidak boleh sama!');
            return;
        }

        setIsSubmittingRelation(true);
        router.post(route('architect.relations.store', project.id), relationForm, {
            onSuccess: () => {
                setRelationForm({
                    from_module_id: '',
                    to_module_id: '',
                    foreign_key: '',
                    display_column: 'name'
                });
                setIsSubmittingRelation(false);
            },
            onError: () => setIsSubmittingRelation(false)
        });
    };

    const handleDeleteRelation = (relationId: string) => {
        if (confirm('Yakin ingin memutuskan relasi antar modul ini?')) {
            router.delete(route('architect.relations.destroy', [project.id, relationId]));
        }
    };

    const renderTypeBadge = (type: string) => {
        switch (type) {
            case 'currency':
                return <span className="text-emerald-700 font-bold">Rp</span>;
            case 'integer':
            case 'float':
                return <span className="text-amber-700 font-bold">#{type}</span>;
            case 'date':
                return <span className="text-sky-700 font-bold">@date</span>;
            case 'boolean':
                return <span className="text-indigo-700 font-bold">?bool</span>;
            case 'text':
                return <span className="text-purple-700 font-bold">¶text</span>;
            case 'relation':
                return <span className="text-rose-700 font-bold">↗relasi</span>;
            default:
                return <span className="text-[#c2410c] font-bold">str</span>;
        }
    };

    return (
        <ArchitectLayout title={`Schema & Modules — ${project.name}`}>
            <Head title={`Schema & Modules — ${project.name}`} />

            <div className="space-y-8">
                {/* Top Atelier Breadcrumbs & Action Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#101c36]/15">
                    <div>
                        <Link
                            href={route('architect.projects.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#64748b] hover:text-[#101c36] font-bold transition-colors mb-2"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Kembali ke Studio Proyek</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101c36] tracking-tight">
                                {project.name}
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                AWS RDS Active
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#475569] mt-1">
                            Atelier Arsitektur Skema Database, Pembuat Modul CRUD, & Injektor Relasi Eloquent.
                        </p>
                    </div>

                    {/* Quick Access CTAs */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <Link
                            href={`/app/${ownerHandle}/${projectSlug}/dashboard`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101c36] hover:bg-[#1a2d54] text-[#f6f4ee] text-xs font-mono font-bold transition-all shadow-sm"
                        >
                            <Eye className="w-4 h-4 text-emerald-400" />
                            <span>Buka Live App</span>
                        </Link>

                        <Link
                            href={route('architect.editor.canvas', project.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#101c36]/20 bg-white hover:bg-[#f6f4ee] text-xs font-mono font-bold text-[#101c36] transition-colors shadow-sm"
                        >
                            <Network className="w-4 h-4 text-[#c2410c]" />
                            <span>Visual Schema Flow</span>
                        </Link>

                        <a
                            href={route('architect.projects.export', project.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#101c36]/20 bg-white hover:bg-[#f6f4ee] text-xs font-mono font-bold text-[#101c36] transition-colors shadow-sm"
                            title="Unduh Codebase ZIP"
                        >
                            <Download className="w-4 h-4 text-[#64748b]" />
                            <span className="hidden sm:inline">ZIP</span>
                        </a>
                    </div>
                </div>

                {/* 2-Column Workbench */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Module Builder + Relation Builder (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Section A: New Module Form */}
                        <div className="bg-white rounded-2xl border border-[#101c36]/15 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[#101c36]/10 bg-[#fbfaf8]">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#c2410c] font-bold">
                                        Entity Generator
                                    </span>
                                    <span className="text-[11px] font-mono text-[#64748b]">
                                        Multi-Tenant Scoped
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-[#101c36] tracking-tight mt-1">
                                    Tambah Modul & Tabel Baru
                                </h2>
                                <p className="text-xs text-[#64748b] mt-0.5">
                                    Tentukan nama entitas dan struktur kolomnya. Sistem akan langsung mengeksekusi migrasi tabel fisik ke RDS MySQL.
                                </p>
                            </div>

                            <form onSubmit={generateModule}>
                                <div className="p-6 space-y-6">
                                    {/* Module Name & Table Name */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="font-mono text-xs font-bold text-[#101c36] block">
                                                Nama Modul (Singular) <span className="text-[#c2410c]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Doctor, Invoice, Room"
                                                value={data.name}
                                                onChange={e => handleModuleNameChange(e.target.value)}
                                                required
                                                className="w-full text-xs font-mono py-2 px-3 rounded-xl border border-slate-300 bg-white text-[#101c36] focus:outline-none focus:ring-1 focus:ring-[#c2410c] focus:border-[#c2410c] shadow-sm"
                                            />
                                            <span className="text-[10px] text-[#64748b] font-mono block">Format StudlyCase tanpa spasi</span>
                                            {errors.name && <p className="text-xs font-mono text-rose-600">{errors.name}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="font-mono text-xs font-bold text-[#101c36] block">
                                                Nama Tabel Database
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="doctors"
                                                value={data.table_name}
                                                onChange={e => setData('table_name', e.target.value)}
                                                className="w-full text-xs font-mono py-2 px-3 rounded-xl border border-slate-300 bg-[#fbfaf8] text-[#101c36] focus:outline-none focus:ring-1 focus:ring-[#c2410c] focus:border-[#c2410c] shadow-sm"
                                            />
                                            <span className="text-[10px] text-[#64748b] font-mono block">Otomatis jika dibiarkan kosong</span>
                                            {errors.table_name && <p className="text-xs font-mono text-rose-600">{errors.table_name}</p>}
                                        </div>
                                    </div>

                                    {/* Columns Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs font-bold text-[#101c36] uppercase tracking-wider">
                                                Struktur Kolom Database:
                                            </span>
                                            <button
                                                type="button"
                                                onClick={addAttribute}
                                                className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#c2410c] hover:underline"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Tambah Kolom
                                            </button>
                                        </div>

                                        {/* Built-in Columns Banner */}
                                        <div className="p-3 rounded-xl bg-[#f6f4ee] border border-[#101c36]/10 font-mono text-[11px] text-[#64748b] flex justify-between">
                                            <span>✓ id (UUID Primary Key)</span>
                                            <span>✓ project_id (Tenant Scope)</span>
                                            <span>✓ timestamps & soft_deletes</span>
                                        </div>

                                        {/* Dynamic Columns List */}
                                        <div className="space-y-2.5">
                                            {attributes.map((attr, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-[#fbfaf8] hover:bg-white transition-colors"
                                                >
                                                    {/* Column Name Input */}
                                                    <input
                                                        type="text"
                                                        placeholder="nama_kolom"
                                                        value={attr.name}
                                                        onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                                                        required
                                                        className="flex-1 min-w-[130px] text-xs font-mono py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-[#101c36] focus:outline-none focus:ring-1 focus:ring-[#101c36] focus:border-[#101c36]"
                                                    />

                                                    {/* Column Type Select with ample padding (no overlapping!) */}
                                                    <div className="relative w-36 shrink-0">
                                                        <select
                                                            value={attr.type}
                                                            onChange={(e) => updateAttribute(index, 'type', e.target.value)}
                                                            className="w-full text-xs py-1.5 pl-2.5 pr-8 rounded-lg border border-slate-300 bg-white text-[#c2410c] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#c2410c] focus:border-[#c2410c] cursor-pointer appearance-none shadow-sm"
                                                        >
                                                            <option value="string">string (teks)</option>
                                                            <option value="currency">currency (Rp)</option>
                                                            <option value="integer">integer (angka)</option>
                                                            <option value="float">float (desimal)</option>
                                                            <option value="date">date (tanggal)</option>
                                                            <option value="boolean">boolean (toggle)</option>
                                                            <option value="text">text (paragraf)</option>
                                                            <option value="relation">relation (FK ID)</option>
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                                            <ChevronDown className="w-3.5 h-3.5" />
                                                        </div>
                                                    </div>

                                                    {/* Nullable Toggle */}
                                                    <label className="flex items-center gap-1.5 text-[11px] font-mono text-[#64748b] cursor-pointer px-1.5 py-1 rounded select-none shrink-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={attr.nullable}
                                                            onChange={(e) => updateAttribute(index, 'nullable', e.target.checked)}
                                                            className="w-3.5 h-3.5 rounded border-slate-300 text-[#c2410c] focus:ring-[#c2410c]"
                                                        />
                                                        <span>Nullable</span>
                                                    </label>

                                                    {/* Delete Column Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttribute(index)}
                                                        disabled={attributes.length === 1}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                                        title="Hapus Kolom"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {errors.attributes && (
                                            <p className="text-xs font-mono text-rose-600">{errors.attributes}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Footer */}
                                <div className="p-6 border-t border-[#101c36]/10 bg-[#fbfaf8] flex items-center justify-between">
                                    <span className="text-[11px] font-mono text-[#64748b]">
                                        Tabel database akan langsung terbuat di RDS MySQL
                                    </span>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c2410c] hover:bg-[#9a3412] text-white font-mono text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Membangun Tabel di RDS...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Database className="w-4 h-4" />
                                                <span>Bangun & Aktifkan Modul</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Section B: Enterprise Relation Builder (Inspired by project-idp make:relation) */}
                        <div className="bg-white rounded-2xl border border-[#101c36]/15 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[#101c36]/10 bg-[#fbfaf8]">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-1">
                                        <ArrowRightLeft className="w-3 h-3" /> Relation Injector (Enterprise IDP Pattern)
                                    </span>
                                    <span className="text-[11px] font-mono text-[#64748b]">
                                        Eloquent AST + Foreign Key
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-[#101c36] tracking-tight mt-1">
                                    Hubungkan Relasi Antar Modul
                                </h3>
                                <p className="text-xs text-[#64748b] mt-0.5">
                                    Hubungkan relasi antar tabel (misal: <em>Appointment belongsTo Patient</em>). Sistem otomatis menyuntikkan foreign key di RDS dan method relasi di Model PHP.
                                </p>
                            </div>

                            <form onSubmit={handleCreateRelation} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="font-mono text-xs font-bold text-[#101c36] block">
                                            Modul Anak (Child / Asal) <span className="text-[#c2410c]">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={relationForm.from_module_id}
                                                onChange={e => {
                                                    const mId = e.target.value;
                                                    setRelationForm(prev => ({
                                                        ...prev,
                                                        from_module_id: mId
                                                    }));
                                                }}
                                                required
                                                className="w-full text-xs font-mono py-2 pl-3 pr-8 rounded-xl border border-slate-300 bg-white text-[#101c36] focus:outline-none focus:ring-1 focus:ring-[#c2410c] appearance-none"
                                            >
                                                <option value="">Pilih Modul Anak...</option>
                                                {modules.map(m => (
                                                    <option key={m.id} value={m.id}>{m.name} ({m.table_name})</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                                                <ChevronDown className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="font-mono text-xs font-bold text-[#101c36] block">
                                            Modul Induk (Parent / Tujuan) <span className="text-[#c2410c]">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={relationForm.to_module_id}
                                                onChange={e => {
                                                    const mId = e.target.value;
                                                    const targetMod = modules.find(m => m.id === mId);
                                                    const autoFk = targetMod ? `${targetMod.name.toLowerCase()}_id` : '';
                                                    setRelationForm(prev => ({
                                                        ...prev,
                                                        to_module_id: mId,
                                                        foreign_key: autoFk
                                                    }));
                                                }}
                                                required
                                                className="w-full text-xs font-mono py-2 pl-3 pr-8 rounded-xl border border-slate-300 bg-white text-[#101c36] focus:outline-none focus:ring-1 focus:ring-[#c2410c] appearance-none"
                                            >
                                                <option value="">Pilih Modul Induk...</option>
                                                {modules.map(m => (
                                                    <option key={m.id} value={m.id}>{m.name} ({m.table_name})</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                                                <ChevronDown className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="font-mono text-xs font-bold text-[#101c36] block">
                                            Nama Foreign Key
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="patient_id"
                                            value={relationForm.foreign_key}
                                            onChange={e => setRelationForm({ ...relationForm, foreign_key: e.target.value })}
                                            className="w-full text-xs font-mono py-2 px-3 rounded-xl border border-slate-300 bg-white text-[#101c36] focus:outline-none focus:ring-1 focus:ring-[#c2410c]"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="font-mono text-xs font-bold text-[#101c36] block">
                                            Kolom Tampilan Label
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="name / full_name / title"
                                            value={relationForm.display_column}
                                            onChange={e => setRelationForm({ ...relationForm, display_column: e.target.value })}
                                            className="w-full text-xs font-mono py-2 px-3 rounded-xl border border-slate-300 bg-white text-[#101c36] focus:outline-none focus:ring-1 focus:ring-[#c2410c]"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-between">
                                    <span className="text-[11px] font-mono text-slate-500">
                                        Otomatis inject belongsTo & hasMany
                                    </span>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingRelation || modules.length < 2}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101c36] hover:bg-[#1a2d54] text-[#f6f4ee] font-mono text-xs font-bold transition-all shadow-sm disabled:opacity-40"
                                    >
                                        {isSubmittingRelation ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Menyambungkan Relasi...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>Hubungkan Relasi (Inject Eloquent)</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Active Relations List */}
                            {activeRelations.length > 0 && (
                                <div className="p-6 border-t border-[#101c36]/10 bg-[#fbfaf8]">
                                    <h4 className="font-mono text-xs font-bold text-[#101c36] uppercase tracking-wider mb-3">
                                        Relasi Aktif ({activeRelations.length}):
                                    </h4>
                                    <div className="space-y-2">
                                        {activeRelations.map(rel => (
                                            <div
                                                key={rel.id}
                                                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-xs font-mono text-xs"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[#101c36]">
                                                        {rel.from_name}
                                                    </span>
                                                    <span className="text-[#c2410c] font-bold">--[belongsTo]--&gt;</span>
                                                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                                        {rel.to_name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        (FK: <code className="text-[#c2410c]">{rel.foreign_key}</code>)
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteRelation(rel.id)}
                                                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                    title="Putuskan Relasi"
                                                >
                                                    <Unlink className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Existing Modules Showcase (5 Cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-[#101c36] font-mono uppercase tracking-wider flex items-center gap-2">
                                <Layers className="w-4 h-4 text-[#c2410c]" />
                                <span>Modul Terpasang ({modules.length})</span>
                            </h2>
                            <span className="text-[10px] font-mono text-slate-400">AWS RDS Synced</span>
                        </div>

                        <div className="space-y-3">
                            {modules.map((mod) => {
                                const liveAppUrl = `/app/${ownerHandle}/${projectSlug}/${mod.table_name}`;

                                return (
                                    <div
                                        key={mod.id}
                                        className="bg-white rounded-2xl border border-[#101c36]/15 p-5 shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2.5">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-extrabold text-base text-[#101c36] tracking-tight">
                                                        {mod.name}
                                                    </h3>
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                                        RDS Aktif
                                                    </span>
                                                </div>
                                                <code className="text-xs font-mono text-[#c2410c] mt-0.5 block">
                                                    tabel: {mod.table_name}
                                                </code>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => deleteModule(mod.id, mod.name)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                                                title="Hapus Modul & Drop Tabel"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Attributes list */}
                                        <div className="space-y-1 mt-3 pt-3 border-t border-slate-100 font-mono text-xs">
                                            <span className="text-[10px] uppercase font-bold text-[#94a3b8] block">
                                                Kolom:
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                                {mod.attributes && mod.attributes.map((attr, aIdx) => (
                                                    <span
                                                        key={aIdx}
                                                        className="text-[10px] px-2 py-0.5 rounded bg-[#f6f4ee] border border-[#101c36]/10 text-[#334155]"
                                                    >
                                                        {attr.name} <span className="text-[#c2410c]">({attr.type})</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Relations badge */}
                                        {mod.relations && mod.relations.length > 0 && (
                                            <div className="mt-2.5 pt-2 border-t border-slate-100 font-mono text-[10px] flex items-center gap-1.5 flex-wrap">
                                                <span className="text-slate-400">Relasi:</span>
                                                {mod.relations.map((r, rIdx) => (
                                                    <span key={rIdx} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                                        {r.type} {r.target_module_name} ({r.foreign_key})
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Action buttons */}
                                        <div className="mt-4 pt-3 border-t border-[#101c36]/10 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setInspectModule(mod)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-mono font-bold transition-colors shadow-xs"
                                                title="Inspect Generated PSR-12 Code & AST"
                                            >
                                                <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                                                <span>Inspect Code</span>
                                            </button>

                                            <Link
                                                href={liveAppUrl}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#101c36] hover:bg-[#1a2d54] text-[#f6f4ee] text-xs font-mono font-bold transition-colors shadow-sm"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>Buka Data Live</span>
                                            </Link>
                                            <Link
                                                href={`${liveAppUrl}/create`}
                                                className="p-2 rounded-xl border border-[#101c36]/20 bg-white hover:bg-slate-50 text-[#c2410c] transition-colors"
                                                title="Tambah Data Baru"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}

                            {modules.length === 0 && (
                                <div className="bg-white rounded-2xl border border-dashed border-[#101c36]/20 p-8 text-center">
                                    <Database className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                    <h4 className="font-bold text-sm text-[#101c36]">Belum Ada Modul</h4>
                                    <p className="text-xs text-[#64748b] font-mono mt-1">
                                        Gunakan formulir di samping kiri untuk membuat modul dan tabel database pertama Anda.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enterprise In-Browser Code Inspector Modal */}
            {inspectModule && (
                <CodeInspectorModal
                    moduleId={inspectModule.id}
                    moduleName={inspectModule.name}
                    onClose={() => setInspectModule(null)}
                />
            )}
        </ArchitectLayout>
    );
}
