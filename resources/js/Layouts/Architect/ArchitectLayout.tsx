import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { LogOut, ArrowLeft, Layers, Plus, Terminal } from 'lucide-react';

export default function ArchitectLayout({ 
    children, 
    title = 'Studio Atelier' 
}: { 
    children: React.ReactNode; 
    title?: string;
}) {
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-[#f6f4ee] text-[#101c36] font-sans antialiased flex flex-col selection:bg-[#101c36] selection:text-[#f6f4ee]">
            {/* Top Minimalist Header */}
            <header className="h-20 border-b border-[#101c36]/15 bg-[#f6f4ee]/90 backdrop-blur-md px-6 sm:px-12 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <ApplicationLogo variant="full" className="group-hover:scale-102 transition-transform" />
                    </Link>

                    <div className="hidden md:flex items-center gap-2 text-xs font-mono pl-6 border-l border-[#101c36]/15">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        <span className="font-bold text-[#101c36] uppercase tracking-wider">{title}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 font-mono text-xs">
                        <div className="text-right hidden sm:block leading-tight">
                            <span className="font-bold block text-[#101c36]">{auth?.user?.name || 'Architect User'}</span>
                            <span className="text-[10px] text-[#64748b]">{auth?.user?.email}</span>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-[#101c36] text-[#f6f4ee] flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                            {auth?.user?.name ? auth.user.name.charAt(0) : 'A'}
                        </div>
                    </div>

                    <div className="pl-3 border-l border-[#101c36]/15 flex items-center gap-2">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-2 rounded-xl border border-[#101c36]/20 bg-white/60 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 text-[#475569] transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Studio Body */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {children}
            </main>
        </div>
    );
}
