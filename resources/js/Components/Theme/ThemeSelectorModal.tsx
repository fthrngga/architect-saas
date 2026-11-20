import React, { useState, useEffect, useMemo, useCallback, useDeferredValue } from 'react';
import axios from 'axios';
import {
    X,
    Palette,
    Check,
    Download,
    ExternalLink,
    Sparkles,
    Search,
    Sun,
    Moon,
    Laptop,
    CheckCircle2
} from 'lucide-react';
import { ProjectThemeScope, ThemeDefinition } from './ThemeEngine';

interface ThemeSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any;
    onThemeUpdated?: (newTheme: ThemeDefinition) => void;
}

// Memoized theme card item to eliminate redundant re-renders of the 43 theme cards
interface ThemeCardItemProps {
    theme: ThemeDefinition;
    isSelected: boolean;
    onSelect: (theme: ThemeDefinition) => void;
}

const ThemeCardItem = React.memo(function ThemeCardItem({ theme, isSelected, onSelect }: ThemeCardItemProps) {
    return (
        <div
            onClick={() => onSelect(theme)}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-colors duration-150 relative ${
                isSelected
                    ? 'border-[#ea580c] bg-orange-950/30 shadow-md ring-1 ring-[#ea580c]'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-white">
                    {theme.name}
                </span>
                {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-[#ea580c] text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                )}
            </div>

            <p className="text-[11px] text-slate-400 line-clamp-1 mb-3 font-sans">
                {theme.description}
            </p>

            <div className="flex items-center gap-1.5">
                {(theme.swatches || []).map((color, cIdx) => (
                    <span
                        key={cIdx}
                        className="w-5 h-5 rounded-md border border-white/15 shadow-2xs"
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
                <span className="ml-auto text-[10px] font-mono text-slate-400 bg-black/40 px-1.5 py-0.5 rounded">
                    r: {theme.radius || '0.5rem'}
                </span>
            </div>
        </div>
    );
});

export default function ThemeSelectorModal({
    isOpen,
    onClose,
    project,
    onThemeUpdated
}: ThemeSelectorModalProps) {
    const [themesList, setThemesList] = useState<ThemeDefinition[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<ThemeDefinition | null>(null);
    const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
    const [activeTab, setActiveTab] = useState<'gallery' | 'import'>('gallery');
    const [searchFilter, setSearchFilter] = useState('');
    const [customCss, setCustomCss] = useState('');
    const [customUrl, setCustomUrl] = useState('');
    const [fetchingUrl, setFetchingUrl] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successNotice, setSuccessNotice] = useState<string | null>(null);
    const [errorNotice, setErrorNotice] = useState<string | null>(null);

    // Defer search filter and preview theme to keep input and click responses at 60fps
    const deferredSearch = useDeferredValue(searchFilter);
    const deferredPreviewTheme = useDeferredValue(selectedTheme);

    // Fetch available themes & current project theme with memory cache
    useEffect(() => {
        if (!isOpen || !project?.id) return;
        if (themesList.length > 0) return; // Prevent repeated refetching

        axios
            .get(`/projects/${project.id}/themes`)
            .then((res) => {
                const fetched = res.data.themes || [];
                setThemesList(fetched);
                if (!selectedTheme) {
                    const current = res.data.active_theme || (fetched.length > 0 ? fetched[0] : null);
                    setSelectedTheme(current);
                }
            })
            .catch(() => {
                // Fallback: load default if endpoint fails
            });
    }, [isOpen, project?.id, themesList.length, selectedTheme]);

    const filteredThemes = useMemo(() => {
        if (!deferredSearch.trim()) return themesList;
        const q = deferredSearch.toLowerCase();
        return themesList.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                (t.description && t.description.toLowerCase().includes(q))
        );
    }, [themesList, deferredSearch]);

    const handleSelectPreset = useCallback((theme: ThemeDefinition) => {
        setSelectedTheme(theme);
        setErrorNotice(null);
    }, []);

    const handleRadiusChange = (radiusValue: string) => {
        if (!selectedTheme) return;
        const updated = {
            ...selectedTheme,
            radius: radiusValue,
            light: { ...selectedTheme.light, '--radius': radiusValue },
            dark: { ...selectedTheme.dark, '--radius': radiusValue }
        };
        setSelectedTheme(updated);
    };

    // Parse pasted tweakcn CSS on the fly in browser
    const handleParsePastedCss = () => {
        if (!customCss.trim()) {
            setErrorNotice('Silakan tempel kode CSS dari tweakcn terlebih dahulu.');
            return;
        }

        try {
            const lightVars: Record<string, string> = {};
            const darkVars: Record<string, string> = {};

            const rootMatch = customCss.match(/:root\s*\{([^}]+)\}/s);
            if (rootMatch) {
                rootMatch[1].split(';').forEach((line) => {
                    const [k, v] = line.split(':');
                    if (k && v && k.trim().startsWith('--')) {
                        lightVars[k.trim()] = v.trim();
                    }
                });
            }

            const darkMatch = customCss.match(/\.dark\s*\{([^}]+)\}/s);
            if (darkMatch) {
                darkMatch[1].split(';').forEach((line) => {
                    const [k, v] = line.split(':');
                    if (k && v && k.trim().startsWith('--')) {
                        darkVars[k.trim()] = v.trim();
                    }
                });
            }

            const detectedRadius = lightVars['--radius'] || '0.5rem';
            let fontName = 'Plus Jakarta Sans';
            if (lightVars['--font-sans']) {
                fontName = lightVars['--font-sans'].replace(/["'\,]|sans-serif/g, '').trim();
            }

            const customParsed: ThemeDefinition = {
                id: `custom-${Date.now()}`,
                name: 'Custom Tweakcn Theme',
                description: 'Tema kustom hasil impor CSS tweakcn.',
                fontSans: fontName,
                googleFontUrl: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600;700&display=swap`,
                radius: detectedRadius,
                swatches: [
                    lightVars['--background'] || '#ffffff',
                    lightVars['--primary'] || '#000000',
                    lightVars['--card'] || '#f8fafc',
                    lightVars['--accent'] || '#3b82f6'
                ],
                light: lightVars,
                dark: Object.keys(darkVars).length > 0 ? darkVars : lightVars,
                isCustom: true,
                rawCss: customCss
            };

            setSelectedTheme(customParsed);
            setSuccessNotice('Kode CSS tweakcn berhasil diproses & diterapkan ke pratinjau!');
            setErrorNotice(null);
            setTimeout(() => setSuccessNotice(null), 3000);
        } catch (err: any) {
            setErrorNotice('Gagal membaca format CSS tweakcn. Pastikan menyalin blok :root dan .dark.');
        }
    };

    const triggerRemoteFetch = async (urlOrSlug: string) => {
        if (!project?.id || !urlOrSlug.trim()) return;
        setFetchingUrl(true);
        setErrorNotice(null);
        try {
            const res = await axios.post(`/projects/${project.id}/theme`, {
                custom_url: urlOrSlug.trim()
            });
            if (res.data.success && res.data.theme) {
                setSelectedTheme(res.data.theme);
                setSuccessNotice(`Tema "${res.data.theme.name}" berhasil diimpor langsung dari tweakcn!`);
                if (onThemeUpdated) {
                    onThemeUpdated(res.data.theme);
                }
                window.dispatchEvent(
                    new CustomEvent('architect-theme-applied', {
                        detail: res.data.theme
                    })
                );
                setTimeout(() => setSuccessNotice(null), 3000);
            }
        } catch (err: any) {
            setErrorNotice('Gagal mengunduh tema dari URL / slug tersebut. Pastikan slug atau link valid.');
        } finally {
            setFetchingUrl(false);
        }
    };

    const handleSaveTheme = async () => {
        if (!project?.id || !selectedTheme) return;
        setSaving(true);
        setErrorNotice(null);

        try {
            const payload: any = {
                theme_id: selectedTheme.id,
                radius: selectedTheme.radius
            };

            if (selectedTheme.isCustom && selectedTheme.rawCss) {
                payload.custom_css = selectedTheme.rawCss;
            } else if (customUrl.trim()) {
                payload.custom_url = customUrl.trim();
            }

            const response = await axios.post(`/projects/${project.id}/theme`, payload);
            if (response.data.success) {
                setSuccessNotice('Tema antarmuka berhasil disimpan untuk proyek ini!');
                if (onThemeUpdated) {
                    onThemeUpdated(response.data.theme || selectedTheme);
                }
                // Dispatch event so any open live previews update immediately
                window.dispatchEvent(
                    new CustomEvent('architect-theme-applied', {
                        detail: response.data.theme || selectedTheme
                    })
                );
                setTimeout(() => {
                    setSuccessNotice(null);
                    onClose();
                }, 1000);
            }
        } catch (err: any) {
            setErrorNotice(err.response?.data?.message || 'Gagal menyimpan tema proyek.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 font-sans">
            <div className="bg-[#0e172a] border border-white/15 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden">
                {/* Modal Top Header */}
                <div className="px-6 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between bg-[#0a0f1d]/90">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#f97316] flex items-center justify-center border border-orange-500/30">
                            <Palette className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-poster text-xl tracking-wide text-white">
                                UI Theme & Design Tokens (Tweakcn Integration)
                            </h3>
                            <p className="text-xs text-slate-400 font-mono">
                                Personalisasi warna, font, dan sudut antarmuka proyek agar tidak monoton.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Tab Switcher */}
                        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
                            <button
                                onClick={() => setActiveTab('gallery')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    activeTab === 'gallery'
                                        ? 'bg-[#ea580c] text-white font-semibold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Galeri Tema
                            </button>
                            <button
                                onClick={() => setActiveTab('import')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    activeTab === 'import'
                                        ? 'bg-[#ea580c] text-white font-semibold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Import dari Tweakcn
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors ml-2"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                {successNotice && (
                    <div className="px-6 py-2 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{successNotice}</span>
                    </div>
                )}
                {errorNotice && (
                    <div className="px-6 py-2 bg-rose-500/20 border-b border-rose-500/30 text-rose-300 text-xs font-mono">
                        {errorNotice}
                    </div>
                )}

                {/* Main Content Body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
                    {/* Left Column: Theme Picker / Importer */}
                    <div className="lg:col-span-7 p-6 border-r border-white/10 overflow-y-auto max-h-[62vh] space-y-5 custom-tabs-scrollbar">
                        {activeTab === 'gallery' ? (
                            <>
                                {/* Search Filter */}
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Cari tema (contoh: amber, doom, catppuccin, emerald)..."
                                        value={searchFilter}
                                        onChange={(e) => setSearchFilter(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ea580c] font-mono"
                                    />
                                </div>

                                {/* Themes Grid with React.memo cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {filteredThemes.map((theme) => (
                                        <ThemeCardItem
                                            key={theme.id}
                                            theme={theme}
                                            isSelected={selectedTheme?.id === theme.id}
                                            onSelect={handleSelectPreset}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            /* Import from Tweakcn Tab */
                            <div className="space-y-4 font-sans text-xs">
                                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-white">Rancang di Tweakcn (43+ Pilihan)</div>
                                        <div className="text-slate-400 text-[11px]">
                                            Eksplorasi dan salin link tema atau kode CSS langsung dari tweakcn.com
                                        </div>
                                    </div>
                                    <a
                                        href="https://tweakcn.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono flex items-center gap-1.5 transition-colors"
                                    >
                                        <span>Buka Tweakcn</span>
                                        <ExternalLink className="w-3 h-3 text-[#f97316]" />
                                    </a>
                                </div>

                                {/* Option A: URL or CLI command or Slug */}
                                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                                    <label className="block font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
                                        Metode 1: Tempel Link / Perintah Registry Tweakcn
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={customUrl}
                                            onChange={(e) => setCustomUrl(e.target.value)}
                                            placeholder="Contoh: https://tweakcn.com/r/themes/doom-64.json atau doom-64"
                                            className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#ea580c]"
                                        />
                                        <button
                                            type="button"
                                            disabled={fetchingUrl || !customUrl.trim()}
                                            onClick={() => triggerRemoteFetch(customUrl)}
                                            className="px-3.5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 text-white font-mono font-semibold text-xs flex items-center gap-1.5 shrink-0 shadow-sm"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>{fetchingUrl ? 'Mengunduh...' : 'Ambil Tema'}</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                        <span className="text-[10px] text-slate-400 font-mono">Pintasan Cepat:</span>
                                        {['doom-64', 'catppuccin', 'bubblegum', 'caffeine', 'candyland', 'claymorphism'].map((slug) => (
                                            <button
                                                key={slug}
                                                type="button"
                                                onClick={() => {
                                                    setCustomUrl(slug);
                                                    triggerRemoteFetch(slug);
                                                }}
                                                className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-mono text-slate-300 hover:text-[#f97316] transition-colors"
                                            >
                                                +{slug}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Option B: Paste Raw CSS */}
                                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                                    <label className="block font-mono text-xs text-slate-300 font-bold uppercase tracking-wider">
                                        Metode 2: Tempel Kode CSS Mentah (:root & .dark):
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={customCss}
                                        onChange={(e) => setCustomCss(e.target.value)}
                                        placeholder={`@import "tailwindcss";\n:root {\n  --background: oklch(0.8452 0 0);\n  --primary: oklch(0.5016 0.1887 27.4816);\n}\n.dark {\n  --background: oklch(0.2178 0 0);\n}`}
                                        className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#ea580c] custom-code-scrollbar"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleParsePastedCss}
                                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                        <span>Proses & Terapkan Kode CSS</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Micro-Adjustments (Radius Slider) */}
                        <div className="pt-4 border-t border-white/10 space-y-2.5">
                            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                                Gaya Sudut (Border Radius):
                            </label>
                            <div className="grid grid-cols-5 gap-2 font-mono text-xs">
                                {[
                                    { label: '0px (Sharp)', value: '0px' },
                                    { label: '4px (Subtle)', value: '0.25rem' },
                                    { label: '8px (Modern)', value: '0.5rem' },
                                    { label: '12px (Smooth)', value: '0.75rem' },
                                    { label: 'Pill (Round)', value: '9999px' },
                                ].map((rad) => (
                                    <button
                                        key={rad.value}
                                        type="button"
                                        onClick={() => handleRadiusChange(rad.value)}
                                        className={`px-2 py-1.5 rounded-lg border text-center transition-all ${
                                            selectedTheme?.radius === rad.value
                                                ? 'bg-[#ea580c] text-white border-[#ea580c] font-semibold'
                                                : 'bg-black/30 text-slate-400 hover:text-white border-white/10'
                                        }`}
                                    >
                                        {rad.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Real-Time Live Component Preview Scope */}
                    <div className="lg:col-span-5 p-6 bg-black/30 flex flex-col justify-between overflow-y-auto max-h-[62vh] space-y-5 custom-tabs-scrollbar">
                        <div>
                            {/* Preview Mode Switcher */}
                            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                                <span className="text-xs font-mono font-semibold uppercase text-slate-300 flex items-center gap-1.5">
                                    <Laptop className="w-3.5 h-3.5 text-[#f97316]" />
                                    <span>Pratinjau Komponen Live</span>
                                </span>
                                <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-mono">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode('light')}
                                        className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                                            previewMode === 'light'
                                                ? 'bg-white text-black font-semibold'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <Sun className="w-3 h-3" />
                                        <span>Light</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode('dark')}
                                        className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                                            previewMode === 'dark'
                                                ? 'bg-slate-700 text-white font-semibold'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <Moon className="w-3 h-3" />
                                        <span>Dark</span>
                                    </button>
                                </div>
                            </div>

                            {/* Scoped Preview Container */}
                            <ProjectThemeScope
                                theme={deferredPreviewTheme}
                                isDark={previewMode === 'dark'}
                                className="p-5 rounded-2xl border border-border space-y-4 shadow-xl transition-colors duration-150"
                            >
                                <div className="flex items-center justify-between pb-2 border-b border-border">
                                    <div>
                                        <h4 className="font-bold text-sm text-foreground">
                                            {deferredPreviewTheme?.name || 'Pratinjau Tema'}
                                        </h4>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            font: {deferredPreviewTheme?.fontSans || 'Plus Jakarta Sans'}
                                        </span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary text-primary-foreground">
                                        Active
                                    </span>
                                </div>

                                {/* Buttons Sample */}
                                <div className="space-y-1.5">
                                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Tombol Antarmuka:</span>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:opacity-90">
                                            Primary Action
                                        </button>
                                        <button className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground font-medium text-xs hover:opacity-90">
                                            Secondary
                                        </button>
                                        <button className="px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground font-medium text-xs hover:opacity-90">
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Form Input Sample */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-medium text-foreground">Kolom Input Teks:</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value="Contoh input data form..."
                                        className="w-full px-3 py-1.5 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                    />
                                </div>

                                {/* Table Row Sample */}
                                <div className="rounded-lg border border-border overflow-hidden">
                                    <table className="w-full text-left text-[11px]">
                                        <thead className="bg-muted text-muted-foreground font-mono">
                                            <tr>
                                                <th className="py-1.5 px-3">Kolom</th>
                                                <th className="py-1.5 px-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border text-foreground">
                                            <tr>
                                                <td className="py-1.5 px-3 font-medium">Record Item #01</td>
                                                <td className="py-1.5 px-3">
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent text-accent-foreground">
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </ProjectThemeScope>
                        </div>

                        {/* Export Guarantee Note */}
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 font-mono">
                            ✓ Tema ini otomatis ter-inject ke file <code className="text-[#f97316]">resources/css/app.css</code> saat Anda mendownload ZIP project.
                        </div>
                    </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="px-6 sm:px-8 py-4 border-t border-white/10 flex items-center justify-between bg-[#0a0f1d]/90 font-mono text-xs">
                    <span className="text-slate-400 text-[11px]">
                        Tema Terpilih: <strong className="text-white">{selectedTheme?.name || 'Default Slate'}</strong>
                    </span>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            disabled={saving}
                            onClick={handleSaveTheme}
                            className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold flex items-center gap-2 shadow-lg shadow-orange-950/50 transition-all active:scale-98 disabled:opacity-50"
                        >
                            {saving ? (
                                <span>Menyimpan...</span>
                            ) : (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Simpan Tema Proyek</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
