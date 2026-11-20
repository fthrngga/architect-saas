import React, { useState } from 'react';
import ArchitectLayout from '@/Layouts/Architect/ArchitectLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Zap,
    Check,
    Clock,
    Upload,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowRight,
    QrCode,
    ShieldCheck,
    CreditCard,
    FileText,
    Copy,
    Sparkles,
    Building2,
    Users
} from 'lucide-react';

interface BillingIndexProps {
    tier: string;
    tier_expires_at?: string;
    lifetime_projects_count: number;
    lifetime_exports_count: number;
    active_projects_count: number;
    payments: Array<{
        id: string;
        invoice_number: string;
        tier: string;
        base_amount: number;
        unique_code: number;
        total_amount: number;
        payment_method: string;
        proof_image?: string;
        notes?: string;
        status: string;
        admin_notes?: string;
        created_at: string;
    }>;
}

export default function BillingIndex({
    tier,
    tier_expires_at,
    lifetime_projects_count,
    lifetime_exports_count,
    active_projects_count,
    payments = []
}: BillingIndexProps) {
    const [selectedTierForCheckout, setSelectedTierForCheckout] = useState<'pro' | 'agency'>('pro');
    const [copiedAmount, setCopiedAmount] = useState(false);

    // Form to create invoice
    const { post: postInvoice, processing: creatingInvoice } = useForm({
        tier: selectedTierForCheckout
    });

    const pendingPayment = payments.find((p) => p.status === 'pending');

    // Form to upload proof
    const { data: proofData, setData: setProofData, post: postProof, processing: uploadingProof, errors: proofErrors } = useForm<{
        proof_image: File | null;
        notes: string;
    }>({
        proof_image: null,
        notes: ''
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProofData('proof_image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCreateInvoice = (targetTier: 'pro' | 'agency') => {
        setSelectedTierForCheckout(targetTier);
        postInvoice(route('billing.invoice'), {
            data: { tier: targetTier },
            preserveScroll: true
        });
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pendingPayment) return;
        postProof(route('billing.proof', pendingPayment.id), {
            preserveScroll: true
        });
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedAmount(true);
        setTimeout(() => setCopiedAmount(false), 2000);
    };

    const formatCurrency = (val: number) => {
        return `Rp ${Number(val).toLocaleString('id-ID')}`;
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <ArchitectLayout title="Billing & Langganan">
            <Head title="Billing & Langganan - Architect SaaS" />

            <div className="space-y-10">
                {/* Header Banner */}
                <div className="bg-white rounded-3xl border border-[#101c36]/15 p-6 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                            <span className="text-slate-500">Status Akun:</span>
                            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[11px] ${
                                tier === 'agency'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                    : tier === 'pro'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                                {tier === 'agency' ? '👑 Agency Studio' : tier === 'pro' ? '🚀 Pro Plan' : '🥉 Free Tier'}
                            </span>
                            {tier_expires_at && (
                                <span className="text-slate-500">• Aktif hingga {formatDate(tier_expires_at)}</span>
                            )}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101c36] tracking-tight">
                            Paket & Langganan SaaS
                        </h1>
                        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                            Kelola tier akun Anda untuk membuka batas pembuatan modul tanpa batas, ekspor ZIP codebase tak terbatas, dan multi-proyek.
                        </p>
                    </div>

                    {/* Usage Stats Box */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-6 font-mono text-xs shrink-0">
                        <div>
                            <span className="text-slate-500 block text-[10px] uppercase">Proyek Aktif</span>
                            <span className="font-bold text-base text-[#101c36]">
                                {active_projects_count} <span className="text-xs font-normal text-slate-400">/ {tier === 'free' ? '1' : tier === 'pro' ? '5' : '∞'}</span>
                            </span>
                        </div>
                        <div className="h-8 w-px bg-slate-200" />
                        <div>
                            <span className="text-slate-500 block text-[10px] uppercase">Ekspor ZIP Terpakai</span>
                            <span className="font-bold text-base text-[#101c36]">
                                {lifetime_exports_count} <span className="text-xs font-normal text-slate-400">/ {tier === 'free' ? '1x' : '∞'}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* ACTIVE PENDING QRIS INVOICE SECTION (IF ANY) */}
                {pendingPayment && (
                    <div className="bg-white rounded-3xl border-2 border-[#ea580c] p-6 sm:p-10 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#ea580c] text-white font-mono text-xs font-bold rounded-bl-2xl">
                            MENUNGGU PEMBAYARAN
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left: Invoice details & QRIS Image */}
                            <div className="lg:col-span-7 space-y-6">
                                <div>
                                    <span className="text-xs font-mono font-bold text-[#ea580c] uppercase tracking-wider block mb-1">
                                        Tagihan Aktif #{pendingPayment.invoice_number}
                                    </span>
                                    <h2 className="text-2xl font-bold text-[#101c36]">
                                        Selesaikan Pembayaran via QRIS
                                    </h2>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Scan QRIS di bawah ini dengan BCA, Mandiri, GoPay, OVO, Dana, atau ShopeePay.
                                    </p>
                                </div>

                                {/* Amount Card with Unique Code highlight */}
                                <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-mono text-slate-500 block uppercase">
                                            Total Transfer (Termasuk 3 Digit Kode Unik):
                                        </span>
                                        <div className="text-3xl font-extrabold font-mono text-[#ea580c] tracking-tight mt-0.5">
                                            {formatCurrency(pendingPayment.total_amount)}
                                        </div>
                                        <p className="text-[11px] font-mono text-slate-500 mt-1">
                                            *Kode unik <strong className="text-[#ea580c]">+{pendingPayment.unique_code}</strong> digunakan untuk mempercepat verifikasi admin.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleCopy(String(pendingPayment.total_amount))}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-orange-300 text-xs font-mono font-bold text-[#ea580c] hover:bg-orange-100 transition-colors shadow-2xs shrink-0"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>{copiedAmount ? 'Tersalin!' : 'Salin Nominal'}</span>
                                    </button>
                                </div>

                                {/* QRIS Card Box */}
                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0">
                                        {/* SVG QR Code Illustration */}
                                        <svg className="w-40 h-40 text-[#101c36]" viewBox="0 0 100 100" fill="currentColor">
                                            {/* Outer Border Anchors */}
                                            <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" rx="4" />
                                            <rect x="12" y="12" width="14" height="14" />
                                            <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" rx="4" />
                                            <rect x="74" y="12" width="14" height="14" />
                                            <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" rx="4" />
                                            <rect x="12" y="74" width="14" height="14" />
                                            {/* Internal Patterns */}
                                            <rect x="40" y="8" width="6" height="6" />
                                            <rect x="52" y="8" width="6" height="6" />
                                            <rect x="40" y="20" width="6" height="18" />
                                            <rect x="52" y="24" width="6" height="6" />
                                            <rect x="8" y="42" width="18" height="6" />
                                            <rect x="8" y="54" width="6" height="6" />
                                            <rect x="20" y="54" width="6" height="6" />
                                            <rect x="36" y="42" width="28" height="28" rx="2" />
                                            <rect x="72" y="42" width="10" height="6" />
                                            <rect x="86" y="42" width="6" height="18" />
                                            <rect x="72" y="54" width="6" height="6" />
                                            <rect x="42" y="78" width="18" height="6" />
                                            <rect x="68" y="72" width="8" height="8" />
                                            <rect x="82" y="72" width="10" height="18" />
                                            <rect x="68" y="86" width="8" height="6" />
                                        </svg>
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        <div className="font-bold text-[#101c36] text-sm">
                                            QRIS Resmi Architect SaaS
                                        </div>
                                        <p className="text-slate-600 leading-relaxed font-sans">
                                            NMID: <strong className="font-mono">ID1020304050607</strong><br />
                                            Merchant: <strong>KODAI ARCHITECT SAAS</strong>
                                        </p>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span>Mendukung Semua Bank & E-Wallet</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Upload Proof Form */}
                            <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                <div>
                                    <h3 className="font-bold text-sm text-[#101c36] uppercase tracking-wide font-mono">
                                        Upload Bukti Transfer
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Unggah tangkapan layar struk/bukti transfer agar admin dapat langsung menyetujui akun Anda.
                                    </p>
                                </div>

                                {pendingPayment.proof_image ? (
                                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                                        <div>
                                            <div className="font-bold text-xs text-emerald-800">
                                                Bukti Pembayaran Sudah Diunggah
                                            </div>
                                            <p className="text-[11px] text-emerald-700 mt-1 font-mono">
                                                Status: <strong>Sedang Diverifikasi Super Admin</strong>
                                            </p>
                                        </div>
                                        <a
                                            href={pendingPayment.proof_image}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-block text-[11px] font-mono font-bold text-emerald-800 underline hover:text-emerald-950"
                                        >
                                            Lihat File Bukti
                                        </a>
                                    </div>
                                ) : (
                                    <form onSubmit={handleUploadSubmit} className="space-y-4">
                                        {/* Dropzone Container */}
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-[#ea580c] transition-colors cursor-pointer relative bg-white">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                required
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            {previewUrl ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Pratinjau Struk"
                                                        className="max-h-36 mx-auto rounded-lg shadow-sm object-contain"
                                                    />
                                                    <span className="text-[11px] font-mono text-emerald-600 font-bold block">
                                                        ✓ File terpilih (Klik untuk ganti)
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="space-y-1.5 py-4">
                                                    <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                                                    <div className="text-xs font-bold text-slate-700">
                                                        Pilih Screenshot Bukti Transfer
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-mono">
                                                        Format JPG, PNG, atau WebP (Maks. 5MB)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {proofErrors.proof_image && (
                                            <p className="text-xs text-rose-600 font-mono">{proofErrors.proof_image}</p>
                                        )}

                                        <div>
                                            <label className="block text-[11px] font-mono text-slate-600 mb-1">
                                                Catatan / Nama Pengirim (Opsional):
                                            </label>
                                            <input
                                                type="text"
                                                value={proofData.notes}
                                                onChange={(e) => setProofData('notes', e.target.value)}
                                                placeholder="Contoh: BCA a.n. Alexander"
                                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#ea580c] font-mono"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={uploadingProof || !proofData.proof_image}
                                            className="w-full py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            <span>{uploadingProof ? 'Mengirim Bukti...' : 'Kirim Bukti Pembayaran'}</span>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* PRICING COMPARISON CARDS */}
                <div>
                    <div className="text-center max-w-xl mx-auto mb-8">
                        <h2 className="text-2xl font-extrabold text-[#101c36] tracking-tight">
                            Pilihan Paket Berlangganan
                        </h2>
                        <p className="text-xs text-slate-600 mt-1">
                            Pilih tier yang paling sesuai dengan kebutuhan produktivitas dan klien Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 1. Free Tier */}
                        <div className={`rounded-3xl border p-6 flex flex-col justify-between transition-all bg-white ${
                            tier === 'free' ? 'border-[#101c36] shadow-md ring-1 ring-[#101c36]' : 'border-slate-200'
                        }`}>
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-base text-[#101c36]">Free Starter</h3>
                                    {tier === 'free' && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                            Paket Anda
                                        </span>
                                    )}
                                </div>
                                <div className="text-2xl font-extrabold font-mono text-[#101c36] mb-1">
                                    Rp 0 <span className="text-xs font-normal text-slate-400">/ selamanya</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-6">
                                    Cocok untuk eksplorasi awal, mahasiswa, dan mencoba kualitas codebase generator.
                                </p>

                                <div className="space-y-3 font-mono text-xs border-t border-slate-100 pt-4">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>1 Proyek Aktif seumur hidup</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Maksimal 3 Modul Tabel</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span><strong>1x Unduh ZIP Codebase</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Tabel, Galeri Grid, Kanban View</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Live Database AWS RDS</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled
                                className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 font-mono text-xs font-bold cursor-default"
                            >
                                {tier === 'free' ? 'Aktif Saat Ini' : 'Tingkat Bawah'}
                            </button>
                        </div>

                        {/* 2. Pro Tier (Best Seller) */}
                        <div className={`rounded-3xl border-2 p-6 flex flex-col justify-between transition-all bg-white relative shadow-lg ${
                            tier === 'pro'
                                ? 'border-emerald-600 ring-2 ring-emerald-600/30'
                                : 'border-[#ea580c] ring-2 ring-orange-500/20'
                        }`}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#ea580c] text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                                PALING DIMINATI FREELANCER
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3 mt-1">
                                    <h3 className="font-extrabold text-base text-[#101c36] flex items-center gap-1.5">
                                        <Zap className="w-4 h-4 text-[#ea580c] fill-current" />
                                        <span>Pro Solo Builder</span>
                                    </h3>
                                    {tier === 'pro' && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                            Paket Anda
                                        </span>
                                    )}
                                </div>
                                <div className="text-2xl font-extrabold font-mono text-[#ea580c] mb-1">
                                    Rp 49.000 <span className="text-xs font-normal text-slate-500">/ bulan</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-6">
                                    Untuk solo developer & freelancer yang ingin membuatkan aplikasi klien tanpa batas modul.
                                </p>

                                <div className="space-y-3 font-mono text-xs border-t border-slate-100 pt-4">
                                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                                        <span><strong>Unlimited Modul</strong> (Bebas buat banyak tabel)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                                        <span><strong>Unduh ZIP Codebase Tanpa Batas</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Hingga 5 Proyek Aktif</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Semua 43+ Tema TweakCN & Custom CSS</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Multi-Paradigm: Tabel, Grid, Kanban</span>
                                    </div>
                                </div>
                            </div>

                            {tier === 'pro' ? (
                                <button
                                    type="button"
                                    onClick={() => handleCreateInvoice('pro')}
                                    disabled={creatingInvoice}
                                    className="mt-6 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all shadow-sm"
                                >
                                    Perpanjang 30 Hari Lagi
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleCreateInvoice('pro')}
                                    disabled={creatingInvoice}
                                    className="mt-6 w-full py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-mono text-xs font-bold transition-all shadow-md shadow-orange-900/20 flex items-center justify-center gap-1.5"
                                >
                                    <span>Upgrade ke Pro (Rp 49.000)</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* 3. Agency Tier */}
                        <div className={`rounded-3xl border p-6 flex flex-col justify-between transition-all bg-white ${
                            tier === 'agency' ? 'border-purple-600 shadow-md ring-1 ring-purple-600' : 'border-slate-200'
                        }`}>
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-base text-[#101c36] flex items-center gap-1.5">
                                        <Building2 className="w-4 h-4 text-purple-600" />
                                        <span>Agency Studio</span>
                                    </h3>
                                    {tier === 'agency' && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                            Paket Anda
                                        </span>
                                    )}
                                </div>
                                <div className="text-2xl font-extrabold font-mono text-purple-700 mb-1">
                                    Rp 199.000 <span className="text-xs font-normal text-slate-500">/ bulan</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-6">
                                    Untuk software house & agensi yang memproduksi belasan aplikasi kustom setiap bulan.
                                </p>

                                <div className="space-y-3 font-mono text-xs border-t border-slate-100 pt-4">
                                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                        <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 stroke-[3]" />
                                        <span><strong>Unlimited Proyek</strong> (Tanpa Batas)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                        <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 stroke-[3]" />
                                        <span><strong>Unlimited Modul</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                        <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 stroke-[3]" />
                                        <span><strong>Unlimited Unduh ZIP</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                        <span>Prioritas Feature Request Roadmap</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                        <span>Dukungan WhatsApp Direct</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleCreateInvoice('agency')}
                                disabled={creatingInvoice || tier === 'agency'}
                                className="mt-6 w-full py-2.5 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900 font-mono text-xs font-bold transition-all"
                            >
                                {tier === 'agency' ? 'Aktif Saat Ini' : 'Pilih Agency (Rp 199.000)'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* INVOICE & PAYMENT HISTORY TABLE */}
                <div className="bg-white rounded-3xl border border-[#101c36]/15 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <h3 className="font-bold text-sm text-[#101c36] font-mono uppercase tracking-wider flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span>Riwayat Tagihan & Pembayaran</span>
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                                <tr>
                                    <th className="py-3 px-6">No. Invoice</th>
                                    <th className="py-3 px-6">Paket</th>
                                    <th className="py-3 px-6">Total Tagihan</th>
                                    <th className="py-3 px-6">Metode</th>
                                    <th className="py-3 px-6">Status</th>
                                    <th className="py-3 px-6">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payments.length > 0 ? (
                                    payments.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3.5 px-6 font-bold text-[#101c36]">
                                                {p.invoice_number}
                                            </td>
                                            <td className="py-3.5 px-6 uppercase font-bold text-slate-700">
                                                {p.tier}
                                            </td>
                                            <td className="py-3.5 px-6 font-bold text-slate-900">
                                                {formatCurrency(p.total_amount)}
                                            </td>
                                            <td className="py-3.5 px-6 uppercase text-slate-500">
                                                {p.payment_method}
                                            </td>
                                            <td className="py-3.5 px-6">
                                                {p.status === 'approved' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Disetujui
                                                    </span>
                                                )}
                                                {p.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                        <Clock className="w-3 h-3 text-amber-600" /> Menunggu
                                                    </span>
                                                )}
                                                {p.status === 'rejected' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200" title={p.admin_notes || ''}>
                                                        <XCircle className="w-3 h-3 text-rose-600" /> Ditolak
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-6 text-slate-500">
                                                {formatDate(p.created_at)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-400">
                                            Belum ada riwayat transaksi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ArchitectLayout>
    );
}
