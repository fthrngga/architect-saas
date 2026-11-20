import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    LayoutDashboard,
    Database,
    Table2,
    ArrowLeft,
    Plus,
    Download,
    SlidersHorizontal,
    Menu,
    X,
    LogOut,
    ExternalLink,
    Code2,
    Layers,
    CheckCircle2,
    Palette,
    Sun,
    Moon,
    Zap,
    ShieldCheck
} from 'lucide-react';
import { ProjectThemeScope, DEFAULT_THEME } from '@/Components/Theme/ThemeEngine';
import ThemeSelectorModal from '@/Components/Theme/ThemeSelectorModal';
import TierLimitModal from '@/Components/Billing/TierLimitModal';

interface UserAppLayoutProps {
    children: React.ReactNode;
    title?: string;
    project: any;
    modules?: any[];
}

export default function UserAppLayout({ children, title, project, modules = [] }: UserAppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [isLocalDark, setIsLocalDark] = useState(false);
    const [activeTheme, setActiveTheme] = useState(project?.settings?.theme || DEFAULT_THEME);
    const [tierModalOpen, setTierModalOpen] = useState(false);
    const [tierModalDesc, setTierModalDesc] = useState<string | undefined>(undefined);

    const { auth, modules: sharedModules, flash } = usePage().props as any;
    const effectiveModules = modules && modules.length > 0 ? modules : (sharedModules || []);
    const ownerHandle = project?.owner?.handle || auth?.user?.handle || '';
    const projectSlug = project?.slug || '';
    const currentUrl = usePage().url;

    const isSuperAdmin = auth?.user?.is_admin || auth?.user?.role === 'superadmin';
    const tier = auth?.user?.tier || 'free';

    useEffect(() => {
        if (flash?.tier_limit) {
            setTierModalDesc(flash.tier_limit);
            setTierModalOpen(true);
        }
    }, [flash?.tier_limit]);

    useEffect(() => {
        const handler = (e: any) => {
            if (e.detail) {
                setActiveTheme(e.detail);
            }
        };
        window.addEventListener('architect-theme-applied', handler);
        return () => window.removeEventListener('architect-theme-applied', handler);
    }, []);

    return (
        <div className={`min-h-screen font-sans antialiased flex flex-col transition-colors ${
            isLocalDark ? 'bg-[#07090e] text-white' : 'bg-[#f6f4ee] text-[#101c36]'
        }`}>
            {/* Top Atelier Bar */}
            <header className={`h-16 border-b transition-colors sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between backdrop-blur-md ${
                isLocalDark
                    ? 'bg-[#0a0f1d]/95 border-white/10 text-white'
                    : 'bg-[#f6f4ee]/95 border-[#101c36]/15 text-[#101c36]'
            }`}>
                <div className="flex items-center gap-4 sm:gap-6">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`lg:hidden p-2 rounded-lg border transition-colors ${
                            isLocalDark
                                ? 'border-white/15 bg-white/10 text-white'
                                : 'border-[#101c36]/20 bg-white/70 text-[#101c36]'
                        }`}
                        aria-label="Toggle menu"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <Link href={route('architect.projects.index')} className="flex items-center gap-2.5 group">
                        <ApplicationLogo variant="icon" dark={isLocalDark} className="w-8 h-8 group-hover:scale-105 transition-transform shrink-0" />
                        <span className={`font-mono text-xs font-bold uppercase tracking-wider hidden sm:inline transition-colors ${
                            isLocalDark ? 'text-white' : 'text-[#101c36]'
                        }`}>
                            Architect Atelier
                        </span>
                    </Link>

                    <div className={`h-5 w-px hidden md:block ${isLocalDark ? 'bg-white/10' : 'bg-[#101c36]/15'}`} />

                    {/* Project Breadcrumb Badge */}
                    <div className="flex items-center gap-2 text-xs font-mono">
                        <span className={isLocalDark ? 'text-slate-400 hidden md:inline' : 'text-[#64748b] hidden md:inline'}>App:</span>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-bold transition-colors ${
                            isLocalDark
                                ? 'bg-white/5 border-white/10 text-slate-200'
                                : 'bg-[#101c36]/5 border-[#101c36]/10 text-[#101c36]'
                        }`}>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="truncate max-w-[140px] sm:max-w-[220px]">{project?.name || 'Aplikasi'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Live Theme Switcher & Dark Mode Toggle for App Preview */}
                    <div className={`flex items-center gap-1.5 p-1 rounded-xl border transition-colors ${
                        isLocalDark ? 'bg-white/5 border-white/10' : 'bg-[#101c36]/5 border-[#101c36]/10'
                    }`}>
                        <button
                            type="button"
                            onClick={() => setIsThemeModalOpen(true)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors shadow-2xs ${
                                isLocalDark
                                    ? 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
                                    : 'bg-white hover:bg-slate-50 text-[#101c36]'
                            }`}
                            title="Atur Tema & Design Tokens (Tweakcn)"
                        >
                            <Palette className="w-3.5 h-3.5 text-[#ea580c]" />
                            <span className="hidden md:inline">Tema:</span>
                            <span className="truncate max-w-[110px]">{activeTheme?.name || 'Default Slate'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsLocalDark(!isLocalDark)}
                            className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                                isLocalDark
                                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                    : 'bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                            }`}
                            title={isLocalDark ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'}
                        >
                            {isLocalDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                        </button>
                    </div>

                    <Link
                        href={route('architect.modules.index', project?.id || '')}
                        className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors shadow-sm ${
                            isLocalDark
                                ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white'
                                : 'border-[#101c36]/20 bg-white/80 hover:bg-white text-[#101c36] hover:border-[#c2410c] hover:text-[#c2410c]'
                        }`}
                        title="Buka Schema & Module Builder"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Schema Editor</span>
                    </Link>

                    <Link
                        href={route('architect.projects.index')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-sm ${
                            isLocalDark
                                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                : 'bg-[#101c36] text-[#f6f4ee] hover:bg-[#1a2d54]'
                        }`}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Studio Proyek</span>
                    </Link>

                    {/* Super Admin Badge Link */}
                    {isSuperAdmin && (
                        <Link
                            href={route('admin.subscriptions.index')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white font-mono text-xs font-bold shadow-sm hover:bg-purple-700 transition-colors"
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Super Admin</span>
                        </Link>
                    )}

                    {/* Tier Badge / Upgrade Link */}
                    <Link
                        href={route('billing.index')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all shadow-2xs ${
                            tier === 'agency'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : tier === 'pro'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                        }`}
                        title="Atur Paket & Tagihan"
                    >
                        <Zap className="w-3.5 h-3.5 fill-current text-[#ea580c]" />
                        <span className="capitalize">{tier}</span>
                        {tier === 'free' && (
                            <span className="text-[10px] bg-[#ea580c] text-white px-1.5 py-0.5 rounded-md ml-0.5">
                                Upgrade
                            </span>
                        )}
                    </Link>

                    <div className={`h-6 w-px mx-1 ${isLocalDark ? 'bg-white/10' : 'bg-[#101c36]/15'}`} />

                    {/* User Badge */}
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs uppercase shadow-sm ${
                            isLocalDark ? 'bg-white/10 text-white border border-white/10' : 'bg-[#101c36] text-[#f6f4ee]'
                        }`}>
                            {auth?.user?.name ? auth.user.name.charAt(0) : 'U'}
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={`p-1.5 rounded-lg border transition-colors ${
                                isLocalDark
                                    ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/30'
                                    : 'border-[#101c36]/20 bg-white/70 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 text-[#475569]'
                            }`}
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* App Layout Body: Sidebar + Main Content inside Scoped Theme */}
            <ProjectThemeScope theme={activeTheme} isDark={isLocalDark} className="flex-1 flex flex-col min-w-0 bg-background text-foreground transition-colors">
                <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
                    {/* Mobile Backdrop */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Sidebar */}
                    <aside
                        className={`fixed lg:sticky top-16 bottom-0 left-0 z-30 w-72 bg-card border-r border-border text-card-foreground flex flex-col transition-transform duration-200 ease-in-out ${
                            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                        } h-[calc(100vh-4rem)] overflow-y-auto`}
                    >
                        {/* Project Header in Sidebar */}
                        <div className="p-5 border-b border-border bg-muted/20">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                                    Live Database App
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                                    RDS Connected
                                </span>
                            </div>
                            <h3 className="font-bold text-base text-card-foreground tracking-tight truncate">
                                {project?.name}
                            </h3>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                                /app/{ownerHandle}/{projectSlug}
                            </p>
                        </div>

                        {/* Navigation Links */}
                        <div className="p-4 space-y-6 flex-1">
                            {/* Section: Overview */}
                            <div>
                                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold px-3 block mb-2">
                                    Navigasi Utama
                                </span>
                                <div className="space-y-1">
                                    <Link
                                        href={`/app/${ownerHandle}/${projectSlug}/dashboard`}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                                            currentUrl.endsWith('/dashboard')
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                                        }`}
                                    >
                                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                                        <span>Dashboard Ringkasan</span>
                                    </Link>

                                    <Link
                                        href={route('architect.modules.index', project?.id || '')}
                                        onClick={() => setSidebarOpen(false)}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-bold text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <SlidersHorizontal className="w-4 h-4 shrink-0" />
                                            <span>Schema Builder</span>
                                        </div>
                                        <span className="text-[10px] text-[#c2410c] dark:text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                                            Editor
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            {/* Section: Dynamic Database Tables */}
                            <div>
                                <div className="flex items-center justify-between px-3 mb-2">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                                        Tabel Database ({effectiveModules.length})
                                    </span>
                                    <Link
                                        href={route('architect.modules.index', project?.id || '')}
                                        className="text-[10px] font-mono text-primary hover:underline flex items-center gap-0.5 font-bold"
                                        title="Tambah Modul Baru"
                                    >
                                        <Plus className="w-3 h-3" /> Tambah
                                    </Link>
                                </div>

                                <div className="space-y-1">
                                    {effectiveModules.map((mod: any) => {
                                        const moduleUrl = `/app/${ownerHandle}/${projectSlug}/${mod.table_name}`;
                                        const isActive = currentUrl.startsWith(moduleUrl);

                                        return (
                                            <Link
                                                key={mod.id || mod.table_name}
                                                href={moduleUrl}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                                                    isActive
                                                        ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                                                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5 truncate">
                                                    <Table2 className="w-4 h-4 shrink-0" />
                                                    <span className="truncate">{mod.name}</span>
                                                </div>
                                                <span
                                                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                                                        isActive
                                                            ? 'bg-white/20 text-primary-foreground'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {mod.table_name}
                                                </span>
                                            </Link>
                                        );
                                    })}

                                    {effectiveModules.length === 0 && (
                                        <div className="p-3 text-center rounded-xl border border-dashed border-border bg-muted/20">
                                            <p className="text-xs text-muted-foreground font-mono">Belum ada modul</p>
                                            <Link
                                                href={route('architect.modules.index', project?.id || '')}
                                                className="text-xs text-primary font-mono font-bold hover:underline mt-1 inline-block"
                                            >
                                                + Buat Modul Pertama
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Utility Actions */}
                        <div className="p-4 border-t border-border bg-muted/20 space-y-2">
                            {project?.id && (
                                <a
                                    href={route('architect.projects.export', project.id)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-mono font-bold text-foreground transition-colors shadow-2xs"
                                >
                                    <Download className="w-3.5 h-3.5 text-primary" />
                                    <span>Unduh ZIP Codebase</span>
                                </a>
                            )}

                            <div className="text-[10px] text-center font-mono text-muted-foreground">
                                MySQL AWS RDS • Multi-Tenant Scoped
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-background text-foreground">
                        {children}
                    </main>
                </div>
            </ProjectThemeScope>

            {/* Theme Selector Modal */}
            <ThemeSelectorModal
                isOpen={isThemeModalOpen}
                onClose={() => setIsThemeModalOpen(false)}
                project={project}
                onThemeUpdated={(updatedTheme) => setActiveTheme(updatedTheme)}
            />

            {/* Global Limit Interceptor Modal */}
            <TierLimitModal
                isOpen={tierModalOpen}
                onClose={() => setTierModalOpen(false)}
                description={tierModalDesc}
            />
        </div>
    );
}
