import React, { useState } from 'react';
import ArchitectLayout from '@/Layouts/Architect/ArchitectLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Users,
    CreditCard,
    ExternalLink,
    Check,
    X,
    Filter,
    Calendar,
    Sparkles,
    UserCheck,
    AlertCircle,
    Eye
} from 'lucide-react';

interface PaymentItem {
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
    user: {
        id: number;
        name: string;
        email: string;
        handle: string;
        tier: string;
    };
    approver?: {
        name: string;
    };
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    handle: string;
    role: string;
    tier: string;
    tier_expires_at?: string;
    lifetime_projects_count: number;
    lifetime_exports_count: number;
    created_at: string;
}

interface AdminIndexProps {
    payments: {
        data: PaymentItem[];
        links: any[];
        total: number;
    };
    users: {
        data: UserItem[];
        links: any[];
        total: number;
    };
    stats: {
        pending_count: number;
        approved_count: number;
        total_users: number;
        pro_users: number;
        agency_users: number;
    };
    currentStatus: string;
}

export default function AdminSubscriptionIndex({
    payments,
    users,
    stats,
    currentStatus = 'all'
}: AdminIndexProps) {
    const [activeTab, setActiveTab] = useState<'payments' | 'users'>('payments');
    const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
    const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [userSearch, setUserSearch] = useState('');

    // Editing user tier modal
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const { data: userForm, setData: setUserForm, post: postUserUpdate, processing: savingUser } = useForm({
        tier: 'free',
        role: 'user',
        add_days: 30
    });

    const handleApprove = (payment: PaymentItem) => {
        if (confirm(`Setujui pembayaran ${payment.invoice_number} dari ${payment.user.name} sebesar Rp ${Number(payment.total_amount).toLocaleString('id-ID')}? Akun user akan langsung aktif ke paket ${payment.tier.toUpperCase()} selama 30 hari.`)) {
            router.post(route('admin.subscriptions.approve', payment.id), {}, {
                preserveScroll: true
            });
        }
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectingPaymentId) return;
        router.post(
            route('admin.subscriptions.reject', rejectingPaymentId),
            { admin_notes: rejectReason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejectingPaymentId(null);
                    setRejectReason('');
                }
            }
        );
    };

    const handleOpenEditUser = (u: UserItem) => {
        setEditingUser(u);
        setUserForm({
            tier: u.tier || 'free',
            role: u.role || 'user',
            add_days: 30
        });
    };

    const handleSaveUserTier = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        postUserUpdate(route('admin.users.update-tier', editingUser.id), {
            preserveScroll: true,
            onSuccess: () => setEditingUser(null)
        });
    };

    const filteredUsers = users.data.filter((u) => {
        if (!userSearch.trim()) return true;
        const q = userSearch.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });

    return (
        <ArchitectLayout title="Super Admin Panel">
            <Head title="Super Admin Dashboard - Architect SaaS" />

            <div className="space-y-8">
                {/* Top Header Banner */}
                <div className="bg-[#07090e] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            <span className="text-purple-400 font-bold uppercase tracking-wider">
                                Pusat Kontrol Administrator
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Verifikasi Pembayaran & Kelola Tier
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                            Konfirmasi bukti transfer QRIS manual, aktifkan paket pelanggan, dan kelola hak akses pengguna.
                        </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <span className="text-[10px] text-amber-400 uppercase font-bold block">
                                Butuh Verifikasi
                            </span>
                            <span className="text-2xl font-extrabold text-white">
                                {stats.pending_count}
                            </span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                                Pro Pelanggan
                            </span>
                            <span className="text-2xl font-extrabold text-white">
                                {stats.pro_users}
                            </span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <span className="text-[10px] text-purple-400 uppercase font-bold block">
                                Total Pengguna
                            </span>
                            <span className="text-2xl font-extrabold text-white">
                                {stats.total_users}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher & Status Filter */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl border border-slate-300 font-mono text-xs w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab('payments')}
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold transition-all ${
                                activeTab === 'payments'
                                    ? 'bg-white text-[#101c36] shadow-sm'
                                    : 'text-slate-600 hover:text-[#101c36]'
                            }`}
                        >
                            Verifikasi Pembayaran ({payments.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('users')}
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold transition-all ${
                                activeTab === 'users'
                                    ? 'bg-white text-[#101c36] shadow-sm'
                                    : 'text-slate-600 hover:text-[#101c36]'
                            }`}
                        >
                            Manajemen Akun User ({users.total})
                        </button>
                    </div>

                    {activeTab === 'payments' && (
                        <div className="flex items-center gap-1.5 font-mono text-xs w-full sm:w-auto justify-end">
                            <span className="text-slate-500 text-[11px] mr-1">Filter:</span>
                            {['all', 'pending', 'approved', 'rejected'].map((st) => (
                                <Link
                                    key={st}
                                    href={route('admin.subscriptions.index', { status: st })}
                                    className={`px-3 py-1.5 rounded-xl uppercase text-[10px] font-bold transition-colors ${
                                        currentStatus === st
                                            ? 'bg-[#101c36] text-white shadow-xs'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    {st === 'all' ? 'Semua' : st}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* ======================================================== */}
                {/* TAB 1: VERIFIKASI PEMBAYARAN MASUK */}
                {/* ======================================================== */}
                {activeTab === 'payments' && (
                    <div className="bg-white rounded-3xl border border-[#101c36]/15 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-mono text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                                    <tr>
                                        <th className="py-3 px-4 text-center w-20">Bukti Struk</th>
                                        <th className="py-3 px-4">No. Invoice & User</th>
                                        <th className="py-3 px-4">Paket Tier</th>
                                        <th className="py-3 px-4">Total Transfer</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Waktu</th>
                                        <th className="py-3 px-4 text-right">Aksi Super Admin</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {payments.data.length > 0 ? (
                                        payments.data.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                                {/* Struk Thumbnail */}
                                                <td className="py-3 px-4 text-center">
                                                    {p.proof_image ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedProofUrl(p.proof_image!)}
                                                            className="w-12 h-12 rounded-xl overflow-hidden border border-slate-300 hover:border-[#ea580c] hover:scale-105 transition-all shadow-2xs relative group block mx-auto"
                                                            title="Klik untuk melihat bukti struk ukuran penuh"
                                                        >
                                                            <img
                                                                src={p.proof_image}
                                                                alt="Struk"
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </div>
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400 italic block">
                                                            Belum upload
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Invoice & User */}
                                                <td className="py-3 px-4">
                                                    <span className="font-bold text-[#101c36] block">
                                                        {p.invoice_number}
                                                    </span>
                                                    <span className="text-slate-600 block text-[11px]">
                                                        {p.user?.name} ({p.user?.email})
                                                    </span>
                                                    {p.notes && (
                                                        <span className="text-[10px] text-slate-400 italic block truncate max-w-xs">
                                                            Catatan: "{p.notes}"
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Tier */}
                                                <td className="py-3 px-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                                        p.tier === 'agency'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-emerald-100 text-emerald-800'
                                                    }`}>
                                                        {p.tier}
                                                    </span>
                                                </td>

                                                {/* Total Transfer */}
                                                <td className="py-3 px-4">
                                                    <span className="font-extrabold text-sm text-[#101c36] block">
                                                        Rp {Number(p.total_amount).toLocaleString('id-ID')}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500">
                                                        Pokok: Rp {Number(p.base_amount).toLocaleString('id-ID')} +{' '}
                                                        <strong className="text-[#ea580c]">{p.unique_code}</strong>
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="py-3 px-4">
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

                                                {/* Date */}
                                                <td className="py-3 px-4 text-slate-500 text-[11px]">
                                                    {new Date(p.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3 px-4 text-right">
                                                    {p.status === 'pending' ? (
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleApprove(p)}
                                                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors"
                                                            >
                                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                                <span>Setujui</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setRejectingPaymentId(p.id);
                                                                    setRejectReason('Bukti transfer tidak valid / dana belum masuk rekening.');
                                                                }}
                                                                className="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                                <span>Tolak</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400 italic">
                                                            Selesai
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-slate-400">
                                                Tidak ada transaksi yang cocok dengan filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ======================================================== */}
                {/* TAB 2: MANAJEMEN AKUN USER & UBAH TIER MANUAL */}
                {/* ======================================================== */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-3xl border border-[#101c36]/15 overflow-hidden shadow-sm space-y-4 p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="relative w-full sm:w-80">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    placeholder="Cari nama atau email user..."
                                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#101c36]"
                                />
                            </div>
                            <span className="text-xs font-mono text-slate-500">
                                Menampilkan {filteredUsers.length} dari {users.total} pengguna
                            </span>
                        </div>

                        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                            <table className="w-full text-left font-mono text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                                    <tr>
                                        <th className="py-3 px-4">Nama & Email</th>
                                        <th className="py-3 px-4">Role</th>
                                        <th className="py-3 px-4">Tier Langganan</th>
                                        <th className="py-3 px-4">Masa Aktif</th>
                                        <th className="py-3 px-4">Statistik Penggunaan</th>
                                        <th className="py-3 px-4 text-right">Kelola</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <span className="font-bold text-[#101c36] block">{u.name}</span>
                                                <span className="text-slate-500 text-[11px]">{u.email}</span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                    u.role === 'superadmin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                                                    u.tier === 'agency'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : u.tier === 'pro'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {u.tier || 'free'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                                                {u.tier_expires_at ? new Date(u.tier_expires_at).toLocaleDateString('id-ID') : 'Selamanya / N/A'}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                                                Proyek: {u.lifetime_projects_count}x • Ekspor: {u.lifetime_exports_count}x
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEditUser(u)}
                                                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-[11px] text-[#101c36] shadow-2xs transition-colors"
                                                >
                                                    Ubah Tier / Role
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* FULL RESOLUTION STRUK VIEWER MODAL */}
            {selectedProofUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
                    <div className="bg-[#0e172a] rounded-3xl max-w-2xl w-full p-4 border border-white/20 text-white flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 px-2">
                            <span className="font-mono text-xs font-bold text-slate-300">
                                Pratinjau Struk / Bukti Transfer
                            </span>
                            <button
                                onClick={() => setSelectedProofUrl(null)}
                                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-2 text-center">
                            <img
                                src={selectedProofUrl}
                                alt="Struk Penuh"
                                className="max-h-[75vh] mx-auto rounded-xl object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* REJECT NOTE MODAL */}
            {rejectingPaymentId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 text-[#101c36] space-y-4">
                        <h3 className="font-bold text-base">Alasan Penolakan Pembayaran</h3>
                        <form onSubmit={handleRejectSubmit} className="space-y-4">
                            <textarea
                                rows={3}
                                required
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                                placeholder="Contoh: Bukti transfer tidak terbaca / dana belum masuk."
                            />
                            <div className="flex items-center justify-end gap-2 font-mono text-xs">
                                <button
                                    type="button"
                                    onClick={() => setRejectingPaymentId(null)}
                                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                                >
                                    Tolak Pembayaran
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT USER TIER MODAL */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-sans">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 text-[#101c36] space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="font-bold text-base">Kelola Tier & Hak Akses</h3>
                                <p className="text-xs text-slate-500 font-mono">{editingUser.name} ({editingUser.email})</p>
                            </div>
                            <button onClick={() => setEditingUser(null)} className="p-1 rounded hover:bg-slate-100">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveUserTier} className="space-y-4 font-mono text-xs">
                            <div>
                                <label className="block text-slate-600 mb-1">Pilih Tier Pelanggan:</label>
                                <select
                                    value={userForm.tier}
                                    onChange={(e) => setUserForm('tier', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                                >
                                    <option value="free">🥉 Free (Batas 1 Proyek & 3 Modul)</option>
                                    <option value="pro">🥈 Pro Solo Builder (Unlimited Modul)</option>
                                    <option value="agency">🥇 Agency Studio (Unlimited Semua)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-600 mb-1">Tambah Masa Aktif (Hari):</label>
                                <input
                                    type="number"
                                    value={userForm.add_days}
                                    onChange={(e) => setUserForm('add_days', parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                                    placeholder="Contoh: 30"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-600 mb-1">Role Akun:</label>
                                <select
                                    value={userForm.role}
                                    onChange={(e) => setUserForm('role', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                                >
                                    <option value="user">User Biasa</option>
                                    <option value="superadmin">👑 Super Admin</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingUser}
                                    className="px-5 py-2.5 rounded-xl bg-[#101c36] text-white font-bold hover:bg-[#1a2d54]"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ArchitectLayout>
    );
}
