import React from 'react';
import { Link } from '@inertiajs/react';
import { X, Sparkles, Check, ArrowRight, ShieldAlert, Zap, Download, Layers } from 'lucide-react';

interface TierLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export default function TierLimitModal({
    isOpen,
    onClose,
    title = 'Batas Kuota Paket Free Tercapai',
    description = 'Anda telah mencapai batas kuota paket Free. Upgrade ke paket Pro untuk membuka akses tanpa batas!'
}: TierLimitModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-sans">
            <div className="bg-[#0e172a] border border-orange-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-[#f97316] flex items-center justify-center border border-orange-500/30">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold block">
                            Architect SaaS Pro
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                            {title}
                        </h3>
                    </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-sans">
                    {description}
                </p>

                {/* Pro Features Showcase */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 mb-6 font-mono text-xs">
                    <div className="text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                        Keuntungan Paket Pro (Hanya Rp 49.000 / bln):
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5 text-slate-200">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                            <span><strong>Unlimited Modul</strong> (Bebas buat tabel database sebanyak mungkin)</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-200">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                            <span><strong>Unduh ZIP Codebase Tanpa Batas</strong> (Full Laravel + Inertia React)</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-200">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                            <span><strong>Hingga 5 Proyek Aktif</strong> di Studio Anda</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-200">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                            <span><strong>Semua 43+ Tema TweakCN</strong> & Custom Design Tokens</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Link
                        href={route('billing.index')}
                        className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 transition-all hover:scale-101"
                    >
                        <span>Upgrade ke Pro (Rp 49.000/bln)</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto py-3 px-4 rounded-xl border border-white/10 hover:bg-white/10 text-slate-300 font-mono text-xs transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
