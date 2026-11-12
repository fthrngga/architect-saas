import React, { useCallback, useEffect } from 'react';
import { Head } from '@inertiajs/react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useArchitectStore } from '@/hooks/useArchitectStore';
import { Button } from '@/Components/ui/button';
import { Save } from 'lucide-react';

const initialNodes = [
    { id: '1', position: { x: 250, y: 100 }, data: { label: 'Project: E-Commerce' } },
    { id: '2', position: { x: 250, y: 250 }, data: { label: 'Schema: Order' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function SchemaEditor() {
    const { syncToBackend } = useArchitectStore();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    useEffect(() => {
        useArchitectStore.setState({ nodes, edges });
    }, [nodes, edges]);

    return (
        <ArchitectLayout title="Schema Editor">
            <Head title="Schema Editor" />

            <div className="h-[calc(100vh-140px)] border rounded-lg overflow-hidden relative shadow-sm">
                <div className="absolute top-4 right-4 z-10">
                    <Button onClick={() => syncToBackend()} size="sm" className="gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                    </Button>
                </div>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    colorMode="system"
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>
            </div>
        </ArchitectLayout>
    );
}
