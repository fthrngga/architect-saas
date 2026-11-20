import React from 'react';
import { ShieldCheck, Award, Layers, Terminal } from 'lucide-react';

export default function ArchitectCartouche({ className = '', userHandle = 'kodaidev' }) {
    return (
        <div className={`cartouche-border bg-[#0a0e17]/90 backdrop-blur-md p-6 font-cad text-xs text-slate-300 shadow-2xl relative select-none ${className}`}>
            {/* Top Engineering Label */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 text-[11px]">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>CAD_CARTOUCHE // SPECIFICATION_BLOCK</span>
                </div>
                <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    VERIFIED_ARCHITECTURE
                </span>
            </div>

            {/* Grid of Blueprint Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-white/5 text-[11px]">
                <div className="space-y-0.5">
                    <div className="text-slate-500 text-[10px]">PROJECT DESIGNATION</div>
                    <div className="text-white font-bold font-grotesk tracking-wide text-xs">ARCHITECT_SAAS</div>
                </div>
                <div className="space-y-0.5">
                    <div className="text-slate-500 text-[10px]">DRAWING NUMBER</div>
                    <div className="text-cyan-400 font-bold">DWG-01-RELATIONAL</div>
                </div>
                <div className="space-y-0.5">
                    <div className="text-slate-500 text-[10px]">TENANT ISOLATION</div>
                    <div className="text-amber-400 font-bold">STRICT ROW_LEVEL</div>
                </div>
                <div className="space-y-0.5">
                    <div className="text-slate-500 text-[10px]">REGION & ENGINE</div>
                    <div className="text-emerald-400 font-bold">RDS: AP-SOUTHEAST-2</div>
                </div>
            </div>

            {/* Center Structural Detail */}
            <div className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[11px] text-slate-400">
                <div>
                    <span className="text-slate-500">AUTHOR / ARCHITECT: </span>
                    <span className="text-white font-semibold">{userHandle || 'developer'} // KODAIDEV</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-300/80 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded">
                    <span>CODE STACK: LARAVEL 11.X + REACT 18 + INERTIA</span>
                </div>
            </div>

            {/* Holographic Seal of Engineering Quality */}
            <div className="mt-2 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-sans">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Deterministic AST Compilation • 0% Proprietary Runtime Rent</span>
                </div>
                <div className="font-mono text-[9px] text-cyan-400/60 uppercase tracking-widest">
                    STAMP_SEAL: CERT_2026_PASSED
                </div>
            </div>
        </div>
    );
}

