import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface ArchitectState {
    nodes: Node[];
    edges: Edge[];
    project: any | null;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    setProject: (project: any) => void;
    syncToBackend: () => Promise<void>;
}

export const useArchitectStore = create<ArchitectState>((set, get) => ({
    nodes: [],
    edges: [],
    project: null,
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setProject: (project) => set({ project }),
    syncToBackend: async () => {
        const { nodes, edges, project } = get();
        console.log("Syncing to backend...", { nodes, edges, projectId: project?.id });
        // axios.post('/architect/api/sync', { nodes, edges, projectId: project.id })
    },
}));
