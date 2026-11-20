import React from 'react';
import { Link } from '@inertiajs/react';
import CustomCursor from '@/Components/CustomCursor';
import ArchitectSeal from '@/Components/ArchitectSeal';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { ArrowLeft } from 'lucide-react';

export default function GuestLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-[#f5f2eb] text-[#101c36] flex flex-col font-sans selection:bg-[#101c36] selection:text-[#f5f2eb] relative overflow-x-hidden">
            {/* Custom Fluid Magnetic Cursor */}
            <CustomCursor />

            {/* Subtle Drafting Paper Grid */}
            <div className="absolute inset-0 paper-grid pointer-events-none opacity-60" />

            {/* Header */}
            <header className="h-20 border-b border-[#101c36]/15 bg-[#f5f2eb]/90 backdrop-blur-md px-6 sm:px-12 flex items-center justify-between z-20 sticky top-0">
                <Link href="/" className="group flex items-center gap-3 transition-transform active:scale-98">
                    <ApplicationLogo variant="full" className="group-hover:scale-102 transition-transform" />
                </Link>

                <Link
                    href="/"
                    className="flex items-center gap-1.5 text-[#101c36] hover:opacity-75 transition-opacity py-2 px-3.5 rounded-xl border border-[#101c36]/20 bg-white/60 text-xs font-mono font-bold uppercase tracking-wider"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                </Link>
            </header>

            {/* Split Screen Workspace */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative z-10">
                {/* LEFT COLUMN: Deep Architectural Atelier Pane */}
                <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-[#101c36] text-[#f6f4ee] border-r border-[#101c36]/20 p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 blueprint-grid pointer-events-none opacity-30" />

                    {/* Left Header */}
                    <div className="relative z-10 max-w-lg space-y-4">
                        <span className="font-mono text-xs text-[#f97316] font-bold tracking-widest uppercase">
                            SOFTWARE ATELIER // SPECIFICATION
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-poster text-white tracking-wide leading-[0.95]">
                            BLUEPRINT TO FULL-STACK APPLICATION.
                        </h2>
                        <p className="text-sm text-slate-300 leading-relaxed font-sans">
                            Sketch tables and relations visually. Architect compiles a complete, production-grade Laravel 11 & React app that belongs to you 100%.
                        </p>
                    </div>

                    {/* Architectural Seal Showcase */}
                    <div className="relative z-10 my-8 flex items-center gap-6">
                        <ArchitectSeal dark={true} className="scale-110" />
                        <div className="space-y-1 font-mono text-xs text-slate-300">
                            <span className="text-[#f97316] font-bold block uppercase tracking-wider">
                                100% CODE SOVEREIGNTY
                            </span>
                            <p className="text-[11px] text-slate-400 max-w-xs font-sans">
                                Standard PSR-12 code, clean React Inertia components, and zero runtime hostage fees.
                            </p>
                        </div>
                    </div>

                    {/* Status Note */}
                    <div className="relative z-10 flex items-center gap-2 font-mono text-xs text-slate-400 pt-4 border-t border-white/10">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Ready to initialize developer workspace</span>
                    </div>
                </div>

                {/* RIGHT COLUMN: The Auth Form Container */}
                <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-12 relative">
                    <div className="w-full max-w-md space-y-6">
                        {/* Title block */}
                        <div className="space-y-1 text-center sm:text-left">
                            <h1 className="text-3xl font-poster uppercase tracking-wide text-[#101c36]">
                                {title || 'WELCOME BACK'}
                            </h1>
                            <p className="text-xs sm:text-sm text-[#475569]">
                                {subtitle || 'Enter your credentials to access your studio workspace'}
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="rounded-3xl p-6 sm:p-8 border border-[#101c36]/15 bg-white shadow-xl">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
