import React from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2, QrCode } from 'lucide-react';

export default function ArchitectLicenseBadge({ userHandle = 'gReXkFiDKb', orgName = 'Studio Workspace' }) {
    return (
        <div className="relative flex flex-col items-center">
            {/* Lanyard Top Attachment String */}
            <div className="lanyard-chain" />
            <div className="lanyard-clip" />

            {/* Swaying Physical License Card */}
            <div
                className="id-badge-container w-72 sm:w-80 rounded-2xl bg-[#142442] border border-cream/25 p-5 text-cream shadow-2xl shadow-navy-950/80 relative overflow-hidden"
                data-cursor-label="LICENSE"
            >
                {/* Lanyard Punch Hole */}
                <div className="w-12 h-2.5 rounded-full bg-navy-950 border border-cream/20 mx-auto mb-4" />

                {/* Top Badge Info */}
                <div className="flex items-center justify-between pb-3 border-b border-cream/15 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>ARCHITECT_VERIFIED</span>
                    </div>
                    <span className="text-[10px] text-cream/60">ID #SAAS-2026</span>
                </div>

                {/* Identity Block */}
                <div className="py-4 space-y-1">
                    <div className="text-[11px] font-mono text-cream/60 uppercase tracking-wider">
                        TENANT ORG SPECIFICATION
                    </div>
                    <h3 className="font-round text-xl font-bold tracking-tight text-cream">
                        {orgName}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>HANDLE: @{userHandle}</span>
                    </div>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cream/15 font-mono text-[11px]">
                    <div className="p-2 rounded-lg bg-navy-900/60 border border-cream/10">
                        <span className="text-cream/50 block text-[10px]">REGION ENGINE</span>
                        <span className="text-cream font-semibold">AP-SOUTHEAST-2</span>
                    </div>
                    <div className="p-2 rounded-lg bg-navy-900/60 border border-cream/10">
                        <span className="text-cream/50 block text-[10px]">DATABASE CORE</span>
                        <span className="text-sky-400 font-semibold">AWS RDS MySQL</span>
                    </div>
                </div>

                {/* Holographic Security Strip */}
                <div className="mt-4 pt-3 border-t border-cream/15 flex items-center justify-between text-[10px] font-mono text-cream/70">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-gradient-to-tr from-amber-400 via-rose-400 to-sky-400 opacity-90 shadow-xs" />
                        <span>CRYPTOGRAPHIC TENANCY</span>
                    </div>
                    <span className="text-emerald-400 font-bold">100% OWNERSHIP</span>
                </div>
            </div>
        </div>
    );
}
