import React, { useState, useMemo, useEffect } from 'react';
import UserAppLayout from '@/Layouts/UserAppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Database,
    Table2,
    LayoutGrid,
    Kanban,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Loader2,
    Calendar,
    Hash,
    Type,
    FileText,
    ToggleLeft,
    DollarSign,
    Link2,
    CheckCircle2,
    XCircle,
    Info,
    Sparkles
} from 'lucide-react';

interface ModuleAttribute {
    name: string;
    type: string;
    nullable?: boolean;
}

interface DynamicIndexProps {
    project: any;
    module: {
        id: string;
        name: string;
        table_name: string;
        attributes: ModuleAttribute[];
        relations?: any[];
    };
    items: {
        data: any[];
        current_page: number;
        last_page: number;
        total: number;
        prev_page_url?: string;
        next_page_url?: string;
        links: Array<{ url?: string; label: string; active: boolean }>;
    };
    modules?: any[];
    relationLookups?: Record<string, { target_module: string; target_table: string; options: Array<{ id: string; label: string }> }>;
}

type ViewMode = 'table' | 'grid' | 'kanban';

export default function DynamicIndex({ project, module, items, modules = [], relationLookups = {} }: DynamicIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingId, setUpdatingId] = useState<string | number | null>(null);

    const ownerHandle = project?.owner?.handle || '';
    const projectSlug = project?.slug || '';
    const baseUrl = `/app/${ownerHandle}/${projectSlug}/${module.table_name}`;
    const storageKey = `architect_view_mode_${module.table_name}`;

    // View mode state with localStorage persistence
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(storageKey);
            if (saved === 'table' || saved === 'grid' || saved === 'kanban') {
                return saved as ViewMode;
            }
        }
        return 'table';
    });

    const handleViewChange = (mode: ViewMode) => {
        setViewMode(mode);
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, mode);
        }
    };

    const handleDelete = (id: string | number) => {
        if (confirm(`Yakin ingin menghapus data ${module.name} ini dari database fisik RDS?`)) {
            router.delete(`${baseUrl}/${id}`, {
                preserveScroll: true
            });
        }
    };

    // Quick partial status update for Kanban & Cards
    const handleMoveStatus = (itemId: string | number, nextStatus: string) => {
        if (!statusAttr) return;
        setUpdatingId(itemId);
        router.patch(
            `${baseUrl}/${itemId}`,
            { [statusAttr.name]: nextStatus },
            {
                preserveScroll: true,
                onFinish: () => setUpdatingId(null),
            }
        );
    };

    // Smart Attribute Inferences
    const titleAttr = useMemo(() => {
        const priority = ['name', 'nama', 'title', 'judul', 'brand_model', 'brand', 'model', 'full_name', 'username', 'code', 'kode'];
        for (const p of priority) {
            const found = module.attributes.find((a) => a.name.toLowerCase() === p);
            if (found) return found;
        }
        return module.attributes.find((a) => a.type === 'string' || a.type === 'text') || module.attributes[0];
    }, [module.attributes]);

    const statusAttr = useMemo(() => {
        const priority = ['status', 'stage', 'state', 'kondisi', 'kategori', 'category', 'type', 'tipe'];
        for (const p of priority) {
            const found = module.attributes.find((a) => a.name.toLowerCase() === p);
            if (found) return found;
        }
        return null;
    }, [module.attributes]);

    const priceAttr = useMemo(() => {
        const foundCurrency = module.attributes.find((a) => a.type === 'currency');
        if (foundCurrency) return foundCurrency;
        const priceNames = ['price', 'harga', 'rate', 'daily_rate', 'cost', 'biaya', 'total', 'amount', 'salary', 'gaji'];
        return module.attributes.find((a) => priceNames.includes(a.name.toLowerCase()));
    }, [module.attributes]);

    const secondaryAttrs = useMemo(() => {
        return module.attributes.filter(
            (a) => a.name !== titleAttr?.name && a.name !== statusAttr?.name
        );
    }, [module.attributes, titleAttr, statusAttr]);

    // Client-side quick filter
    const filteredData = useMemo(() => {
        if (!items?.data) return [];
        if (!searchQuery.trim()) return items.data;
        const q = searchQuery.toLowerCase();
        return items.data.filter((item) => {
            return Object.values(item).some((val) =>
                val !== null && val !== undefined && String(val).toLowerCase().includes(q)
            );
        });
    }, [items?.data, searchQuery]);

    // Kanban Lanes Determination
    const kanbanLanes = useMemo(() => {
        if (!statusAttr) return [];

        const existingValues = Array.from(
            new Set(
                (items?.data || [])
                    .map((item) => item[statusAttr.name])
                    .filter((val) => val !== null && val !== undefined && String(val).trim() !== '')
            )
        ).map(String);

        // Context-aware sensible defaults
        let defaults = ['Pending', 'Proses', 'Selesai'];
        const tableName = module.table_name.toLowerCase();
        if (
            tableName.includes('vehicle') ||
            tableName.includes('mobil') ||
            tableName.includes('car') ||
            tableName.includes('motor') ||
            tableName.includes('asset') ||
            tableName.includes('room')
        ) {
            defaults = ['Tersedia', 'Disewa', 'Perawatan'];
        } else if (
            tableName.includes('booking') ||
            tableName.includes('rental') ||
            tableName.includes('order') ||
            tableName.includes('pesanan') ||
            tableName.includes('transaksi')
        ) {
            defaults = ['Pending', 'Dikonfirmasi', 'Selesai', 'Batal'];
        } else if (
            tableName.includes('member') ||
            tableName.includes('user') ||
            tableName.includes('pelanggan') ||
            tableName.includes('customer')
        ) {
            defaults = ['Aktif', 'Menunggu', 'Non-Aktif'];
        }

        const merged = [...defaults];
        existingValues.forEach((val) => {
            if (!merged.some((m) => m.toLowerCase() === val.toLowerCase())) {
                merged.push(val);
            }
        });

        return merged;
    }, [statusAttr, items?.data, module.table_name]);

    const getStatusBadgeStyle = (statusVal: any) => {
        if (!statusVal) return { bg: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' };
        const s = String(statusVal).toLowerCase().trim();
        if (['available', 'tersedia', 'active', 'aktif', 'selesai', 'completed', 'confirmed', 'paid', 'sukses', 'lunas', 'published'].some((k) => s.includes(k))) {
            return {
                bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                dot: 'bg-emerald-500',
            };
        }
        if (['rented', 'disewa', 'in_progress', 'proses', 'ongoing', 'dipinjam', 'sedang disewa', 'booked', 'terisi'].some((k) => s.includes(k))) {
            return {
                bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
                dot: 'bg-sky-500',
            };
        }
        if (['pending', 'menunggu', 'draft', 'unpaid', 'tertunda', 'review'].some((k) => s.includes(k))) {
            return {
                bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                dot: 'bg-amber-500',
            };
        }
        if (['maintenance', 'perawatan', 'rusak', 'batal', 'cancelled', 'inactive', 'nonaktif', 'rejected', 'expired'].some((k) => s.includes(k))) {
            return {
                bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
                dot: 'bg-rose-500',
            };
        }
        return {
            bg: 'bg-primary/10 text-primary border-primary/20',
            dot: 'bg-primary',
        };
    };

    const renderTypeIcon = (type: string) => {
        switch (type) {
            case 'currency':
                return <DollarSign className="w-3 h-3 text-emerald-500" />;
            case 'relation':
                return <Link2 className="w-3 h-3 text-blue-500" />;
            case 'integer':
            case 'float':
                return <Hash className="w-3 h-3 text-amber-500" />;
            case 'date':
                return <Calendar className="w-3 h-3 text-sky-500" />;
            case 'boolean':
                return <ToggleLeft className="w-3 h-3 text-emerald-500" />;
            case 'text':
                return <FileText className="w-3 h-3 text-purple-500" />;
            default:
                return <Type className="w-3 h-3 text-primary" />;
        }
    };

    const renderCellValue = (value: any, type: string, colName: string) => {
        if (value === null || value === undefined || value === '') {
            return <span className="text-muted-foreground/60 font-mono text-xs italic">-</span>;
        }

        // Relation Foreign Key Lookup
        if (relationLookups && relationLookups[colName]) {
            const lookup = relationLookups[colName];
            const matched = lookup.options.find((o) => o.id === value);
            if (matched) {
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs">
                        <Link2 className="w-3 h-3 text-blue-500" />
                        <span>{matched.label}</span>
                    </span>
                );
            }
            return (
                <span className="text-xs font-mono text-muted-foreground">
                    ID: {String(value).slice(0, 8)}...
                </span>
            );
        }

        if (type === 'currency') {
            return (
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Rp {Number(value).toLocaleString('id-ID')}
                </span>
            );
        }

        if (type === 'boolean') {
            const isTrue = Boolean(value) && value !== '0' && value !== 0;
            return isTrue ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> True
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-muted text-muted-foreground border border-border">
                    <XCircle className="w-3 h-3 text-muted-foreground" /> False
                </span>
            );
        }

        if (type === 'date') {
            try {
                const date = new Date(value);
                return (
                    <span className="font-mono text-xs text-foreground font-medium">
                        {date.toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                );
            } catch {
                return <span className="font-mono text-xs text-foreground">{String(value)}</span>;
            }
        }

        if (type === 'integer' || type === 'float') {
            return (
                <span className="font-mono text-xs font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border">
                    {Number(value).toLocaleString()}
                </span>
            );
        }

        if (type === 'text') {
            const str = String(value);
            return (
                <span className="text-xs text-muted-foreground line-clamp-1 max-w-xs" title={str}>
                    {str}
                </span>
            );
        }

        return <span className="text-xs font-medium text-foreground">{String(value)}</span>;
    };

    const formatLabel = (name: string) => {
        return name
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // ==========================================
    // 1. RENDER TABLE VIEW
    // ==========================================
    const renderTableView = () => (
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-muted/40">
                            <th className="py-3 px-4 font-mono text-[10px] uppercase font-bold text-muted-foreground tracking-wider w-12 text-center">
                                #
                            </th>
                            {module.attributes.map((attr) => (
                                <th
                                    key={attr.name}
                                    className="py-3 px-4 font-mono text-[10px] uppercase font-bold text-foreground tracking-wider"
                                >
                                    <div className="flex items-center gap-1.5">
                                        {renderTypeIcon(attr.type)}
                                        <span>{formatLabel(attr.name)}</span>
                                        <span className="text-[9px] text-muted-foreground lowercase font-normal">
                                            ({attr.type})
                                        </span>
                                    </div>
                                </th>
                            ))}
                            <th className="py-3 px-4 font-mono text-[10px] uppercase font-bold text-muted-foreground tracking-wider text-right w-28">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredData.length > 0 ? (
                            filteredData.map((item: any, idx: number) => (
                                <tr key={item.id || idx} className="hover:bg-muted/40 transition-colors group">
                                    <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground text-center">
                                        {idx + 1 + ((items?.current_page || 1) - 1) * 10}
                                    </td>
                                    {module.attributes.map((attr) => (
                                        <td key={attr.name} className="py-3.5 px-4 text-xs">
                                            {attr.name === statusAttr?.name ? (
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                                                        getStatusBadgeStyle(item[attr.name]).bg
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${
                                                            getStatusBadgeStyle(item[attr.name]).dot
                                                        }`}
                                                    />
                                                    <span>{String(item[attr.name] || 'N/A')}</span>
                                                </span>
                                            ) : (
                                                renderCellValue(item[attr.name], attr.type, attr.name)
                                            )}
                                        </td>
                                    ))}
                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`${baseUrl}/${item.id}/edit`}
                                                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                title="Edit Data"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                                                title="Hapus Data"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={module.attributes.length + 2} className="py-16 px-4 text-center">
                                    {renderEmptyState()}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {renderPagination()}
        </div>
    );

    // ==========================================
    // 2. RENDER GRID / GALLERY CARD VIEW
    // ==========================================
    const renderGridView = () => (
        <div className="space-y-6">
            {filteredData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredData.map((item: any, idx: number) => {
                        const titleVal = titleAttr ? item[titleAttr.name] : `Item #${idx + 1}`;
                        const statusVal = statusAttr ? item[statusAttr.name] : null;
                        const statusStyle = getStatusBadgeStyle(statusVal);
                        const isUpdating = updatingId === item.id;

                        return (
                            <div
                                key={item.id || idx}
                                className="bg-card text-card-foreground rounded-2xl border border-border p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between group relative overflow-hidden"
                            >
                                {isUpdating && (
                                    <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center z-10">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    </div>
                                )}

                                {/* Card Header */}
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs font-mono shrink-0">
                                                {String(titleVal || '#').slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-extrabold text-sm sm:text-base text-foreground truncate tracking-tight" title={String(titleVal)}>
                                                    {String(titleVal || '-')}
                                                </h3>
                                                <p className="text-[10px] font-mono text-muted-foreground">
                                                    ID: {String(item.id || idx + 1).slice(0, 8)}...
                                                </p>
                                            </div>
                                        </div>

                                        {statusAttr && (
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border shrink-0 ${statusStyle.bg}`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                                <span>{String(statusVal || 'N/A')}</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Prominent Price Tag banner if available */}
                                    {priceAttr && (
                                        <div className="my-3 px-3.5 py-2 rounded-xl bg-muted/40 border border-border/70 flex items-center justify-between">
                                            <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                                                {formatLabel(priceAttr.name)}
                                            </span>
                                            <span className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                                                {renderCellValue(item[priceAttr.name], priceAttr.type, priceAttr.name)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Secondary Attributes List */}
                                    <div className="space-y-1.5 my-3 text-xs divide-y divide-border/30">
                                        {secondaryAttrs
                                            .filter((a) => a.name !== priceAttr?.name)
                                            .slice(0, 4)
                                            .map((attr) => (
                                                <div key={attr.name} className="flex items-center justify-between gap-2 pt-1.5 first:pt-0">
                                                    <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] shrink-0 font-mono">
                                                        {renderTypeIcon(attr.type)}
                                                        <span>{formatLabel(attr.name)}</span>
                                                    </span>
                                                    <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                                                        {renderCellValue(item[attr.name], attr.type, attr.name)}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Card Footer & Quick Actions */}
                                <div className="pt-3.5 mt-2 border-t border-border flex items-center justify-between gap-2">
                                    {/* Quick Status Dropdown */}
                                    {statusAttr && kanbanLanes.length > 0 ? (
                                        <div className="relative">
                                            <select
                                                value={statusVal || ''}
                                                onChange={(e) => handleMoveStatus(item.id, e.target.value)}
                                                disabled={isUpdating}
                                                className="text-[11px] font-mono py-1.5 pl-2.5 pr-7 rounded-lg border border-border bg-muted/50 text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring appearance-none hover:bg-muted transition-colors"
                                                title="Ubah status item ini"
                                            >
                                                {kanbanLanes.map((lane) => (
                                                    <option key={lane} value={lane}>
                                                        {lane}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-mono text-muted-foreground">Aktif</span>
                                    )}

                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`${baseUrl}/${item.id}/edit`}
                                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                            title="Edit Data"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                                            title="Hapus Data"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-12 text-center">
                    {renderEmptyState()}
                </div>
            )}
            {renderPagination()}
        </div>
    );

    // ==========================================
    // 3. RENDER KANBAN PIPELINE VIEW
    // ==========================================
    const renderKanbanView = () => {
        if (!statusAttr) {
            return (
                <div className="bg-card text-card-foreground rounded-2xl border border-border p-8 shadow-sm text-center max-w-xl mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                        <Info className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-foreground">
                            Kolom Status Belum Terdefinisi
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            Tampilan <strong>Kanban Pipeline</strong> memerlukan atribut status (misal kolom:{' '}
                            <code className="text-primary font-mono font-bold">status</code>,{' '}
                            <code className="text-primary font-mono font-bold">stage</code>, atau{' '}
                            <code className="text-primary font-mono font-bold">kategori</code>) untuk membagi data ke dalam jalur tahapan (lanes).
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <Link
                            href={`/app/${ownerHandle}/${projectSlug}/builder/modules`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold hover:bg-primary/90 transition-all shadow-sm"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Buka Schema Editor</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => handleViewChange('grid')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted/60 text-foreground font-mono text-xs font-bold hover:bg-muted transition-all"
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span>Beralih ke Galeri Grid</span>
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {/* Board Container */}
                <div className="flex gap-5 overflow-x-auto pb-6 pt-1 items-start min-h-[520px] scrollbar-thin">
                    {kanbanLanes.map((lane, laneIdx) => {
                        const laneItems = filteredData.filter(
                            (item) => String(item[statusAttr.name] || '').toLowerCase() === lane.toLowerCase()
                        );
                        const laneStyle = getStatusBadgeStyle(lane);

                        return (
                            <div
                                key={lane}
                                className="w-80 min-w-[320px] max-w-[320px] shrink-0 flex flex-col rounded-2xl bg-muted/30 border border-border/80 shadow-xs overflow-hidden"
                            >
                                {/* Column Header */}
                                <div className="p-3.5 border-b border-border bg-card/60 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${laneStyle.dot}`} />
                                        <h4 className="font-extrabold text-xs uppercase tracking-wide text-foreground truncate">
                                            {lane}
                                        </h4>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-muted text-muted-foreground border border-border">
                                            {laneItems.length}
                                        </span>
                                    </div>

                                    <Link
                                        href={`${baseUrl}/create?${statusAttr.name}=${encodeURIComponent(lane)}`}
                                        className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                        title={`+ Tambah item ke status "${lane}"`}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Lane Card List */}
                                <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[640px]">
                                    {laneItems.length > 0 ? (
                                        laneItems.map((item, itemIdx) => {
                                            const titleVal = titleAttr ? item[titleAttr.name] : `Item #${itemIdx + 1}`;
                                            const isUpdating = updatingId === item.id;

                                            return (
                                                <div
                                                    key={item.id || itemIdx}
                                                    className="bg-card text-card-foreground rounded-xl border border-border p-3.5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all space-y-2.5 relative group"
                                                >
                                                    {isUpdating && (
                                                        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center rounded-xl z-10">
                                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                                        </div>
                                                    )}

                                                    {/* Card Top Title & Quick Actions */}
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h5 className="font-extrabold text-xs text-foreground tracking-tight leading-snug line-clamp-2">
                                                            {String(titleVal || '-')}
                                                        </h5>
                                                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
                                                            <Link
                                                                href={`${baseUrl}/${item.id}/edit`}
                                                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="w-3 h-3" />
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(item.id)}
                                                                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Price badge if present */}
                                                    {priceAttr && item[priceAttr.name] !== undefined && (
                                                        <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                                                            {renderCellValue(item[priceAttr.name], priceAttr.type, priceAttr.name)}
                                                        </div>
                                                    )}

                                                    {/* Secondary fields (up to 2) */}
                                                    <div className="space-y-1 text-[11px] text-muted-foreground font-mono">
                                                        {secondaryAttrs
                                                            .filter((a) => a.name !== priceAttr?.name)
                                                            .slice(0, 2)
                                                            .map((attr) => (
                                                                <div key={attr.name} className="flex items-center justify-between gap-1.5">
                                                                    <span className="truncate flex items-center gap-1 text-[10px]">
                                                                        {renderTypeIcon(attr.type)}
                                                                        <span>{formatLabel(attr.name)}:</span>
                                                                    </span>
                                                                    <span className="text-foreground font-medium truncate max-w-[120px] text-right">
                                                                        {renderCellValue(item[attr.name], attr.type, attr.name)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                    </div>

                                                    {/* Quick Pipeline Status Transitions */}
                                                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                                                        <span className="text-[10px] font-mono text-muted-foreground">Pindah:</span>
                                                        <div className="flex items-center gap-1">
                                                            {laneIdx > 0 && (
                                                                <button
                                                                    type="button"
                                                                    disabled={isUpdating}
                                                                    onClick={() => handleMoveStatus(item.id, kanbanLanes[laneIdx - 1])}
                                                                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-muted hover:bg-primary hover:text-primary-foreground border border-border transition-colors flex items-center gap-0.5"
                                                                    title={`Mundur ke "${kanbanLanes[laneIdx - 1]}"`}
                                                                >
                                                                    <ChevronLeft className="w-3 h-3" />
                                                                    <span>{kanbanLanes[laneIdx - 1]}</span>
                                                                </button>
                                                            )}
                                                            {laneIdx < kanbanLanes.length - 1 && (
                                                                <button
                                                                    type="button"
                                                                    disabled={isUpdating}
                                                                    onClick={() => handleMoveStatus(item.id, kanbanLanes[laneIdx + 1])}
                                                                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-muted hover:bg-primary hover:text-primary-foreground border border-border transition-colors flex items-center gap-0.5"
                                                                    title={`Maju ke "${kanbanLanes[laneIdx + 1]}"`}
                                                                >
                                                                    <span>{kanbanLanes[laneIdx + 1]}</span>
                                                                    <ChevronRight className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-10 px-3 border border-dashed border-border/80 rounded-xl text-center space-y-2 bg-card/20">
                                            <p className="text-[11px] font-mono text-muted-foreground">
                                                Tidak ada data di status ini.
                                            </p>
                                            <Link
                                                href={`${baseUrl}/create?${statusAttr.name}=${encodeURIComponent(lane)}`}
                                                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-primary hover:underline"
                                            >
                                                <Plus className="w-3 h-3" />
                                                <span>+ Tambah Baru</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Shared Empty State
    const renderEmptyState = () => (
        <div className="max-w-sm mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-primary mb-3 shadow-inner">
                <Database className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-foreground">
                {searchQuery ? 'Data Tidak Ditemukan' : 'Belum Ada Data Tersimpan'}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
                {searchQuery
                    ? `Tidak ada record yang cocok dengan kata kunci "${searchQuery}".`
                    : `Tabel fisik "${module.table_name}" sudah aktif di AWS RDS. Silakan masukkan baris pertama.`}
            </p>
            {!searchQuery && (
                <Link
                    href={`${baseUrl}/create`}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-bold transition-all shadow-sm"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Data Pertama</span>
                </Link>
            )}
        </div>
    );

    // Shared Pagination Bar
    const renderPagination = () => {
        if (!items?.last_page || items.last_page <= 1) return null;
        return (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border bg-muted/30 gap-3 rounded-b-2xl">
                <span className="text-xs font-mono text-muted-foreground">
                    Halaman <strong className="text-foreground">{items.current_page}</strong> dari{' '}
                    <strong className="text-foreground">{items.last_page}</strong> ({items.total} total)
                </span>
                <div className="flex items-center gap-1">
                    {items.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                link.active
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : link.url
                                    ? 'text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                                    : 'text-muted-foreground/30 pointer-events-none'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <UserAppLayout project={project} modules={modules} title={`${module.name} List`}>
            <Head title={`${module.name} - ${project.name}`} />

            <div className="space-y-6">
                {/* Header Banner */}
                <div className="bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
                            <span className="text-muted-foreground">Tabel MySQL:</span>
                            <code className="px-2 py-0.5 rounded bg-muted text-primary font-bold border border-border">
                                {module.table_name}
                            </code>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                                {items?.total ?? 0} Record Tersimpan
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                            Master Data {module.name}
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Kelola data dinamis pada tabel database fisik RDS untuk modul {module.name}.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href={`${baseUrl}/create`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-bold transition-all shadow-sm hover:shadow"
                        >
                            <Plus className="w-4 h-4" />
                            <span>+ Tambah {module.name}</span>
                        </Link>
                    </div>
                </div>

                {/* Filter & View Switcher Bar */}
                <div className="bg-card text-card-foreground rounded-xl border border-border p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Cari data ${module.name}...`}
                            className="w-full text-xs font-mono pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                        />
                    </div>

                    {/* View Switcher Controls */}
                    <div className="flex items-center justify-between w-full md:w-auto gap-3">
                        <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                            Tampilan:
                        </span>
                        <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border gap-1 w-full sm:w-auto justify-center">
                            <button
                                type="button"
                                onClick={() => handleViewChange('table')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                    viewMode === 'table'
                                        ? 'bg-card text-foreground shadow-xs border border-border/60'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                                }`}
                                title="Tampilan Tabel Spreadsheet"
                            >
                                <Table2 className="w-3.5 h-3.5 text-primary" />
                                <span>Tabel</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleViewChange('grid')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-card text-foreground shadow-xs border border-border/60'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                                }`}
                                title="Tampilan Galeri Card Grid"
                            >
                                <LayoutGrid className="w-3.5 h-3.5 text-primary" />
                                <span>Galeri Grid</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleViewChange('kanban')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                    viewMode === 'kanban'
                                        ? 'bg-card text-foreground shadow-xs border border-border/60'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                                }`}
                                title="Tampilan Kanban Pipeline Board"
                            >
                                <Kanban className="w-3.5 h-3.5 text-primary" />
                                <span>Kanban Board</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Dynamic View Content */}
                {viewMode === 'table' && renderTableView()}
                {viewMode === 'grid' && renderGridView()}
                {viewMode === 'kanban' && renderKanbanView()}
            </div>
        </UserAppLayout>
    );
}
