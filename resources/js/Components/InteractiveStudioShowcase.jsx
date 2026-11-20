import React, { useState, useRef } from 'react';
import {
    Database,
    Code,
    Layout,
    Layers,
    ArrowRight,
    Check,
    Copy,
    Plus,
    Search,
    ExternalLink,
    Shield,
    Sparkles,
    SlidersHorizontal,
    Table,
    FileCode,
    Cpu
} from 'lucide-react';

export default function InteractiveStudioShowcase() {
    const [activeTab, setActiveTab] = useState('app'); // 'app', 'model', 'migration'
    const [selectedTable, setSelectedTable] = useState('invoices');
    const [searchQuery, setSearchQuery] = useState('');
    const [copied, setCopied] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    // 3D Parallax Tilt Reference
    const cardRef = useRef(null);
    const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)' });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4; // Max -4 to +4 deg
        const rotateY = ((x - centerX) / centerX) * 5;  // Max -5 to +5 deg

        setTiltStyle({
            transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
            transition: 'transform 0.1s ease-out',
        });
    };

    const handleMouseLeave = () => {
        setTiltStyle({
            transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        });
    };

    const sampleInvoices = [
        { id: 'INV-001', client: 'Acme Cloud Corp', amount: '$4,250.00', status: 'Paid', date: 'Nov 12, 2026' },
        { id: 'INV-002', client: 'Starlight Studio', amount: '$8,100.00', status: 'Paid', date: 'Nov 14, 2026' },
        { id: 'INV-003', client: 'Horizon Digital', amount: '$1,750.00', status: 'Pending', date: 'Nov 15, 2026' },
        { id: 'INV-004', client: 'Apex Architecture', amount: '$12,400.00', status: 'Draft', date: 'Nov 18, 2026' },
    ];

    const filteredInvoices = sampleInvoices.filter((inv) => {
        const matchesSearch = inv.client.toLowerCase().includes(searchQuery.toLowerCase()) || inv.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || inv.status.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const eloquentSnippet = `<?php

namespace App\\Modules\\Invoice\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Concerns\\HasUuids;
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class Invoice extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'invoices';
    protected $guarded = [];

    protected $casts = [
        'amount_cents' => 'integer',
        'due_date' => 'date',
    ];

    /**
     * Automatic row-level multi-tenant query scope.
     */
    public function scopeForProject($query, string $projectId)
    {
        return $query->where('project_id', $projectId);
    }
}`;

    const migrationSnippet = `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id')->index(); // Tenant Isolation
            $table->string('invoice_number', 64)->unique();
            $table->bigInteger('amount_cents')->unsigned();
            $table->string('status', 32)->default('draft');
            $table->date('due_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(activeTab === 'migration' ? migrationSnippet : eloquentSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
            className="w-full max-w-6xl mx-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c101d]/90 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300"
        >
            {/* Window Chrome Titlebar */}
            <div className="h-12 border-b border-white/10 bg-[#090d18] px-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 font-semibold ml-2 hidden sm:inline">
                        Architect Studio — <span className="text-sky-400">AcmeSaaS.architect</span>
                    </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>RDS MySQL Connected</span>
                    </div>
                    <span className="text-slate-500 font-mono hidden md:inline">PSR-12 OK</span>
                </div>
            </div>

            {/* Main Interactive Studio Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                
                {/* LEFT COLUMN: Visual Schema Modeler */}
                <div className="lg:col-span-5 bg-[#080c16] border-b lg:border-b-0 lg:border-r border-white/10 p-5 sm:p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-sky-400" />
                                <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                                    Visual Schema Canvas
                                </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">3 Models Defined</span>
                        </div>

                        {/* Interactive Table Cards */}
                        <div className="space-y-3 relative">
                            {/* Animated SVG Relational Link line */}
                            <svg className="absolute -left-1 top-8 bottom-8 w-6 pointer-events-none text-sky-400/40" fill="none">
                                <path d="M 12 10 C 2 30, 2 70, 12 90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                <circle cx="12" cy="10" r="3" fill="#38bdf8" />
                                <circle cx="12" cy="90" r="3" fill="#38bdf8" />
                            </svg>

                            {/* Table 1: Projects (Tenant Root) */}
                            <div
                                onClick={() => setSelectedTable('projects')}
                                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                                    selectedTable === 'projects'
                                        ? 'bg-sky-950/40 border-sky-400/60 shadow-lg shadow-sky-950/50'
                                        : 'bg-[#0f1424] border-white/5 hover:border-white/15'
                                }`}
                            >
                                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5 text-sky-400" /> projects
                                    </span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                        TENANT ROOT
                                    </span>
                                </div>
                                <div className="pt-2 font-mono text-[11px] space-y-1 text-slate-400">
                                    <div className="flex justify-between"><span>id</span><span className="text-sky-300">UUID (PK)</span></div>
                                    <div className="flex justify-between"><span>name</span><span className="text-slate-500">string</span></div>
                                    <div className="flex justify-between"><span>handle</span><span className="text-slate-500">string (uq)</span></div>
                                </div>
                            </div>

                            {/* Table 2: Invoices (Child Model) */}
                            <div
                                onClick={() => setSelectedTable('invoices')}
                                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                                    selectedTable === 'invoices'
                                        ? 'bg-sky-950/40 border-sky-400/60 shadow-lg shadow-sky-950/50'
                                        : 'bg-[#0f1424] border-white/5 hover:border-white/15'
                                }`}
                            >
                                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                        <Table className="w-3.5 h-3.5 text-emerald-400" /> invoices
                                    </span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        ACTIVE MODEL
                                    </span>
                                </div>
                                <div className="pt-2 font-mono text-[11px] space-y-1 text-slate-400">
                                    <div className="flex justify-between"><span>id</span><span className="text-sky-300">UUID (PK)</span></div>
                                    <div className="flex justify-between text-emerald-300 font-semibold">
                                        <span>project_id</span><span>UUID (FK)</span>
                                    </div>
                                    <div className="flex justify-between"><span>invoice_number</span><span className="text-slate-500">string (uq)</span></div>
                                    <div className="flex justify-between"><span>amount_cents</span><span className="text-slate-500">bigint</span></div>
                                    <div className="flex justify-between"><span>status</span><span className="text-slate-500">enum</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Explainer Note */}
                    <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/20 text-xs text-slate-300 leading-relaxed font-sans">
                        <div className="flex items-center gap-1.5 font-bold text-sky-400 mb-0.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Instant Multi-Tenancy</span>
                        </div>
                        Connecting tables automatically creates row-level query scopes and foreign keys. No raw SQL required.
                    </div>
                </div>

                {/* RIGHT COLUMN: Output Switcher (Live Interactive App vs Code) */}
                <div className="lg:col-span-7 bg-[#0b0f1c] flex flex-col">
                    {/* Mode Toggle Header */}
                    <div className="h-12 border-b border-white/10 bg-[#090d18] px-4 sm:px-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('app')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    activeTab === 'app'
                                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Layout className="w-3.5 h-3.5" />
                                <span>Live Generated App</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('model')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    activeTab === 'model'
                                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <FileCode className="w-3.5 h-3.5" />
                                <span>Eloquent Model</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('migration')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all hidden sm:flex ${
                                    activeTab === 'migration'
                                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Code className="w-3.5 h-3.5" />
                                <span>Migration</span>
                            </button>
                        </div>

                        {activeTab !== 'app' && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded border border-white/10 hover:border-white/20 transition-colors"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copied ? 'COPIED' : 'COPY'}</span>
                            </button>
                        )}
                    </div>

                    {/* Content View */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                        {activeTab === 'app' ? (
                            /* TAB 1: Live Interactive Generated CRUD View */
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div>
                                        <h4 className="font-bold text-white text-base">Invoices Register</h4>
                                        <p className="text-xs text-slate-400">Live multi-tenant CRUD view generated automatically</p>
                                    </div>
                                    <button className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1">
                                        <Plus className="w-3.5 h-3.5" /> New Invoice
                                    </button>
                                </div>

                                {/* Search & Filter Ribbon */}
                                <div className="flex items-center justify-between gap-3 pt-1">
                                    <div className="relative flex-1">
                                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Filter invoices or client name..."
                                            className="w-full bg-[#080c16] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                                        />
                                    </div>

                                    <div className="flex items-center gap-1 text-xs">
                                        {['all', 'paid', 'pending'].map((st) => (
                                            <button
                                                key={st}
                                                onClick={() => setFilterStatus(st)}
                                                className={`px-2.5 py-1 rounded capitalize text-[11px] font-medium transition-colors ${
                                                    filterStatus === st
                                                        ? 'bg-white/15 text-white font-bold'
                                                        : 'text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                {st}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Table Display */}
                                <div className="rounded-xl border border-white/10 bg-[#080c16] overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-mono text-[11px]">
                                            <tr>
                                                <th className="p-3">INVOICE</th>
                                                <th className="p-3">CLIENT</th>
                                                <th className="p-3">AMOUNT</th>
                                                <th className="p-3">STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredInvoices.map((inv) => (
                                                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-3 font-mono font-bold text-sky-400">{inv.id}</td>
                                                    <td className="p-3 font-medium text-slate-200">{inv.client}</td>
                                                    <td className="p-3 font-mono font-semibold text-slate-300">{inv.amount}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                            inv.status === 'Paid'
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                : inv.status === 'Pending'
                                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                                : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                        }`}>
                                                            {inv.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            /* TAB 2 & 3: Clean Generated Code View */
                            <div className="rounded-xl border border-white/10 bg-[#080c16] p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-[380px]">
                                <pre className="whitespace-pre">
                                    {activeTab === 'migration' ? migrationSnippet : eloquentSnippet}
                                </pre>
                            </div>
                        )}

                        {/* Bottom Output Status Bar */}
                        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                                <Check className="w-3.5 h-3.5" />
                                <span>Zero Build Step Needed • Works in Dev & Production</span>
                            </span>
                            <span className="text-slate-500">STANDALONE GIT-READY</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

