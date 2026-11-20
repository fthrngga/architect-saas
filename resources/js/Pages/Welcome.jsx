import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomCursor from '@/Components/CustomCursor';
import ArchitectLivingSandbox from '@/Components/ArchitectLivingSandbox';
import ArchitectSeal from '@/Components/ArchitectSeal';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    ArrowRight,
    Check,
    Download,
    Database,
    Layers,
    ShieldCheck,
    FileCode2,
    Layout,
    ExternalLink
} from 'lucide-react';

/**
 * ScrollReveal Component
 * Memberikan animasi kemunculan halus saat elemen masuk ke viewport.
 */
function ScrollReveal({ children, className = '', delay = 0 }) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.12 }
        );

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return (
        <div
            ref={domRef}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out ${
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
            } ${className}`}
        >
            {children}
        </div>
    );
}

/**
 * Rotating Tagline in Hero
 * Transisi teks kata kunci dengan animasi slide-up halus tanpa emoji berlebihan.
 */
function RotatingHeroTagline() {
    const phrases = [
        {
            text: 'KODE BOILERPLATE.',
            desc: 'Model, migration, dan antarmuka CRUD lengkap siap pakai dalam hitungan detik.',
            color: 'text-[#c2410c]'
        },
        {
            text: 'VENDOR LOCK-IN.',
            desc: '100% kode standar Laravel 11 yang dapat Anda unduh dan kelola sendiri.',
            color: 'text-emerald-700'
        },
        {
            text: 'MIGRASI MANUAL.',
            desc: 'Integritas relasi foreign key dan cascade delete diatur otomatis secara visual.',
            color: 'text-blue-800'
        },
        {
            text: 'KODE REPETITIF.',
            desc: 'Halaman React Inertia modern lengkap dengan pencarian instan dan filter status.',
            color: 'text-purple-800'
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsExiting(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % phrases.length);
                setIsExiting(false);
            }, 250);
        }, 3200);

        return () => clearInterval(timer);
    }, [phrases.length]);

    const activePhrase = phrases[currentIndex];

    return (
        <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-poster text-[#101c36] uppercase tracking-tight leading-[0.88] select-none">
                BLUEPRINT TO APP.<br />
                <span className="font-serif italic font-normal text-[#c2410c] lowercase tracking-normal">
                    tanpa
                </span>{' '}
                <span
                    className={`inline-block transition-all duration-300 ${activePhrase.color} ${
                        isExiting ? 'anim-slide-up-out' : 'anim-slide-up-in'
                    }`}
                >
                    {activePhrase.text}
                </span>
            </h1>

            {/* Keterangan Manfaat Dinamis */}
            <div className="h-7 flex items-center">
                <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101c36]/5 border border-[#101c36]/10 text-xs font-mono font-medium text-[#101c36] transition-all duration-300 ${
                        isExiting ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
                    }`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                    <span>{activePhrase.desc}</span>
                </div>
            </div>
        </div>
    );
}

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <div className="min-h-screen bg-[#f5f2eb] text-[#101c36] font-sans antialiased relative overflow-x-hidden selection:bg-[#101c36] selection:text-[#f5f2eb]">
            <Head title="Architect SaaS — Visual Schema & Code Generator untuk Laravel 11 & React" />

            {/* Custom Fluid Magnetic Cursor */}
            <CustomCursor />

            {/* SECTION 1: HERO DRAFTING TABLE */}
            <div className="relative paper-grid border-b border-[#101c36]/15 pb-20 sm:pb-28">
                
                {/* Header Navigasi */}
                <header className="max-w-7xl mx-auto px-6 sm:px-12 h-24 flex items-center justify-between border-b border-[#101c36]/10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <ApplicationLogo variant="full" className="group-hover:scale-102 transition-transform" />
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-semibold uppercase tracking-wider text-[#475569]">
                        <a href="#workbench" className="hover:text-[#101c36] transition-colors">Workbench</a>
                        <a href="#specifications" className="hover:text-[#101c36] transition-colors">Spesifikasi</a>
                        <a href="#ownership" className="hover:text-[#101c36] transition-colors">Kedaulatan Kode</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('architect.projects.index')}
                                className="px-5 py-2.5 rounded-xl bg-[#101c36] hover:bg-[#1a2d52] text-[#f5f2eb] font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-98"
                                data-cursor-label="STUDIO"
                            >
                                <span>Buka Studio</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route('login')}
                                    className="text-xs font-mono font-semibold uppercase tracking-wider text-[#101c36] px-3 py-2 hover:opacity-75 transition-opacity"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-5 py-2.5 rounded-xl bg-[#101c36] hover:bg-[#1a2d52] text-[#f5f2eb] font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-98"
                                    data-cursor-label="START"
                                >
                                    <span>Mulai Gratis</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-[#f97316]" />
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* Hero Content */}
                <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-14 sm:pt-20 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        
                        {/* Kolom Kiri: Headline & Deskripsi */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#101c36]/15 bg-[#ffffff]/80 text-xs font-mono font-medium tracking-wide text-[#101c36] shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-[#c2410c] inline-block" />
                                <span>Visual Schema & Code Generator untuk Laravel 11 & React</span>
                            </div>

                            {/* Headline Dinamis dengan Transisi Halus */}
                            <RotatingHeroTagline />

                            <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-2xl font-sans">
                                Rancang entitas dan relasi database secara visual. Architect langsung menghasilkan aplikasi <strong>Laravel 11 & React Inertia</strong> lengkap—migration, Eloquent model, controller, dan tampilan CRUD siap pakai yang 100% menjadi milik Anda.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    href={auth.user ? route('architect.projects.index') : route('register')}
                                    className="px-8 py-3.5 rounded-xl bg-[#101c36] hover:bg-[#1c3059] text-[#f5f2eb] font-mono font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#101c36]/15 transition-all active:scale-98"
                                    data-cursor-label="BUILD"
                                >
                                    <span>Mulai Rancang Proyek</span>
                                    <ArrowRight className="w-4 h-4 text-[#f97316]" />
                                </Link>

                                <a
                                    href="#workbench"
                                    className="px-7 py-3.5 rounded-xl border border-[#101c36]/40 hover:bg-[#101c36]/5 text-[#101c36] font-mono font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                                >
                                    <span>Coba Demo Interaktif</span>
                                </a>
                            </div>

                            <div className="pt-1 text-xs text-[#64748b] font-mono">
                                Standar resmi PSR-12 &bull; Siap di-deploy ke server VPS atau Docker pribadi Anda
                            </div>
                        </div>

                        {/* Kolom Kanan: Seal & Lembar Spesifikasi */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
                            <ArchitectSeal className="scale-125 my-6" />
                            
                            <div className="mt-2 p-5 rounded-2xl bg-white border border-[#101c36]/15 shadow-xl max-w-xs w-full space-y-3 font-mono text-xs">
                                <div className="flex justify-between items-center pb-2 border-b border-[#101c36]/10 text-[#475569]">
                                    <span className="font-bold uppercase tracking-wider">Lembar Spesifikasi</span>
                                    <span>Rev. 2026.1</span>
                                </div>
                                <div className="space-y-1.5 text-[#101c36]">
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Backend:</span>
                                        <span className="font-semibold">Laravel 11 (PHP 8.3)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Frontend:</span>
                                        <span className="font-semibold">React 18 + Inertia</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Tenancy:</span>
                                        <span className="font-semibold text-[#c2410c]">Row-Level Scoped</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Lisensi Kode:</span>
                                        <span className="font-semibold text-emerald-700">100% Milik Anda (MIT)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </div>

            {/* SECTION 2: WORKBENCH INTERAKTIF */}
            <div id="workbench" className="bg-[#101c36] text-[#f6f4ee] py-20 sm:py-28 relative scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-10">
                    
                    <ScrollReveal>
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-6">
                            <div>
                                <span className="font-mono text-xs text-[#f97316] font-semibold uppercase tracking-widest block">
                                    Demo Interaktif &bull; Cara Kerja Sistem
                                </span>
                                <h2 className="text-3xl sm:text-5xl font-poster uppercase tracking-wide mt-2 text-white">
                                    Dari Skema Menjadi Aplikasi Nyata.
                                </h2>
                            </div>
                            <p className="text-sm text-slate-300 max-w-md font-sans leading-relaxed">
                                Pilih contoh kasus bisnis di atas meja kerja, lalu uji coba skema database, tabel aplikasi CRUD, serta kode sumber Laravel yang siap diekspor.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Satu Komponen Sandbox Terpadu */}
                    <ScrollReveal delay={100}>
                        <ArchitectLivingSandbox />
                    </ScrollReveal>

                </div>
            </div>

            {/* SECTION 3: SPESIFIKASI ARSITEKTUR */}
            <div id="specifications" className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-12 space-y-12 scroll-mt-20">
                <ScrollReveal>
                    <div className="space-y-2">
                        <span className="font-mono text-xs text-[#c2410c] font-semibold uppercase tracking-widest block">
                            Standar Rekayasa Perangkat Lunak
                        </span>
                        <h2 className="text-4xl sm:text-6xl font-poster uppercase tracking-tight text-[#101c36]">
                            Kualitas Kode Standar Industri.
                        </h2>
                        <p className="text-sm sm:text-base text-[#475569] max-w-2xl font-sans">
                            Tanpa runtime proprietary, tanpa library black-box yang mengikat. Seluruh kode yang dihasilkan mengikuti pola desain Laravel dan React standar.
                        </p>
                    </div>
                </ScrollReveal>

                {/* 4 Kartu Spesifikasi Bersih */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Spec 1 */}
                    <ScrollReveal delay={0}>
                        <div className="p-7 rounded-2xl bg-white border border-[#101c36]/15 shadow-sm space-y-3.5 relative hover:shadow-md transition-shadow">
                            <span className="font-mono text-xs font-semibold text-[#c2410c] block">
                                01 / DESAIN SKEMA
                            </span>
                            <h3 className="font-poster text-2xl uppercase tracking-wide text-[#101c36]">
                                Relasi Database Visual
                            </h3>
                            <p className="text-xs text-[#475569] leading-relaxed font-sans">
                                Tentukan tabel, tipe kolom, dan foreign key secara visual. Integritas database dan cascade deletion tersusun otomatis.
                            </p>
                            <div className="pt-2 border-t border-[#101c36]/10 text-[11px] font-mono text-[#64748b]">
                                Indexing & constraints otomatis
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Spec 2 */}
                    <ScrollReveal delay={100}>
                        <div className="p-7 rounded-2xl bg-white border border-[#101c36]/15 shadow-sm space-y-3.5 relative hover:shadow-md transition-shadow">
                            <span className="font-mono text-xs font-semibold text-[#c2410c] block">
                                02 / MULTI-TENANCY
                            </span>
                            <h3 className="font-poster text-2xl uppercase tracking-wide text-[#101c36]">
                                Isolasi Data Workspace
                            </h3>
                            <p className="text-xs text-[#475569] leading-relaxed font-sans">
                                Setiap query database otomatis terisolasi berdasarkan workspace aktif pengguna untuk mencegah kebocoran data antar tenant.
                            </p>
                            <div className="pt-2 border-t border-[#101c36]/10 text-[11px] font-mono text-[#64748b]">
                                Row-level security bawaan
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Spec 3 */}
                    <ScrollReveal delay={200}>
                        <div className="p-7 rounded-2xl bg-white border border-[#101c36]/15 shadow-sm space-y-3.5 relative hover:shadow-md transition-shadow">
                            <span className="font-mono text-xs font-semibold text-[#c2410c] block">
                                03 / ANTARMUKA CRUD
                            </span>
                            <h3 className="font-poster text-2xl uppercase tracking-wide text-[#101c36]">
                                React 18 & Inertia UI
                            </h3>
                            <p className="text-xs text-[#475569] leading-relaxed font-sans">
                                Antarmuka siap pakai dengan tabel dinamis, pencarian instan, filter status, pagination, dan modal input dengan validasi form.
                            </p>
                            <div className="pt-2 border-t border-[#101c36]/10 text-[11px] font-mono text-[#64748b]">
                                Komponen Tailwind CSS bersih
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Spec 4 */}
                    <ScrollReveal delay={300}>
                        <div className="p-7 rounded-2xl bg-white border border-[#101c36]/15 shadow-sm space-y-3.5 relative hover:shadow-md transition-shadow">
                            <span className="font-mono text-xs font-semibold text-[#c2410c] block">
                                04 / KEDAULATAN KODE
                            </span>
                            <h3 className="font-poster text-2xl uppercase tracking-wide text-[#101c36]">
                                Bebas Di-deploy Di Mana Saja
                            </h3>
                            <p className="text-xs text-[#475569] leading-relaxed font-sans">
                                Ekspor controller PSR-12, model Eloquent, dan halaman React. Tidak ada biaya langganan runtime bulanan untuk server Anda.
                            </p>
                            <div className="pt-2 border-t border-[#101c36]/10 text-[11px] font-mono text-[#64748b]">
                                Standar PHP 8.3 & Node.js
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* SECTION 4: CALL TO ACTION */}
            <div id="ownership" className="border-t border-[#101c36]/15 bg-[#ffffff] py-20 sm:py-28">
                <ScrollReveal>
                    <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center space-y-6">
                        
                        <span className="font-mono text-xs text-[#c2410c] font-semibold uppercase tracking-wider inline-block border border-[#c2410c]/30 px-3.5 py-1 rounded-full bg-orange-50">
                            Mulai Bangun Aplikasi Anda
                        </span>

                        <h2 className="text-4xl sm:text-6xl font-poster uppercase tracking-tight text-[#101c36] leading-[0.95]">
                            Hemat Ratusan Jam Menulis Kode Boilerplate.
                        </h2>

                        <p className="text-sm sm:text-base text-[#475569] max-w-xl mx-auto font-sans leading-relaxed">
                            Daftar gratis dalam 30 detik. Rancang struktur database secara visual, uji antarmuka aplikasinya, dan unduh kode produksi lengkap Anda.
                        </p>

                        <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href={auth.user ? route('architect.projects.index') : route('register')}
                                className="px-8 py-3.5 rounded-xl bg-[#101c36] hover:bg-[#1a2d52] text-[#f5f2eb] font-mono font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#101c36]/15 transition-all active:scale-98"
                                data-cursor-label="CREATE"
                            >
                                <span>Buka Studio Sekarang</span>
                                <ArrowRight className="w-4 h-4 text-[#f97316]" />
                            </Link>
                        </div>

                        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#64748b]">
                            <span>Tanpa kartu kredit</span>
                            <span>&bull;</span>
                            <span>Aktivasi proyek instan</span>
                            <span>&bull;</span>
                            <span>Kode 100% dapat diunduh</span>
                        </div>

                    </div>
                </ScrollReveal>
            </div>

            {/* FOOTER */}
            <footer className="border-t border-[#101c36]/15 bg-[#f5f2eb] py-10 px-6 sm:px-12 font-mono text-xs text-[#64748b]">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="w-6 h-6" />
                        <span className="font-poster text-base text-[#101c36] tracking-wider">
                            ARCHITECT SAAS
                        </span>
                        <span>&bull;</span>
                        <span>Full-Stack Software Generator</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#workbench" className="hover:text-[#101c36] transition-colors">Workbench</a>
                        <a href="#specifications" className="hover:text-[#101c36] transition-colors">Spesifikasi</a>
                        <Link href={route('login')} className="hover:text-[#101c36] transition-colors">Masuk</Link>
                        <Link href={route('register')} className="hover:text-[#101c36] transition-colors">Daftar</Link>
                    </div>

                    <div>
                        &copy; 2026 Architect SaaS. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
