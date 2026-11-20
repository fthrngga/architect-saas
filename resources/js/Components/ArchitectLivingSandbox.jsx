import React, { useState } from 'react';
import {
    Database,
    ArrowRight,
    Check,
    Download,
    Eye,
    Code2,
    Search,
    Layers,
    FileCode2,
    Plus,
    Trash2,
    X,
    Filter,
    Layout,
    KeyRound,
    FileText
} from 'lucide-react';

export default function ArchitectLivingSandbox() {
    const presets = [
        {
            id: 'projects',
            label: 'Manajemen Proyek',
            description: 'Struktur relasi multi-tenant untuk manajemen proyek dan tagihan.',
            entities: [
                {
                    name: 'workspaces',
                    role: 'Root Workspace (Tenant)',
                    badge: 'UUID Primary Key',
                    fields: [
                        { name: 'id', type: 'uuid PK', isPrimary: true },
                        { name: 'name', type: 'string' },
                        { name: 'slug', type: 'string (unique)' },
                        { name: 'created_at', type: 'timestamp' }
                    ]
                },
                {
                    name: 'projects',
                    role: 'Entitas Utama (Scoped)',
                    badge: 'Scoped Entity',
                    fields: [
                        { name: 'id', type: 'uuid PK', isPrimary: true },
                        { name: 'workspace_id', type: 'foreignKey -> workspaces.id', isRelation: true },
                        { name: 'title', type: 'string (searchable)' },
                        { name: 'budget', type: 'decimal(12,2)' },
                        { name: 'status', type: 'enum' }
                    ]
                },
                {
                    name: 'invoices',
                    role: 'Relasi Child',
                    badge: 'Child Table',
                    fields: [
                        { name: 'id', type: 'uuid PK', isPrimary: true },
                        { name: 'project_id', type: 'foreignKey -> projects.id', isRelation: true },
                        { name: 'amount', type: 'decimal(12,2)' },
                        { name: 'is_paid', type: 'boolean' }
                    ]
                }
            ],
            initialProjects: [
                { id: 1, title: 'Quantum Billing System', client: 'PT Acme Solusi', budget: 'Rp 45.000.000', status: 'Active', updated: '10 menit lalu' },
                { id: 2, title: 'Portal Rekam Medis Helix', client: 'Klinik Sehat Utama', budget: 'Rp 82.000.000', status: 'Completed', updated: '1 jam lalu' },
                { id: 3, title: 'CRM Distribusi Solaria', client: 'Solaria Daya Mandiri', budget: 'Rp 64.000.000', status: 'Active', updated: '3 jam lalu' },
                { id: 4, title: 'Logistik Pergudangan Hub', client: 'Vanguard Cargo', budget: 'Rp 115.000.000', status: 'Pending', updated: 'Kemarin' },
            ],
            codeFiles: {
                controller: {
                    title: 'ProjectController.php',
                    path: 'app/Http/Controllers/ProjectController.php',
                    badge: 'PSR-12 Controller',
                    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Project;
use Inertia\\Inertia;
use Illuminate\\Http\\Request;

class ProjectController extends Controller
{
    /**
     * Menampilkan daftar project sesuai tenant yang sedang login.
     */
    public function index(Request $request)
    {
        $projects = Project::where('workspace_id', $request->user()->workspace_id)
            ->when($request->search, fn($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->latest()
            ->paginate(10);

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters'  => $request->only(['search', 'status'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'  => 'required|string|max:255',
            'client' => 'required|string|max:255',
            'budget' => 'required|numeric|min:0',
        ]);

        $project = $request->user()->workspace->projects()->create($validated);

        return back()->with('success', 'Project berhasil ditambahkan.');
    }
}`
                },
                model: {
                    title: 'Project.php',
                    path: 'app/Models/Project.php',
                    badge: 'Eloquent Model',
                    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Concerns\\HasUuids;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Project extends Model
{
    use HasUuids, SoftDeletes;

    protected $guarded = ['id'];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}`
                },
                migration: {
                    title: '2026_create_projects_table.php',
                    path: 'database/migrations/2026_01_01_000001_create_projects_table.php',
                    badge: 'Database Migration',
                    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('title')->index();
            $table->string('client');
            $table->decimal('budget', 12, 2)->default(0.00);
            $table->string('status')->default('Active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};`
                }
            }
        },
        {
            id: 'medical',
            label: 'Layanan Medis',
            description: 'Struktur data pasien, dokter, dan catatan rekam medis terenkripsi.',
            entities: [
                {
                    name: 'clinics',
                    role: 'Root Clinic (Tenant)',
                    badge: 'UUID Primary Key',
                    fields: [
                        { name: 'id', type: 'uuid PK', isPrimary: true },
                        { name: 'name', type: 'string' },
                        { name: 'sip_number', type: 'string' },
                        { name: 'created_at', type: 'timestamp' }
                    ]
                },
                {
                    name: 'patients',
                    role: 'Data Pasien (Scoped)',
                    badge: 'Scoped Entity',
                    fields: [
                        { name: 'id', type: 'uuid PK', isPrimary: true },
                        { name: 'clinic_id', type: 'foreignKey -> clinics.id', isRelation: true },
                        { name: 'name', type: 'string (searchable)' },
                        { name: 'mrn', type: 'string (unique)' },
                        { name: 'status', type: 'enum' }
                    ]
                },
                {
                    name: 'consultations',
                    role: 'Catatan Konsultasi',
                    badge: 'Child Table',
                    fields: [
                        { name: 'id', type: 'uuid PK', isPrimary: true },
                        { name: 'patient_id', type: 'foreignKey -> patients.id', isRelation: true },
                        { name: 'diagnosis', type: 'text (encrypted)' },
                        { name: 'consultation_fee', type: 'decimal(10,2)' }
                    ]
                }
            ],
            initialProjects: [
                { id: 1, title: 'Konsultasi dr. Hendra, Sp.A', client: 'Pasien: Rayyan Pratama (MRN-102)', budget: 'Rp 350.000', status: 'Completed', updated: '15 menit lalu' },
                { id: 2, title: 'Pemeriksaan Lab Rutin', client: 'Pasien: Siti Nurhaliza (MRN-188)', budget: 'Rp 650.000', status: 'Active', updated: '40 menit lalu' },
                { id: 3, title: 'Konsultasi dr. Sarah, Sp.PD', client: 'Pasien: Bpk Sudirman (MRN-094)', budget: 'Rp 400.000', status: 'Active', updated: '2 jam lalu' },
                { id: 4, title: 'Evaluasi Pasca Terapi', client: 'Pasien: Maria Angela (MRN-210)', budget: 'Rp 300.000', status: 'Pending', updated: 'Kemarin' },
            ],
            codeFiles: {
                controller: {
                    title: 'PatientController.php',
                    path: 'app/Http/Controllers/PatientController.php',
                    badge: 'PSR-12 Controller',
                    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Patient;
use Inertia\\Inertia;
use Illuminate\\Http\\Request;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $patients = Patient::where('clinic_id', $request->user()->clinic_id)
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->latest()
            ->paginate(10);

        return Inertia::render('Patients/Index', ['patients' => $patients]);
    }
}`
                },
                model: {
                    title: 'Patient.php',
                    path: 'app/Models/Patient.php',
                    badge: 'Eloquent Model',
                    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Concerns\\HasUuids;

class Patient extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    public function consultations()
    {
        return $this->hasMany(Consultation::class);
    }
}`
                },
                migration: {
                    title: '2026_create_patients_table.php',
                    path: 'database/migrations/2026_01_01_000001_create_patients_table.php',
                    badge: 'Database Migration',
                    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('clinic_id')->constrained()->cascadeOnDelete();
            $table->string('name')->index();
            $table->string('mrn')->unique();
            $table->string('status')->default('Active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};`
                }
            }
        },
        {
            id: 'inventory',
            label: 'Manajemen Inventaris',
            description: 'Katalog gudang, barcode SKU barang, dan alur pergerakan stok.',
            entities: [
                {
                    name: 'warehouses',
                    role: 'Root Warehouse (Tenant)',
                    badge: 'UUID Primary Key',
                    fields: [
                        { name: 'id', type: 'uuid PK', isPrimary: true },
                        { name: 'code', type: 'string (unique)' },
                        { name: 'city', type: 'string' },
                        { name: 'created_at', type: 'timestamp' }
                    ]
                },
                {
                    name: 'products',
                    role: 'Katalog Produk (Scoped)',
                    badge: 'Scoped Entity',
                    fields: [
                        { name: 'id', type: 'uuid PK', isPrimary: true },
                        { name: 'warehouse_id', type: 'foreignKey -> warehouses.id', isRelation: true },
                        { name: 'name', type: 'string (searchable)' },
                        { name: 'sku', type: 'string' },
                        { name: 'stock', type: 'integer' }
                    ]
                },
                {
                    name: 'stock_logs',
                    role: 'Riwayat Mutasi',
                    badge: 'Child Table',
                    fields: [
                        { name: 'id', type: 'uuid PK', isPrimary: true },
                        { name: 'product_id', type: 'foreignKey -> products.id', isRelation: true },
                        { name: 'quantity', type: 'integer' },
                        { name: 'type', type: 'enum (in, out)' }
                    ]
                }
            ],
            initialProjects: [
                { id: 1, title: 'Inverter Surya 5000W', client: 'Gudang Utama Cakung', budget: 'Stok: 142 Unit', status: 'Active', updated: '5 menit lalu' },
                { id: 2, title: 'Kabel Tembaga 4 Core 50M', client: 'Gudang Surabaya', budget: 'Stok: 48 Roll', status: 'Completed', updated: '25 menit lalu' },
                { id: 3, title: 'Panel MCB Industri 3-Phase', client: 'Gudang Utama Cakung', budget: 'Stok: 310 Unit', status: 'Active', updated: '1 jam lalu' },
                { id: 4, title: 'Sensor Arus Digital RS485', client: 'Gudang Medan', budget: 'Stok: 85 Unit', status: 'Pending', updated: 'Kemarin' },
            ],
            codeFiles: {
                controller: {
                    title: 'ProductController.php',
                    path: 'app/Http/Controllers/ProductController.php',
                    badge: 'PSR-12 Controller',
                    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Product;
use Inertia\\Inertia;
use Illuminate\\Http\\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::where('warehouse_id', $request->user()->warehouse_id)
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->paginate(10);

        return Inertia::render('Products/Index', ['products' => $products]);
    }
}`
                },
                model: {
                    title: 'Product.php',
                    path: 'app/Models/Product.php',
                    badge: 'Eloquent Model',
                    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Concerns\\HasUuids;

class Product extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    public function stockLogs()
    {
        return $this->hasMany(StockLog::class);
    }
}`
                },
                migration: {
                    title: '2026_create_products_table.php',
                    path: 'database/migrations/2026_01_01_000001_create_products_table.php',
                    badge: 'Database Migration',
                    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('warehouse_id')->constrained()->cascadeOnDelete();
            $table->string('name')->index();
            $table->string('sku')->unique();
            $table->integer('stock')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};`
                }
            }
        }
    ];

    const [selectedPresetId, setSelectedPresetId] = useState('projects');
    const [activeTab, setActiveTab] = useState('app'); // 'blueprint' | 'app' | 'code'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [copied, setCopied] = useState(false);
    const [selectedCodeFile, setSelectedCodeFile] = useState('controller');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newClient, setNewClient] = useState('');
    const [newBudget, setNewBudget] = useState('Rp 25.000.000');
    const [recentlyAddedId, setRecentlyAddedId] = useState(null);

    const currentPreset = presets.find((p) => p.id === selectedPresetId) || presets[0];
    const [projectsData, setProjectsData] = useState(currentPreset.initialProjects);

    const handleSelectPreset = (presetId) => {
        const found = presets.find((p) => p.id === presetId);
        if (found) {
            setSelectedPresetId(presetId);
            setProjectsData(found.initialProjects);
            setSearchQuery('');
            setStatusFilter('all');
            setSelectedCodeFile('controller');
        }
    };

    const filteredProjects = projectsData.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.client.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleAddProject = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        const newId = Date.now();
        const createdProject = {
            id: newId,
            title: newTitle.trim(),
            client: newClient.trim() || 'Internal User',
            budget: newBudget.trim() || 'Rp 10.000.000',
            status: 'Active',
            updated: 'Baru saja'
        };

        setProjectsData([createdProject, ...projectsData]);
        setRecentlyAddedId(newId);
        setNewTitle('');
        setNewClient('');
        setIsAddModalOpen(false);

        setTimeout(() => {
            setRecentlyAddedId(null);
        }, 3500);
    };

    const handleDeleteProject = (id) => {
        setProjectsData((prev) => prev.filter((p) => p.id !== id));
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const codeFiles = currentPreset.codeFiles;

    return (
        <div className="w-full max-w-6xl mx-auto rounded-3xl border border-[#1e293b]/80 bg-[#0e172a] text-[#f8fafc] shadow-2xl overflow-hidden relative">
            {/* Subtle Drafting Blueprint Grid */}
            <div className="absolute inset-0 blueprint-grid pointer-events-none opacity-40" />

            {/* Workbench Top Bar */}
            <div className="relative z-10 border-b border-white/10 px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0f1d]/90 backdrop-blur-md">
                
                {/* Preset Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-[#f97316]" />
                        <span>Contoh Kasus:</span>
                    </span>
                    <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                        {presets.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => handleSelectPreset(p.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                                    selectedPresetId === p.id
                                        ? 'bg-[#ea580c] text-white shadow-sm font-semibold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3 Step Tabs */}
                <div className="flex items-center bg-black/60 p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto shadow-inner">
                    <button
                        onClick={() => setActiveTab('blueprint')}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                            activeTab === 'blueprint'
                                ? 'bg-[#f4f1ea] text-[#0e172a] shadow-md'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Database className="w-3.5 h-3.5" />
                        <span>1. Skema Database</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('app')}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                            activeTab === 'app'
                                ? 'bg-[#ea580c] text-white shadow-md shadow-orange-950/50'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Layout className="w-3.5 h-3.5" />
                        <span>2. Pratinjau CRUD</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('code')}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                            activeTab === 'code'
                                ? 'bg-[#f4f1ea] text-[#0e172a] shadow-md'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>3. Kode Laravel</span>
                    </button>
                </div>
            </div>

            {/* Workbench Viewport with Smooth Scale-In */}
            <div className="relative z-10 p-6 sm:p-10 min-h-[500px] flex flex-col justify-center">

                {/* TAB 1: VISUAL BLUEPRINT */}
                {activeTab === 'blueprint' && (
                    <div key={`tab-blueprint-${selectedPresetId}`} className="space-y-6 anim-scale-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="font-mono text-xs text-[#f97316] font-semibold tracking-wider uppercase">
                                    Tahap 01 &bull; Desain Relasi Antar Tabel
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-poster text-white tracking-wide mt-1">
                                    Skema Database Otomatis & Terisolasi
                                </h3>
                                <p className="text-sm text-slate-300 mt-1 max-w-xl font-sans">
                                    {currentPreset.description} Setiap entitas memiliki foreign key dengan aturan integritas data cascade delete otomatis.
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveTab('app')}
                                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold flex items-center gap-2 border border-white/10 self-start sm:self-auto transition-all"
                            >
                                <span>Lihat Pratinjau Aplikasi</span>
                                <ArrowRight className="w-4 h-4 text-[#f97316]" />
                            </button>
                        </div>

                        {/* Visual Entity Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {currentPreset.entities.map((ent, idx) => (
                                <div
                                    key={ent.name}
                                    className={`rounded-2xl p-5 border transition-all duration-200 ${
                                        idx === 1
                                            ? 'border-[#ea580c] bg-orange-950/20 shadow-lg ring-1 ring-[#ea580c]/50'
                                            : 'border-white/10 bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
                                        <div>
                                            <h4 className="font-mono font-bold text-white text-sm">{ent.name}</h4>
                                            <span className="text-[11px] text-slate-400 font-sans">{ent.role}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                                            {ent.badge}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-xs font-mono text-slate-300">
                                        {ent.fields.map((f, fIdx) => (
                                            <div key={fIdx} className="flex justify-between py-1 border-b border-white/5">
                                                <span className={f.isPrimary ? 'text-amber-300 font-bold' : f.isRelation ? 'text-[#f97316] font-semibold' : ''}>
                                                    {f.name}
                                                </span>
                                                <span className="text-slate-400 text-[11px]">{f.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 text-xs text-slate-400 font-mono flex items-center justify-between">
                            <span>Relasi foreign key cascade delete otomatis &bull; Pengindeksan otomatis untuk kecepatan query</span>
                            <span className="text-slate-500 hidden sm:inline">100% PSR-12 Standard</span>
                        </div>
                    </div>
                )}

                {/* TAB 2: LIVE APPLICATION */}
                {activeTab === 'app' && (
                    <div key={`tab-app-${selectedPresetId}`} className="space-y-6 anim-scale-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="font-mono text-xs text-[#ea580c] font-semibold tracking-wider uppercase">
                                    Tahap 02 &bull; Pratinjau Antarmuka Pengguna
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-poster text-white tracking-wide mt-1">
                                    Aplikasi CRUD React Inertia Langsung Jadi
                                </h3>
                                <p className="text-sm text-slate-300 mt-1 max-w-xl font-sans">
                                    Coba gunakan kolom pencarian, filter status, atau klik tombol <strong>"+ Tambah Data"</strong> di bawah untuk mencoba interaktivitas live table.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-md transition-all active:scale-98"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>+ Tambah Data</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('code')}
                                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold flex items-center gap-2 border border-white/10 transition-colors"
                                >
                                    <span>Lihat Kode</span>
                                    <Code2 className="w-3.5 h-3.5 text-[#ea580c]" />
                                </button>
                            </div>
                        </div>

                        {/* Search & Filter Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/60 border border-white/10">
                            <div className="relative w-full sm:w-80">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari judul atau pemilik data..."
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#ea580c] transition-colors font-sans"
                                />
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                                <span className="text-slate-400 mr-1 flex items-center gap-1">
                                    <Filter className="w-3 h-3" /> Status:
                                </span>
                                {['all', 'active', 'completed', 'pending'].map((st) => (
                                    <button
                                        key={st}
                                        onClick={() => setStatusFilter(st)}
                                        className={`px-3 py-1 rounded-lg text-xs capitalize transition-all ${
                                            statusFilter === st
                                                ? 'bg-[#ea580c] text-white font-semibold shadow-sm'
                                                : 'text-slate-300 hover:text-white bg-white/5 border border-white/5'
                                        }`}
                                    >
                                        {st === 'all' ? 'Semua' : st}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live Reactive Table */}
                        <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden shadow-inner">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-mono text-[11px]">
                                            <th className="py-3 px-4 font-semibold uppercase">Item / Judul</th>
                                            <th className="py-3 px-4 font-semibold uppercase">Klien / Entitas</th>
                                            <th className="py-3 px-4 font-semibold uppercase">Nilai / Anggaran</th>
                                            <th className="py-3 px-4 font-semibold uppercase">Status</th>
                                            <th className="py-3 px-4 font-semibold uppercase">Waktu</th>
                                            <th className="py-3 px-4 font-semibold text-right uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-slate-200 font-sans">
                                        {filteredProjects.length > 0 ? (
                                            filteredProjects.map((row) => {
                                                const isRecentlyAdded = row.id === recentlyAddedId;
                                                return (
                                                    <tr
                                                        key={row.id}
                                                        className={`hover:bg-white/5 transition-all duration-300 ${
                                                            isRecentlyAdded
                                                                ? 'bg-emerald-500/20 ring-1 ring-emerald-500/40'
                                                                : ''
                                                        }`}
                                                    >
                                                        <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                                                            {isRecentlyAdded && (
                                                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500 text-black">
                                                                    BARU
                                                                </span>
                                                            )}
                                                            <span>{row.title}</span>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-400">{row.client}</td>
                                                        <td className="py-3 px-4 font-mono font-semibold text-amber-300">{row.budget}</td>
                                                        <td className="py-3 px-4">
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                                                                row.status === 'Active'
                                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                                    : row.status === 'Completed'
                                                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                                            }`}>
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{row.updated}</td>
                                                        <td className="py-3 px-4 text-right">
                                                            <button
                                                                onClick={() => handleDeleteProject(row.id)}
                                                                title="Hapus baris ini"
                                                                className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-slate-400 font-mono">
                                                    Tidak ada data yang cocok dengan "{searchQuery}"
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
                            <span>{filteredProjects.length} data aktif pada workspace</span>
                            <span className="text-slate-500">Reaktivitas state murni tanpa reload halaman</span>
                        </div>
                    </div>
                )}

                {/* TAB 3: EXPORT CODE */}
                {activeTab === 'code' && (
                    <div key={`tab-code-${selectedPresetId}`} className="space-y-6 anim-scale-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="font-mono text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                                    Tahap 03 &bull; Kode Laravel Siap Ekspor
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-poster text-white tracking-wide mt-1">
                                    100% Kode Bersih Milik Anda Selamanya
                                </h3>
                                <p className="text-sm text-slate-300 mt-1 max-w-xl font-sans">
                                    Kode yang dihasilkan berupa file standar Laravel 11. Bebas Anda deploy di server VPS pribadi, Docker, atau penyedia hosting manapun tanpa dependensi proprietary.
                                </p>
                            </div>

                            <button
                                onClick={() => copyCode(codeFiles[selectedCodeFile].code)}
                                className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-mono font-semibold flex items-center gap-2 self-start sm:self-auto shadow-md transition-all active:scale-98"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-emerald-300" />
                                        <span>Kode Disalin!</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>Salin File Ini</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* File Selector Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-tabs-scrollbar">
                            {Object.entries(codeFiles).map(([key, file]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedCodeFile(key)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all ${
                                        selectedCodeFile === key
                                            ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                                            : 'bg-black/30 text-slate-400 hover:text-white border border-transparent'
                                    }`}
                                >
                                    <FileCode2 className={`w-3.5 h-3.5 ${selectedCodeFile === key ? 'text-[#f97316]' : 'text-slate-500'}`} />
                                    <span>{file.title}</span>
                                </button>
                            ))}
                        </div>

                        {/* Code Display */}
                        <div className="rounded-2xl border border-white/10 bg-[#070b14] overflow-hidden font-mono text-xs shadow-2xl">
                            <div className="border-b border-white/10 px-4 py-2.5 bg-black/60 flex items-center justify-between text-slate-400">
                                <span className="text-slate-300 font-semibold">{codeFiles[selectedCodeFile].path}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    {codeFiles[selectedCodeFile].badge}
                                </span>
                            </div>
                            <pre className="p-5 text-slate-300 overflow-x-auto leading-relaxed custom-code-scrollbar max-h-72">
                                <code>{codeFiles[selectedCodeFile].code}</code>
                            </pre>
                        </div>
                    </div>
                )}

            </div>

            {/* Modal Tambah Data */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm anim-scale-in">
                    <div className="bg-[#0e172a] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5 text-white">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
                                <h4 className="font-poster text-xl tracking-wide">Tambah Data Baru</h4>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddProject} className="space-y-4 font-sans">
                            <div>
                                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">
                                    Judul / Nama Item
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    placeholder="Contoh: Implementasi Modul Inventaris"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ea580c]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">
                                    Klien / Departemen
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Tim Operasional"
                                    value={newClient}
                                    onChange={(e) => setNewClient(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ea580c]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">
                                    Anggaran / Keterangan
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Rp 30.000.000"
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ea580c]"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3 font-mono text-xs">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold flex items-center gap-2 shadow-md"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Simpan ke Tabel</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
