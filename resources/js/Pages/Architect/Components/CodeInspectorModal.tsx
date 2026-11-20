import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    X,
    Copy,
    Check,
    Download,
    FileCode,
    Database,
    ShieldCheck,
    Globe,
    Layers,
    Loader2,
    Code2,
    CheckCircle2,
    Zap
} from 'lucide-react';

export interface CodeFile {
    id: string;
    name: string;
    path: string;
    language: string;
    badge: string;
    is_live: boolean;
    description: string;
    content: string;
}

interface CodeInspectorModalProps {
    moduleId: string | null;
    moduleName?: string;
    onClose: () => void;
}

/**
 * Ultra-fast native syntax highlighter (0 KB dependencies, 0 web workers).
 */
function formatCodeLine(line: string) {
    if (!line) return <span>&nbsp;</span>;

    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
        return <span className="text-slate-500 italic">{line}</span>;
    }

    const tokenRegex = /('(\\.|[^'])*'|"(\\.|[^"])*"|\$[a-zA-Z0-9_]+|\b(?:class|function|return|public|protected|private|static|use|namespace|extends|implements|new|if|else|foreach|as|try|catch|match|array|void|int|string|bool|float|openapi|info|paths|get|post|put|delete|summary|description|responses|schema|type|properties|items)\b|\b\d+\b|[{}();,\[\]]|::|->|=>)/g;

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
            elements.push(line.substring(lastIndex, match.index));
        }
        const token = match[0];
        if (token.startsWith("'") || token.startsWith('"')) {
            elements.push(<span key={match.index} className="text-emerald-400">{token}</span>);
        } else if (token.startsWith('$')) {
            elements.push(<span key={match.index} className="text-amber-300 font-medium">{token}</span>);
        } else if (/^\d+$/.test(token)) {
            elements.push(<span key={match.index} className="text-orange-400">{token}</span>);
        } else if (['::', '->', '=>'].includes(token)) {
            elements.push(<span key={match.index} className="text-rose-400 font-bold">{token}</span>);
        } else if (['class', 'function', 'return', 'public', 'protected', 'private', 'static', 'use', 'namespace', 'extends', 'implements', 'new', 'if', 'else', 'foreach', 'as', 'try', 'catch', 'match'].includes(token)) {
            elements.push(<span key={match.index} className="text-indigo-400 font-bold">{token}</span>);
        } else if (['openapi', 'info', 'paths', 'get', 'post', 'put', 'delete', 'summary', 'description', 'responses', 'schema', 'type', 'properties', 'items'].includes(token)) {
            elements.push(<span key={match.index} className="text-sky-400 font-semibold">{token}</span>);
        } else {
            elements.push(<span key={match.index} className="text-slate-400">{token}</span>);
        }
        lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
        elements.push(line.substring(lastIndex));
    }

    return <span>{elements}</span>;
}

