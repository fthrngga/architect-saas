import React, { useState, useCallback, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import ArchitectLayout from '@/Layouts/Architect/ArchitectLayout';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    Handle,
    Position,
    NodeProps,
    Node,
    Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    Save,
    ArrowLeft,
    SlidersHorizontal,
    Eye,
    Table2,
    Database,
    Sparkles,
    CheckCircle2,
    Layers,
    RotateCcw,
    Code2,
    ExternalLink,
    Palette
} from 'lucide-react';
import CodeInspectorModal from '@/Pages/Architect/Components/CodeInspectorModal';
import ThemeSelectorModal from '@/Components/Theme/ThemeSelectorModal';

// Custom Project Root Node
const ProjectNode = React.memo(({ data }: NodeProps) => {
    return (
        <div className="bg-[#101c36] text-[#f6f4ee] border-2 border-[#c2410c] rounded-2xl p-4 shadow-xl font-mono min-w-[260px]">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Project Root</span>
                </div>
                <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white">AWS RDS</span>
            </div>
            <h3 className="font-extrabold text-sm text-white tracking-tight">{data.title as string}</h3>
            <p className="text-[10px] text-slate-400 mt-1 truncate">ID: {data.id as string}</p>
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 bg-[#c2410c] border-2 border-white rounded-full"
            />
        </div>
    );
});

// Custom Module Entity Node
const ModuleNode = React.memo(({ data }: NodeProps) => {
    const columns = (data.columns as any[]) || [];

    return (
        <div className="bg-white border border-[#101c36]/20 rounded-2xl p-4 shadow-lg font-mono min-w-[260px] max-w-[290px]">
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 bg-[#101c36] border-2 border-white rounded-full"
            />
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                    <Table2 className="w-3.5 h-3.5 text-[#c2410c]" />
                    <span className="font-extrabold text-xs text-[#101c36]">{data.name as string}</span>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                    Aktif
                </span>
            </div>

            <div className="text-[10px] text-[#c2410c] font-bold mb-2">
                tabel: <code className="bg-slate-50 px-1 py-0.5 rounded border border-slate-200">{data.tableName as string}</code>
            </div>

            {/* Columns List */}
            <div className="space-y-1 bg-[#fbfaf8] p-2.5 rounded-xl border border-slate-100 max-h-40 overflow-y-auto">
                <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase pb-1 border-b border-slate-200">
                    <span>Atribut</span>
                    <span>Tipe</span>
                </div>
                {columns.map((col, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] py-0.5">
                        <span className="text-[#334155] truncate max-w-[140px]">{col.name}</span>
                        <span className="text-[#c2410c] font-bold bg-orange-50 px-1 rounded text-[9px]">
                            {col.type}
                        </span>
                    </div>
                ))}
            </div>

            {/* Action Bar */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                {data.liveUrl ? (
                    <a
                        href={data.liveUrl as string}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#101c36] hover:text-[#c2410c] font-bold"
                    >
                        <span>Data Live</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                ) : <span />}

                {data.moduleId && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(new CustomEvent('architect-inspect-module', {
                                detail: { id: data.moduleId, name: data.name }
                            }));
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold transition shadow-2xs"
                    >
                        <Code2 className="w-2.5 h-2.5 text-indigo-600" />
                        <span>Inspect Code</span>
                    </button>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 bg-[#c2410c] border-2 border-white rounded-full"
            />
        </div>
    );
});

// Register node types outside component to prevent re-creation on renders
const nodeTypes = {
    projectNode: ProjectNode,
    moduleNode: ModuleNode,
};

export default function SchemaEditor({ project, modules = [] }: { project?: any; modules?: any[] }) {
    const [saveNotice, setSaveNotice] = useState<string | null>(null);
    const [inspectModule, setInspectModule] = useState<{ id: string; name: string } | null>(null);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const ownerHandle = project?.owner?.handle || '';
    const projectSlug = project?.slug || '';
    const storageKey = `architect_flow_${project?.id || 'default'}`;

    React.useEffect(() => {
        const handler = (e: any) => {
            if (e.detail) {
                setInspectModule(e.detail);
            }
        };
        window.addEventListener('architect-inspect-module', handler);
        return () => window.removeEventListener('architect-inspect-module', handler);
    }, []);

    // Generate initial nodes & edges from project and modules
    const generateDefaultElements = useCallback(() => {
        if (!project) {
            return {
                nodes: [
                    {
                        id: 'root-project',
                        type: 'projectNode',
                        position: { x: 380, y: 40 },
                        data: { title: 'Project: Demo', id: 'default' }
                    }
                ],
                edges: []
            };
        }

        const nodesList: Node[] = [
            {
                id: 'root-project',
                type: 'projectNode',
                position: { x: 380, y: 40 },
                data: {
                    title: project.name,
                    id: project.id
                }
            }
        ];

        const edgesList: Edge[] = [];

        modules.forEach((mod: any, idx: number) => {
            const nodeId = `module-${mod.id || idx}`;
            const colIndex = idx % 3;
            const rowIndex = Math.floor(idx / 3);
            const xPos = 80 + colIndex * 320;
            const yPos = 180 + rowIndex * 240;

            nodesList.push({
                id: nodeId,
                type: 'moduleNode',
                position: { x: xPos, y: yPos },
                data: {
                    moduleId: mod.id,
                    name: mod.name,
                    tableName: mod.table_name,
                    columns: mod.attributes || [],
                    liveUrl: project?.slug ? `/app/${ownerHandle}/${projectSlug}/${mod.table_name}` : null
                }
            });

            edgesList.push({
                id: `e-root-${nodeId}`,
                source: 'root-project',
                target: nodeId,
                animated: false,
                style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' }
            });

            // Inter-module Eloquent relations (1:N belongsTo / hasMany)
            if (mod.relations && Array.isArray(mod.relations)) {
                mod.relations.forEach((rel: any) => {
                    if (rel.type === 'belongsTo') {
                        const targetNodeId = `module-${rel.target_module_id}`;
                        edgesList.push({
                            id: `rel-${nodeId}-${targetNodeId}`,
                            source: targetNodeId,
                            target: nodeId,
                            animated: true,
                            label: `1 : N (FK: ${rel.foreign_key})`,
                            style: { stroke: '#c2410c', strokeWidth: 2.5 },
                        });
                    }
                });
            }
        });

        return { nodes: nodesList, edges: edgesList };
    }, [project, modules]);

    // Initial state: try to restore saved layout from localStorage, fallback to auto layout
    const initialElements = useMemo(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.nodes && parsed.nodes.length > 0) {
                        return parsed;
                    }
                }
            } catch {
                // Ignore parse error
            }
        }
        return generateDefaultElements();
    }, [storageKey, generateDefaultElements]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialElements.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialElements.edges);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const handleSaveLayout = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify({ nodes, edges }));
            setSaveNotice('Posisi diagram berhasil disimpan!');
            setTimeout(() => setSaveNotice(null), 3000);
        } catch (e) {
            alert('Gagal menyimpan ke penyimpanan lokal.');
        }
    };

    const handleResetLayout = () => {
        try {
            localStorage.removeItem(storageKey);
            const fresh = generateDefaultElements();
            setNodes(fresh.nodes);
            setEdges(fresh.edges);
            setSaveNotice('Diagram dikembalikan ke tata letak awal.');
            setTimeout(() => setSaveNotice(null), 3000);
        } catch (e) {
            // Ignore
        }
    };

    return (
        <ArchitectLayout title={`Schema Visual Flow — ${project?.name || 'Studio'}`}>
            <Head title={`Visual Flow — ${project?.name || 'Studio'}`} />

            <div className="space-y-4">
                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#101c36]/15">
                    <div className="flex items-center gap-4">
                        <Link
                            href={project?.id ? route('architect.modules.index', project.id) : route('architect.projects.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#64748b] hover:text-[#101c36] transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Kembali ke Workbench Modul</span>
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {saveNotice && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold animate-in fade-in">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{saveNotice}</span>
                            </span>
                        )}

                        {project?.slug && (
                            <Link
                                href={`/app/${ownerHandle}/${projectSlug}/dashboard`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#101c36]/20 bg-white hover:bg-slate-50 text-xs font-mono font-bold text-[#101c36] transition-colors shadow-sm"
                            >
                                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Buka Live App</span>
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={() => setIsThemeModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-xs font-mono font-bold text-indigo-700 transition-colors shadow-sm"
                            title="Atur Tema & Design Tokens (Tweakcn)"
                        >
                            <Palette className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Tema UI</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleResetLayout}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-mono font-bold text-[#475569] transition-colors shadow-sm"
                            title="Reset Tata Letak Node"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Reset Posisi</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveLayout}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-mono font-bold transition-all shadow-sm"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan Posisi Node</span>
                        </button>
                    </div>
                </div>

                {/* Canvas Box */}
                <div className="h-[calc(100vh-210px)] bg-[#fbfaf8] border border-[#101c36]/15 rounded-2xl overflow-hidden relative shadow-sm">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        colorMode="light"
                        fitView
                    >
                        <Controls className="bg-white border border-slate-200 shadow-sm rounded-lg" />
                        <MiniMap
                            nodeColor="#101c36"
                            maskColor="rgba(246, 244, 238, 0.7)"
                            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                        />
                        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
                    </ReactFlow>
                </div>
            </div>

            {/* In-Browser Enterprise Code Inspector Modal */}
            {inspectModule && (
                <CodeInspectorModal
                    moduleId={inspectModule.id}
                    moduleName={inspectModule.name}
                    onClose={() => setInspectModule(null)}
                />
            )}

            {/* Visual UI Theme Selector & Tweakcn Importer Modal */}
            {isThemeModalOpen && (
                <ThemeSelectorModal
                    isOpen={isThemeModalOpen}
                    onClose={() => setIsThemeModalOpen(false)}
                    project={project}
                />
            )}
        </ArchitectLayout>
    );
}
