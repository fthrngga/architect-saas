import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ArchitectLayout from '@/Layouts/Architect/ArchitectLayout';
import {
    Sparkles,
    Send,
    Database,
    ArrowRight,
    Plus,
    Trash2,
    Download,
    Eye,
    Layers,
    Check,
    Code2,
    Search,
    FolderKanban,
    ExternalLink,
    Wand2,
    SlidersHorizontal,
    Table as TableIcon,
    RefreshCw,
    X,
    Edit3,
    ChevronDown
} from 'lucide-react';

interface ProjectModule {
    id: string;
    name: string;
    table_name: string;
    status: string;
    attributes: any[];
}

interface ProjectItem {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    modules: ProjectModule[];
}

interface AttributeField {
    name: string;
    type: string;
    nullable?: boolean;
}

interface ProposedModule {
    name: string;
    table_name: string;
    description: string;
    attributes: AttributeField[];
    cmsFeatures: string[];
}

interface SynthesisResult {
    projectName: string;
    description: string;
    modules: ProposedModule[];
}

export default function ProjectsIndex({ projects = [] }: { projects: ProjectItem[] }) {
    const { auth } = usePage().props as any;
    const userHandle = auth?.user?.handle || 'workspace';

    // State
    const [promptText, setPromptText] = useState('');
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [synthesisResult, setSynthesisResult] = useState<SynthesisResult | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeMode, setActiveMode] = useState<'chat' | 'manual'>('chat');
    const [searchProjectQuery, setSearchProjectQuery] = useState('');

    // Manual Form State
    const [manualName, setManualName] = useState('');
    const [manualModuleName, setManualModuleName] = useState('');
    const [manualTableName, setManualTableName] = useState('');
    const [manualFieldName, setManualFieldName] = useState('title');
    const [manualFieldType, setManualFieldType] = useState('string');

    // Quick Starter Inspirations
    const quickPrompts = [
        { label: '🚗 Rental Mobil & Armada', text: 'Sistem Rental Mobil dengan manajemen unit armada, ketersediaan jadwal, tarif harian, dan status sewa' },
        { label: '🏥 Klinik & Rekam Medis', text: 'SaaS Klinik Kesehatan dengan data pasien, riwayat diagnosa medis, jadwal dokter, dan status antrean' },
        { label: '🏫 Portal Sekolah & Murid', text: 'Aplikasi Manajemen Sekolah dengan daftar murid, kelas, rekap nilai akademik, dan status presensi' },
        { label: '☕ Kafe & Restoran POS', text: 'Sistem Kasir Kafe dan Restoran dengan daftar menu makanan/minuman, nomor meja, dan pesanan pelanggan' },
        { label: '🛒 Toko Retail & Stok Produk', text: 'Sistem Kasir Toko Retail dengan katalog produk, kode SKU, jumlah stok, harga jual, dan kasir' },
        { label: '🧺 Laundry Kiloan & Sepatu', text: 'Sistem Laundry Kiloan dengan tracking cucian pelanggan, berat kiloan, paket layanan, dan status pengerjaan' },
        { label: '🏢 Manajemen Kost & Kontrakan', text: 'Aplikasi Manajemen Kost dengan nomor kamar, data penghuni, tagihan bulanan listrik dan status bayar' },
        { label: '🏋️ Gym & Fitness Center', text: 'Aplikasi Gym dengan nomor kartu member, paket langganan bulanan, instruktur trainer, dan absensi' },
    ];

    // Deep Semantic Architect Knowledge Engine
    const handleSynthesize = (customText?: string) => {
        const text = (customText || promptText).trim();
        if (!text) return;

        setIsSynthesizing(true);
        setSynthesisResult(null);

        setTimeout(() => {
            const lower = text.toLowerCase();
            let result: SynthesisResult;

            // 1. Rental / Automotive
            if (lower.includes('rental') || lower.includes('mobil') || lower.includes('armada') || lower.includes('sewa')) {
                result = {
                    projectName: 'FleetLease Automotive SaaS',
                    description: 'Platform manajemen persewaan armada kendaraan terpadu dengan pemantauan ketersediaan unit, kontrak sewa pelanggan, dan status inspeksi.',
                    modules: [
                        {
                            name: 'Vehicle',
                            table_name: 'vehicles',
                            description: 'Katalog unit kendaraan, spesifikasi, plat nomor, dan tarif sewa',
                            attributes: [
                                { name: 'brand_model', type: 'string' },
                                { name: 'license_plate', type: 'string' },
                                { name: 'year', type: 'integer' },
                                { name: 'daily_rate', type: 'integer' },
                                { name: 'status', type: 'string' }, // Available, Rented, Maintenance
                            ],
                            cmsFeatures: ['Filter unit siap sewa', 'Pencarian plat nomor instan', 'Form tarif harian', 'Status badge armada']
                        },
                        {
                            name: 'RentalBooking',
                            table_name: 'rental_bookings',
                            description: 'Pencatatan transaksi sewa pelanggan, durasi hari, dan total tagihan',
                            attributes: [
                                { name: 'customer_name', type: 'string' },
                                { name: 'customer_phone', type: 'string' },
                                { name: 'start_date', type: 'date' },
                                { name: 'end_date', type: 'date' },
                                { name: 'total_cost', type: 'integer' },
                                { name: 'payment_status', type: 'string' }, // Paid, Deposit, Unpaid
                            ],
                            cmsFeatures: ['Tabel booking aktif', 'Kalkulasi total tagihan otomatis', 'Filter status pelunasan', 'Export laporan sewa']
                        }
                    ]
                };
            }
            // 2. Klinik / Rumah Sakit / Medis
            else if (lower.includes('klinik') || lower.includes('pasien') || lower.includes('medis') || lower.includes('dokter') || lower.includes('apotek')) {
                result = {
                    projectName: 'Medika Health Enterprise',
                    description: 'Sistem operasional fasilitas kesehatan untuk rekam medis pasien, antrean janji temu dokter, dan pengelolaan obat.',
                    modules: [
                        {
                            name: 'Patient',
                            table_name: 'patients',
                            description: 'Master data identitas pasien, nomor rekam medis, dan riwayat golongan darah',
                            attributes: [
                                { name: 'mr_number', type: 'string' },
                                { name: 'full_name', type: 'string' },
                                { name: 'birth_date', type: 'date' },
                                { name: 'phone_number', type: 'string' },
                                { name: 'blood_type', type: 'string' },
                            ],
                            cmsFeatures: ['Pencarian cepat nomor RM', 'Form biodata pasien', 'Badge golongan darah', 'Ekspor riwayat pasien']
                        },
                        {
                            name: 'Appointment',
                            table_name: 'appointments',
                            description: 'Jadwal kunjungan dokter, keluhan utama pasien, dan status konsultasi',
                            attributes: [
                                { name: 'patient_name', type: 'string' },
                                { name: 'doctor_name', type: 'string' },
                                { name: 'appointment_date', type: 'date' },
                                { name: 'complaint_summary', type: 'text' },
                                { name: 'status', type: 'string' }, // Scheduled, In-Consultation, Completed
                            ],
                            cmsFeatures: ['Jadwal temu harian', 'Status penanganan', 'Pencarian nama dokter', 'Catatan keluhan pasien']
                        }
                    ]
                };
            }
            // 3. Kafe / Restoran / F&B
            else if (lower.includes('kafe') || lower.includes('cafe') || lower.includes('restoran') || lower.includes('resto') || lower.includes('makanan') || lower.includes('menu') || lower.includes('kopi')) {
                result = {
                    projectName: 'BistroFlow Culinary POS',
                    description: 'Sistem manajemen operasional kafe/restoran untuk katalog menu, kapasitas meja makan, dan transaksi kasir.',
                    modules: [
                        {
                            name: 'MenuItem',
                            table_name: 'menu_items',
                            description: 'Katalog hidangan makanan & minuman beserta kategori dan harga jual',
                            attributes: [
                                { name: 'name', type: 'string' },
                                { name: 'category', type: 'string' }, // Coffee, Main Course, Snack, Dessert
                                { name: 'price', type: 'integer' },
                                { name: 'stock_available', type: 'integer' },
                                { name: 'is_active', type: 'boolean' },
                            ],
                            cmsFeatures: ['Filter kategori menu', 'Pencarian nama hidangan', 'Status ketersediaan stok', 'Switch toggle aktif/nonaktif']
                        },
                        {
                            name: 'DiningOrder',
                            table_name: 'dining_orders',
                            description: 'Tiket pesanan kasir, nomor meja, total biaya, dan status pembayaran',
                            attributes: [
                                { name: 'order_number', type: 'string' },
                                { name: 'table_number', type: 'string' },
                                { name: 'customer_name', type: 'string' },
                                { name: 'total_price', type: 'integer' },
                                { name: 'payment_status', type: 'string' }, // Paid, Unpaid
                            ],
                            cmsFeatures: ['Live tracking pesanan kasir', 'Filter nomor meja', 'Kalkulasi total tagihan', 'Badge status bayar']
                        }
                    ]
                };
            }
            // 4. Sekolah / Bimbel / Murid
            else if (lower.includes('sekolah') || lower.includes('murid') || lower.includes('siswa') || lower.includes('akademik') || lower.includes('bimbel') || lower.includes('guru')) {
                result = {
                    projectName: 'EduCore Academy System',
                    description: 'Sistem administrasi pendidikan terpadu untuk pendataan siswa, absensi harian, dan pencatatan nilai akademik.',
                    modules: [
                        {
                            name: 'Student',
                            table_name: 'students',
                            description: 'Data induk kesiswaan, NISN, rombel kelas, dan nomor kontak orang tua',
                            attributes: [
                                { name: 'nisn', type: 'string' },
                                { name: 'full_name', type: 'string' },
                                { name: 'grade_class', type: 'string' },
                                { name: 'gender', type: 'string' },
                                { name: 'parent_phone', type: 'string' },
                            ],
                            cmsFeatures: ['Pencarian NISN instan', 'Filter rombongan belajar', 'Form registrasi siswa', 'Validasi data unik']
                        },
                        {
                            name: 'Attendance',
                            table_name: 'attendances',
                            description: 'Rekapitulasi presensi kehadiran harian siswa di kelas',
                            attributes: [
                                { name: 'student_name', type: 'string' },
                                { name: 'grade_class', type: 'string' },
                                { name: 'date', type: 'date' },
                                { name: 'status', type: 'string' }, // Hadir, Sakit, Izin, Alpa
                                { name: 'notes', type: 'string', nullable: true },
                            ],
                            cmsFeatures: ['Tabel presensi harian', 'Pill status kehadiran', 'Filter tanggal kehadiran', 'Laporan bulanan siswa']
                        }
                    ]
                };
            }
            // 5. Laundry / Cuci Kiloan
            else if (lower.includes('laundry') || lower.includes('cucian') || lower.includes('cuci')) {
                result = {
                    projectName: 'WashFlow Laundry Suite',
                    description: 'Aplikasi operasional gerai laundry kiloan untuk pencatatan nota cucian, timbangan berat, dan status pengerjaan.',
                    modules: [
                        {
                            name: 'LaundryOrder',
                            table_name: 'laundry_orders',
                            description: 'Nota pesanan laundry, nama pelanggan, bobot timbangan, dan status cuci',
                            attributes: [
                                { name: 'invoice_no', type: 'string' },
                                { name: 'customer_name', type: 'string' },
                                { name: 'phone', type: 'string' },
                                { name: 'package_type', type: 'string' }, // Cuci Kering, Cuci Setrika, Bed Cover
                                { name: 'weight_kg', type: 'float' },
                                { name: 'total_amount', type: 'integer' },
                                { name: 'order_status', type: 'string' }, // Queued, Washing, Ironing, Ready
                            ],
                            cmsFeatures: ['Pelacakan progres pengerjaan', 'Kalkulasi tarif per kg otomatis', 'Pencarian nomor nota', 'Status bayar badge']
                        }
                    ]
                };
            }
            // 6. Kost / Properti / Kontrakan
            else if (lower.includes('kost') || lower.includes('kos') || lower.includes('properti') || lower.includes('kamar') || lower.includes('kontrakan') || lower.includes('hotel') || lower.includes('villa')) {
                result = {
                    projectName: 'Habita Property Hub',
                    description: 'Sistem operasional pengelolaan hunian sewa, status ketersediaan kamar, dan jadwal penagihan sewa bulanan.',
                    modules: [
                        {
                            name: 'Room',
                            table_name: 'rooms',
                            description: 'Katalog nomor kamar, lantai, fasilitas pendukung, dan harga sewa',
                            attributes: [
                                { name: 'room_number', type: 'string' },
                                { name: 'floor', type: 'integer' },
                                { name: 'room_type', type: 'string' }, // Standard, Deluxe, VIP
                                { name: 'monthly_rate', type: 'integer' },
                                { name: 'status', type: 'string' }, // Available, Occupied, Maintenance
                            ],
                            cmsFeatures: ['Filter kamar kosong', 'Form tarif sewa', 'Badge ketersediaan unit', 'Daftar fasilitas']
                        },
                        {
                            name: 'TenantBill',
                            table_name: 'tenant_bills',
                            description: 'Pencatatan tagihan sewa bulanan penghuni kamar dan tanggal jatuh tempo',
                            attributes: [
                                { name: 'tenant_name', type: 'string' },
                                { name: 'room_number', type: 'string' },
                                { name: 'billing_period', type: 'string' }, // e.g. November 2026
                                { name: 'amount_due', type: 'integer' },
                                { name: 'due_date', type: 'date' },
                                { name: 'payment_status', type: 'string' }, // Paid, Unpaid
                            ],
                            cmsFeatures: ['Tabel tagihan jatuh tempo', 'Filter status pelunasan', 'Rekap pendapatan sewa', 'Pencarian nama penghuni']
                        }
                    ]
                };
            }
            // 7. POS / Toko / Kasir / Retail / Inventory
            else if (lower.includes('kasir') || lower.includes('toko') || lower.includes('pos') || lower.includes('produk') || lower.includes('stok') || lower.includes('barang') || lower.includes('gudang')) {
                result = {
                    projectName: 'RetailMaster POS & Inventory',
                    description: 'Sistem kasir toko retail modern dengan manajemen stok produk real-time dan rekap transaksi penjualan.',
                    modules: [
                        {
                            name: 'Product',
                            table_name: 'products',
                            description: 'Master inventori produk, barcode SKU, harga modal/jual, dan jumlah stok',
                            attributes: [
                                { name: 'sku_code', type: 'string' },
                                { name: 'name', type: 'string' },
                                { name: 'category', type: 'string' },
                                { name: 'buy_price', type: 'integer' },
                                { name: 'sell_price', type: 'integer' },
                                { name: 'stock_quantity', type: 'integer' },
                            ],
                            cmsFeatures: ['Pencarian SKU instan', 'Monitoring stok menipis', 'Kategori produk filter', 'Form harga jual/beli']
                        },
                        {
                            name: 'Transaction',
                            table_name: 'transactions',
                            description: 'Riwayat transaksi penjualan kasir dan metode pembayaran yang digunakan',
                            attributes: [
                                { name: 'receipt_number', type: 'string' },
                                { name: 'cashier_name', type: 'string' },
                                { name: 'total_amount', type: 'integer' },
                                { name: 'payment_method', type: 'string' }, // Cash, QRIS, Transfer
                                { name: 'transaction_date', type: 'date' },
                            ],
                            cmsFeatures: ['Tabel penjualan harian', 'Filter metode bayar', 'Rekap omzet otomatis', 'Ekspor riwayat kasir']
                        }
                    ]
                };
            }
            // 8. Gym / Fitness / Olahraga
            else if (lower.includes('gym') || lower.includes('fitness') || lower.includes('olahraga') || lower.includes('member')) {
                result = {
                    projectName: 'FitCore Athletic Club',
                    description: 'Platform keanggotaan fitness center untuk monitoring masa aktif member, jadwal instruktur, dan presensi gym.',
                    modules: [
                        {
                            name: 'Member',
                            table_name: 'members',
                            description: 'Data induk keanggotaan, jenis paket langganan, dan masa kedaluwarsa kartu',
                            attributes: [
                                { name: 'card_id', type: 'string' },
                                { name: 'full_name', type: 'string' },
                                { name: 'phone', type: 'string' },
                                { name: 'package_plan', type: 'string' }, // Silver, Gold, Platinum
                                { name: 'expiry_date', type: 'date' },
                                { name: 'status', type: 'string' }, // Active, Expired
                            ],
                            cmsFeatures: ['Pencarian nomor kartu member', 'Filter masa aktif', 'Form registrasi anggota', 'Badge status keanggotaan']
                        }
                    ]
                };
            }
            // 9. Intelligent NLP Parser for Novel / Custom Prompts
            else {
                // Extract alphanumeric words
                const words = text.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length >= 2);
                
                if (words.length === 0) {
                    setIsSynthesizing(false);
                    alert('Mohon masukkan deskripsi proyek atau modul yang lebih spesifik agar sistem AI dapat menganalisis entitas bisnis Anda.');
                    return;
                }

                let titleWord = words[0];
                const reservedWords = ['class', 'function', 'return', 'interface', 'trait', 'user', 'users', 'project', 'projects', 'module', 'modules', 'migration', 'migrations'];
                if (reservedWords.includes(titleWord.toLowerCase())) {
                    titleWord = `${titleWord}Item`;
                }

                const pascalTitle = titleWord.charAt(0).toUpperCase() + titleWord.slice(1);

                result = {
                    projectName: `${pascalTitle} Architecture Suite`,
                    description: `Sistem kustom yang dirancang sesuai instruksi: "${text}". Dilengkapi tabel data relasional dan modul CMS siap pakai.`,
                    modules: [
                        {
                            name: pascalTitle,
                            table_name: `${titleWord.toLowerCase()}s`,
                            description: `Modul utama untuk entitas ${titleWord}`,
                            attributes: [
                                { name: 'title_name', type: 'string' },
                                { name: 'code_identifier', type: 'string' },
                                { name: 'rate_amount', type: 'integer' },
                                { name: 'operational_status', type: 'string' },
                                { name: 'notes_summary', type: 'text', nullable: true },
                            ],
                            cmsFeatures: ['Pencarian data multi-kolom', 'Status badge dinamis', 'Form validasi lengkap', 'Filter status otomatis']
                        }
                    ]
                };
            }

            setSynthesisResult(result);
            setIsSynthesizing(false);
        }, 500);
    };

    // Add field interactively in synthesis preview
    const handleAddField = (moduleIndex: number) => {
        if (!synthesisResult) return;
        const newModules = [...synthesisResult.modules];
        const existingNames = newModules[moduleIndex].attributes.map(a => a.name);
        let fieldIndex = newModules[moduleIndex].attributes.length + 1;
        let newName = `custom_field_${fieldIndex}`;
        while (existingNames.includes(newName)) {
            fieldIndex++;
            newName = `custom_field_${fieldIndex}`;
        }
        newModules[moduleIndex].attributes.push({
            name: newName,
            type: 'string',
        });
        setSynthesisResult({ ...synthesisResult, modules: newModules });
    };

    // Remove field interactively in synthesis preview
    const handleRemoveField = (moduleIndex: number, attrIndex: number) => {
        if (!synthesisResult) return;
        const newModules = [...synthesisResult.modules];
        newModules[moduleIndex].attributes.splice(attrIndex, 1);
        setSynthesisResult({ ...synthesisResult, modules: newModules });
    };

    // Update field interactively
    const handleUpdateField = (moduleIndex: number, attrIndex: number, fieldKey: string, value: any) => {
        if (!synthesisResult) return;
        const newModules = [...synthesisResult.modules];
        // @ts-ignore
        newModules[moduleIndex].attributes[attrIndex][fieldKey] = value;
        setSynthesisResult({ ...synthesisResult, modules: newModules });
    };

    // EXECUTE CREATION IN DATABASE (Using router.post to ensure payload transmits directly)
    const handleConfirmSynthesis = () => {
        if (!synthesisResult) return;
        setIsCreating(true);

        const payload = {
            name: synthesisResult.projectName,
            description: synthesisResult.description,
            modules: synthesisResult.modules.map((m) => ({
                name: m.name,
                table_name: m.table_name,
                attributes: m.attributes.filter(a => a.name && !['id', 'project_id', 'created_at', 'updated_at', 'deleted_at'].includes(a.name.toLowerCase())),
            })),
        };

        router.post(route('architect.projects.store'), payload, {
            onSuccess: () => {
                setSynthesisResult(null);
                setPromptText('');
                setIsCreating(false);
            },
            onError: (err) => {
                setIsCreating(false);
                const msg = err.name || Object.values(err)[0] || 'Terjadi kesalahan validasi';
                alert('Gagal membuat proyek: ' + msg);
            }
        });
    };

    // Manual Creation Submit (Using router.post)
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualName.trim()) return;
        setIsCreating(true);

        const fieldName = (manualFieldName.trim() || 'title').toLowerCase();
        const safeFieldName = ['id', 'project_id', 'created_at', 'updated_at', 'deleted_at'].includes(fieldName) ? 'item_name' : (manualFieldName.trim() || 'title');

        const modules = manualModuleName.trim() ? [{
            name: manualModuleName.trim(),
            table_name: manualTableName.trim() || `${manualModuleName.trim().toLowerCase()}s`,
            attributes: [{ name: safeFieldName, type: manualFieldType || 'string' }],
        }] : [];

        router.post(route('architect.projects.store'), {
            name: manualName.trim(),
            modules,
        }, {
            onSuccess: () => {
                setManualName('');
                setManualModuleName('');
                setManualTableName('');
                setIsCreating(false);
            },
            onError: (err) => {
                setIsCreating(false);
                const msg = err.name || Object.values(err)[0] || 'Terjadi kesalahan validasi';
                alert('Gagal membuat proyek: ' + msg);
            }
        });
    };

    // Delete Project
    const handleDeleteProject = (projectId: string, projectName: string) => {
        if (confirm(`Hapus proyek "${projectName}" beserta seluruh modul dan tabel datanya?`)) {
            router.delete(route('architect.projects.destroy', projectId));
        }
    };

    // Filter projects list
    const filteredProjects = projects.filter((p) =>
        p.name.toLowerCase().includes(searchProjectQuery.toLowerCase())
    );

    return (
        <ArchitectLayout title="Studio Workspace">
            <Head title="Architect Studio — Projects & Synthesis" />

            <div className="space-y-12">

                {/* 1. PRIMARY ARCHITECT SYNTHESIS DESK (CHAT / COMMAND FIRST) */}
                <section className="rounded-3xl border border-[#101c36]/15 bg-white p-6 sm:p-10 shadow-xl space-y-8 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#101c36]/10">
                        <div>
                            <span className="font-mono text-xs text-[#c2410c] font-bold uppercase tracking-widest block">
                                COMMAND DESK // FULL-STACK ARCHITECT ENGINE
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-poster text-[#101c36] uppercase tracking-wide mt-1">
                                MAU BANGUN SISTEM ATAU FITUR APA HARI INI?
                            </h2>
                            <p className="text-sm text-[#475569] mt-1 font-sans max-w-2xl">
                                Ceritakan ide aplikasi atau fitur yang ingin Anda bangun. Sistem akan langsung merancang modul CMS dan tabel database relasional yang siap diisi data.
                            </p>
                        </div>

                        {/* Mode Switcher */}
                        <div className="flex items-center bg-[#f6f4ee] p-1.5 rounded-2xl border border-[#101c36]/15 self-start sm:self-auto font-mono text-xs">
                            <button
                                onClick={() => { setActiveMode('chat'); setSynthesisResult(null); }}
                                className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-all ${
                                    activeMode === 'chat'
                                        ? 'bg-[#101c36] text-[#f6f4ee] shadow-sm'
                                        : 'text-[#475569] hover:text-[#101c36]'
                                }`}
                            >
                                Mode Chat / AI
                            </button>
                            <button
                                onClick={() => { setActiveMode('manual'); setSynthesisResult(null); }}
                                className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-all ${
                                    activeMode === 'manual'
                                        ? 'bg-[#101c36] text-[#f6f4ee] shadow-sm'
                                        : 'text-[#475569] hover:text-[#101c36]'
                                }`}
                            >
                                Mode Manual
                            </button>
                        </div>
                    </div>

                    {/* MODE A: CONVERSATIONAL SYNTHESIS */}
                    {activeMode === 'chat' && !synthesisResult && (
                        <div className="space-y-6">
                            {/* Prompt Input Box */}
                            <div className="space-y-3">
                                <div className="relative rounded-2xl border-2 border-[#101c36]/20 bg-[#fbfaf8] focus-within:border-[#101c36] focus-within:bg-white transition-all shadow-inner p-3 sm:p-4">
                                    <textarea
                                        rows={3}
                                        value={promptText}
                                        onChange={(e) => setPromptText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                handleSynthesize();
                                            }
                                        }}
                                        placeholder="Contoh: Saya butuh aplikasi rental mobil dengan manajemen ketersediaan armada, sistem sewa pelanggan, dan tarif harian..."
                                        className="w-full bg-transparent border-0 p-0 text-sm sm:text-base text-[#101c36] placeholder:text-slate-400 focus:ring-0 focus:outline-none resize-none font-sans"
                                    />
                                    <div className="flex items-center justify-between pt-2 border-t border-[#101c36]/10 text-xs text-[#64748b]">
                                        <span className="font-mono text-[11px] hidden sm:inline">
                                            Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-200 border border-slate-300 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-200 border border-slate-300 font-mono text-[10px]">Enter</kbd> untuk rancang instan
                                        </span>
                                        <button
                                            onClick={() => handleSynthesize()}
                                            disabled={isSynthesizing || !promptText.trim()}
                                            className="px-6 py-2.5 rounded-xl bg-[#101c36] hover:bg-[#1c3059] disabled:opacity-40 text-[#f5f2eb] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-98 ml-auto"
                                        >
                                            {isSynthesizing ? (
                                                <>
                                                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#f97316]" />
                                                    <span>Menganalisis Kebutuhan...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="w-3.5 h-3.5 text-[#f97316]" />
                                                    <span>Rancang Arsitektur & CMS</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Starter Inspiration Chips */}
                            <div className="space-y-2">
                                <span className="font-mono text-[11px] uppercase tracking-wider text-[#64748b] font-bold block">
                                    Atau coba inspirasi cepat:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {quickPrompts.map((p) => (
                                        <button
                                            key={p.label}
                                            onClick={() => {
                                                setPromptText(p.text);
                                                handleSynthesize(p.text);
                                            }}
                                            className="px-3.5 py-2 rounded-xl border border-[#101c36]/15 bg-[#f6f4ee] hover:bg-white hover:border-[#101c36] text-xs font-mono text-[#101c36] transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <span>{p.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROPOSED SYNTHESIS RESULT (INTERACTIVE SCHEMA & CMS REVIEW) */}
                    {activeMode === 'chat' && synthesisResult && (
                        <div className="space-y-6 animate-fadeIn p-6 sm:p-8 rounded-2xl bg-[#faf9f6] border-2 border-[#101c36]/25 shadow-md">
                            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#101c36]/15">
                                <div className="space-y-1">
                                    <span className="font-mono text-xs text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <Check className="w-4 h-4 text-emerald-600" />
                                        PROPOSAL ARSITEKTUR SIAP DIBANGUN
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={synthesisResult.projectName}
                                            onChange={(e) => setSynthesisResult({ ...synthesisResult, projectName: e.target.value })}
                                            className="text-2xl font-poster text-[#101c36] uppercase tracking-wide bg-white border border-[#101c36]/20 px-3 py-1 rounded-lg focus:border-[#101c36] focus:ring-0"
                                            title="Klik untuk ubah nama proyek"
                                        />
                                        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">(Dapat diedit)</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-[#475569] font-sans">
                                        {synthesisResult.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSynthesisResult(null)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                    title="Tutup / Ganti Prompt"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modules & Schema Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {synthesisResult.modules.map((mod, modIdx) => (
                                    <div key={mod.name} className="p-5 rounded-xl border border-[#101c36]/15 bg-white shadow-sm space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-[#101c36]/10">
                                            <div>
                                                <h4 className="font-mono text-sm font-bold text-[#101c36]">
                                                    {mod.name} <span className="text-slate-400 font-normal">({mod.table_name})</span>
                                                </h4>
                                                <p className="text-[11px] text-[#64748b] font-sans mt-0.5">{mod.description}</p>
                                            </div>
                                            <span className="text-[10px] font-mono text-[#c2410c] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                                                Modul {modIdx + 1}
                                            </span>
                                        </div>

                                        {/* Editable Columns Table */}
                                        <div className="space-y-2 font-mono text-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] uppercase font-bold text-[#64748b]">Struktur Kolom Database:</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddField(modIdx)}
                                                    className="text-[10px] text-[#c2410c] hover:underline flex items-center gap-1 font-bold"
                                                >
                                                    <Plus className="w-3 h-3" /> Tambah Kolom
                                                </button>
                                            </div>

                                            <div className="bg-[#f6f4ee] p-2.5 rounded-lg space-y-1.5 text-slate-700">
                                                <div className="flex justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-200">
                                                    <span>id (UUID PK)</span>
                                                    <span>project_id (Tenant Scope)</span>
                                                </div>

                                                {mod.attributes.map((attr, attrIdx) => (
                                                    <div key={attrIdx} className="flex items-center gap-2 py-1 text-xs">
                                                        <input
                                                            type="text"
                                                            value={attr.name}
                                                            onChange={(e) => handleUpdateField(modIdx, attrIdx, 'name', e.target.value)}
                                                            className="flex-1 text-xs py-1.5 px-3 rounded-md border border-slate-300 bg-white text-[#101c36] font-mono font-medium focus:ring-1 focus:ring-[#101c36] focus:border-[#101c36] shadow-sm"
                                                            placeholder="nama_kolom"
                                                        />
                                                        <div className="relative">
                                                            <select
                                                                value={attr.type}
                                                                onChange={(e) => handleUpdateField(modIdx, attrIdx, 'type', e.target.value)}
                                                                className="w-28 text-xs py-1.5 pl-2.5 pr-8 rounded-md border border-slate-300 bg-white text-[#c2410c] font-mono font-semibold focus:ring-1 focus:ring-[#c2410c] focus:border-[#c2410c] shadow-sm cursor-pointer appearance-none"
                                                            >
                                                                <option value="string">string</option>
                                                                <option value="integer">integer</option>
                                                                <option value="float">float</option>
                                                                <option value="date">date</option>
                                                                <option value="boolean">boolean</option>
                                                                <option value="text">text</option>
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                                                <ChevronDown className="w-3.5 h-3.5" />
                                                            </div>
                                                        </div>
                                                        {mod.attributes.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveField(modIdx, attrIdx)}
                                                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors"
                                                                title="Hapus kolom"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* CMS Capabilities */}
                                        <div className="space-y-1 font-sans text-xs">
                                            <span className="text-[10px] font-mono uppercase font-bold text-[#64748b] block">Fitur CMS yang Disediakan:</span>
                                            <ul className="grid grid-cols-2 gap-1 text-[11px] text-[#475569]">
                                                {mod.cmsFeatures.map((f, i) => (
                                                    <li key={i} className="flex items-center gap-1.5">
                                                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                                        <span>{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Execution Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#101c36]/15">
                                <div className="text-xs text-[#64748b] font-mono">
                                    Modul dan tabel database RDS akan langsung di-generate & siap diisi data riil.
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setSynthesisResult(null)}
                                        className="px-4 py-2.5 rounded-xl border border-[#101c36]/20 hover:bg-slate-100 text-xs font-mono font-bold uppercase tracking-wider text-[#475569] transition-colors"
                                    >
                                        Batal / Ubah Prompt
                                    </button>
                                    <button
                                        onClick={handleConfirmSynthesis}
                                        disabled={isCreating}
                                        className="px-7 py-3 rounded-xl bg-[#101c36] hover:bg-[#1c3059] disabled:opacity-50 text-[#f5f2eb] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-98"
                                    >
                                        {isCreating ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin text-[#f97316]" />
                                                <span>Membuat Proyek & Migrasi Database...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4 text-[#f97316]" />
                                                <span>Bangun & Aktifkan Proyek Ini Sekarang</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MODE B: MANUAL FORM INPUT */}
                    {activeMode === 'manual' && (
                        <form onSubmit={handleManualSubmit} className="space-y-6 animate-fadeIn">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1.5 font-mono text-xs">
                                    <label className="font-bold text-[#101c36] uppercase tracking-wider">
                                        Nama Proyek *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={manualName}
                                        onChange={(e) => setManualName(e.target.value)}
                                        placeholder="Contoh: E-Commerce Wholesale"
                                        className="w-full rounded-xl bg-slate-50 border border-[#101c36]/20 p-3 text-sm text-[#101c36] focus:border-[#101c36] focus:ring-0 font-sans"
                                    />
                                </div>

                                <div className="space-y-1.5 font-mono text-xs">
                                    <label className="font-bold text-[#101c36] uppercase tracking-wider">
                                        Modul Utama Pertama (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={manualModuleName}
                                        onChange={(e) => setManualModuleName(e.target.value)}
                                        placeholder="Contoh: Product"
                                        className="w-full rounded-xl bg-slate-50 border border-[#101c36]/20 p-3 text-sm text-[#101c36] focus:border-[#101c36] focus:ring-0 font-sans"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#101c36]/10">
                                <button
                                    type="button"
                                    onClick={() => setActiveMode('chat')}
                                    className="px-4 py-2.5 rounded-xl border border-[#101c36]/20 text-xs font-mono font-bold uppercase tracking-wider text-[#475569] hover:bg-slate-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="px-7 py-3 rounded-xl bg-[#101c36] hover:bg-[#1c3059] disabled:opacity-50 text-[#f5f2eb] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-98"
                                >
                                    {isCreating ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin text-[#f97316]" />
                                            <span>Menyimpan Proyek...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 text-[#f97316]" />
                                            <span>Buat Proyek Manual</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                </section>

                {/* 2. RIWAYAT PROJEK SAYA (MY PROJECTS HISTORY - PURE UX FOCUS) */}
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="font-mono text-xs text-[#c2410c] font-bold uppercase tracking-widest block">
                                DIRECTORY // WORKSPACE REPOSITORIES
                            </span>
                            <h3 className="text-3xl font-poster text-[#101c36] uppercase tracking-wide mt-1">
                                RIWAYAT PROJEK SAYA ({projects.length})
                            </h3>
                        </div>

                        {/* Search in Projects */}
                        {projects.length > 0 && (
                            <div className="relative w-full sm:w-72">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchProjectQuery}
                                    onChange={(e) => setSearchProjectQuery(e.target.value)}
                                    placeholder="Cari riwayat projek..."
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#101c36]/20 text-xs text-[#101c36] placeholder:text-slate-400 focus:outline-none focus:border-[#101c36] transition-colors font-sans shadow-sm"
                                />
                            </div>
                        )}
                    </div>

                    {/* Projects Grid */}
                    {filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => {
                                const moduleCount = project.modules?.length || 0;
                                const firstModule = project.modules?.[0];

                                return (
                                    <div
                                        key={project.id}
                                        className="rounded-2xl border border-[#101c36]/15 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="space-y-1">
                                                    <h4 className="font-poster text-2xl uppercase tracking-wide text-[#101c36] group-hover:text-[#c2410c] transition-colors leading-tight">
                                                        {project.name}
                                                    </h4>
                                                    <span className="text-[11px] font-mono text-[#64748b]">
                                                        /{project.slug}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteProject(project.id, project.name)}
                                                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                    title="Hapus Proyek"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Modules Badges */}
                                            <div className="space-y-2 pt-1">
                                                <div className="flex items-center justify-between font-mono text-xs text-[#64748b]">
                                                    <span>Modul Aktif:</span>
                                                    <span className="font-bold text-[#101c36]">{moduleCount} Modul</span>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5">
                                                    {moduleCount > 0 ? (
                                                        project.modules.map((m) => (
                                                            <a
                                                                key={m.id}
                                                                href={`/app/${userHandle}/${project.slug}/${m.table_name}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="px-2.5 py-1 rounded-md bg-[#f6f4ee] hover:bg-[#101c36] hover:text-[#f6f4ee] border border-[#101c36]/10 text-[10px] font-mono font-bold text-[#101c36] transition-colors inline-flex items-center gap-1"
                                                                title={`Buka tabel ${m.table_name}`}
                                                            >
                                                                <span>{m.table_name}</span>
                                                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                                            </a>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] font-mono text-slate-400 italic">
                                                            Belum ada modul (tambahkan via editor)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons (High Ergonomics / Fast UX) */}
                                        <div className="pt-4 border-t border-[#101c36]/10 grid grid-cols-2 gap-2 font-mono text-xs">
                                            {/* Direct Action 1: Open Living CMS App */}
                                            {firstModule ? (
                                                <a
                                                    href={`/app/${userHandle}/${project.slug}/${firstModule.table_name}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-3 py-2 rounded-xl bg-[#101c36] hover:bg-[#1c3059] text-[#f5f2eb] font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                                    title="Buka Aplikasi CMS Langsung"
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-[#f97316]" />
                                                    <span>Buka App</span>
                                                </a>
                                            ) : (
                                                <Link
                                                    href={route('architect.modules.index', project.id)}
                                                    className="px-3 py-2 rounded-xl bg-[#101c36] hover:bg-[#1c3059] text-[#f5f2eb] font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                                >
                                                    <Plus className="w-3.5 h-3.5 text-[#f97316]" />
                                                    <span>+ Modul</span>
                                                </Link>
                                            )}

                                            {/* Direct Action 2: Visual Schema Editor */}
                                            <Link
                                                href={route('architect.modules.index', project.id)}
                                                className="px-3 py-2 rounded-xl border border-[#101c36]/20 bg-[#f6f4ee] hover:bg-white text-[#101c36] font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                                                title="Kelola Modul & Skema"
                                            >
                                                <Layers className="w-3.5 h-3.5 text-[#c2410c]" />
                                                <span>Editor</span>
                                            </Link>

                                            {/* Direct Action 3: Export ZIP */}
                                            <a
                                                href={route('architect.projects.export', project.id)}
                                                className="col-span-2 px-3 py-2 rounded-xl border border-dashed border-[#101c36]/25 hover:border-[#101c36] hover:bg-[#f6f4ee] text-[11px] text-[#475569] hover:text-[#101c36] font-bold text-center flex items-center justify-center gap-1.5 transition-colors mt-1"
                                                title="Unduh 100% Standalone Codebase ZIP"
                                            >
                                                <Download className="w-3 h-3 text-[#c2410c]" />
                                                <span>Download Codebase ZIP</span>
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="rounded-3xl border-2 border-dashed border-[#101c36]/20 p-12 text-center space-y-4 bg-white/40">
                            <div className="w-12 h-12 rounded-2xl bg-[#101c36]/5 text-[#101c36] flex items-center justify-center mx-auto">
                                <FolderKanban className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-poster text-xl uppercase tracking-wide text-[#101c36]">
                                    Belum Ada Projek Tersimpan
                                </h4>
                                <p className="text-xs text-[#64748b] max-w-sm mx-auto font-sans">
                                    Mulai dengan mengetik fitur yang ingin Anda bangun di kolom chat di atas, atau klik salah satu inspirasi cepat.
                                </p>
                            </div>
                        </div>
                    )}
                </section>

            </div>
        </ArchitectLayout>
    );
}