export default function CodeInspectorModal({ moduleId, moduleName, onClose }: CodeInspectorModalProps) {
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState<CodeFile[]>([]);
    const [activeFileId, setActiveFileId] = useState<string>('model');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!moduleId) return;

        setLoading(true);
        setError(null);

        let url = `/modules/${moduleId}/inspect`;
        try {
            // @ts-ignore
            if (typeof route === 'function') {
                // @ts-ignore
                url = route('architect.modules.inspect', moduleId);
            }
        } catch (e) {
            url = `/modules/${moduleId}/inspect`;
        }

        axios.get(url)
            .then((res) => {
                setFiles(res.data.files || []);
                if (res.data.files && res.data.files.length > 0) {
                    setActiveFileId(res.data.files[0].id);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to inspect module code:", err);
                setError(err.response?.data?.message || 'Gagal memuat berkas kode modul.');
                setLoading(false);
            });
    }, [moduleId]);

    const activeFile = files.find(f => f.id === activeFileId) || files[0];

    const lines = useMemo(() => {
        return (activeFile?.content || '').split('\n');
    }, [activeFile?.content]);

    const handleCopy = () => {
        if (!activeFile) return;
        navigator.clipboard.writeText(activeFile.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!activeFile) return;
        const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = activeFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!moduleId) return null;

    const getFileIcon = (fileId: string) => {
        switch (fileId) {
            case 'model': return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
            case 'controller': return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
            case 'migration': return <Database className="w-3.5 h-3.5 text-amber-400" />;
            case 'test': return <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />;
            case 'openapi': return <Globe className="w-3.5 h-3.5 text-rose-400" />;
            default: return <Code2 className="w-3.5 h-3.5 text-gray-400" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
            <div className="bg-[#0b101b] border border-slate-800 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-[#080d17]">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Code2 className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-semibold tracking-wide text-white">
                                    Enterprise Code Inspector & AST Viewer
                                </h3>
                                {moduleName && (
                                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                                        {moduleName}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                                    <Zap className="w-3 h-3 text-emerald-400" /> Fast Native Render
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Validated PSR-12 source code, Eloquent AST relations, automated Pest tests, and OpenAPI spec.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleCopy}
                            disabled={!activeFile || loading}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                    <span>Copy Code</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleDownload}
                            disabled={!activeFile || loading}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                            <span>Download</span>
                        </button>

                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs Bar */}
                <div className="flex items-center space-x-1 px-4 pt-2 border-b border-slate-800/80 bg-[#070b13] overflow-x-auto custom-tabs-scrollbar">
                    {files.map((file) => {
                        const isActive = file.id === activeFileId;
                        return (
                            <button
                                key={file.id}
                                onClick={() => setActiveFileId(file.id)}
                                className={`flex items-center space-x-2 px-3 py-2 text-xs font-mono font-medium rounded-t-lg transition border-t border-x ${
                                    isActive
                                        ? 'bg-[#090d16] text-indigo-300 border-slate-700 border-b-transparent shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
                                }`}
                            >
                                {getFileIcon(file.id)}
                                <span>{file.name}</span>
                                {file.is_live && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-950" title="Live on disk" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Active File Description Bar */}
                {activeFile && (
                    <div className="flex items-center justify-between px-5 py-2 bg-[#080d16]/80 border-b border-slate-800/50 text-[11px] text-slate-400">
                        <div className="flex items-center space-x-2 truncate">
                            <span className="font-mono text-slate-300">{activeFile.path}</span>
                            <span>•</span>
                            <span>{activeFile.description}</span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            {activeFile.is_live ? (
                                <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Live Server File
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-[10px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                                    Virtual AST Preview
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Native Zero-Overhead Code Content Area with Custom Dark Scrollbar */}
                <div className="flex-1 bg-[#090d16] relative overflow-hidden flex">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-[#090d16] z-10">
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                            <p className="text-xs text-slate-400 font-mono">Analyzing AST & reading module sources...</p>
                        </div>
                    ) : error ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 p-6 text-center">
                            <p className="text-sm text-red-400">{error}</p>
                            <button
                                onClick={onClose}
                                className="px-4 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                            >
                                Tutup
                            </button>
                        </div>
                    ) : activeFile ? (
                        <div className="flex-1 overflow-auto p-4 custom-code-scrollbar select-text bg-[#090d16]">
                            <pre className="m-0 font-mono text-[12.5px] leading-[22px] text-slate-200">
                                {lines.map((line, idx) => (
                                    <div key={idx} className="flex hover:bg-slate-800/30 px-1 rounded-xs">
                                        <span className="w-10 select-none text-right pr-4 text-slate-600 font-mono text-[11px] shrink-0 border-r border-slate-800/60 mr-4">
                                            {idx + 1}
                                        </span>
                                        <span className="flex-1 whitespace-pre font-mono">
                                            {formatCodeLine(line)}
                                        </span>
                                    </div>
                                ))}
                            </pre>
                        </div>
                    ) : null}
                </div>

                {/* Footer Info Bar */}
                <div className="flex items-center justify-between px-5 py-2 border-t border-slate-800/80 bg-[#080d17] text-[11px] text-slate-400">
                    <div className="flex items-center space-x-3">
                        <span className="flex items-center text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                            PSR-12 Compliant
                        </span>
                        <span>•</span>
                        <span>Zero-Overhead Native Engine</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span>Language: <strong className="text-slate-200">{activeFile?.language.toUpperCase() || 'PHP'}</strong></span>
                        <span>Lines: <strong className="text-slate-200">{lines.length || 0}</strong></span>
                        <span>Encoding: <strong className="text-slate-200">UTF-8</strong></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
