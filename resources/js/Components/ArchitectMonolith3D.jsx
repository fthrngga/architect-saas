import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ArchitectMonolith3D({ className = '' }) {
    const containerRef = useRef(null);
    const [isExploded, setIsExploded] = useState(false);
    const [isBlueprint, setIsBlueprint] = useState(false);
    const [activeTier, setActiveTier] = useState(null);

    // References for interactive animation
    const stateRef = useRef({
        isExploded: false,
        isBlueprint: false,
        explodeT: 0,
        targetExplodeT: 0,
        rotY: 0.6,
        targetRotY: 0.6,
        rotX: 0.25,
        targetRotX: 0.25,
        isDragging: false,
        prevMouseX: 0,
        prevMouseY: 0,
    });

    useEffect(() => {
        stateRef.current.targetExplodeT = isExploded ? 1 : 0;
    }, [isExploded]);

    useEffect(() => {
        stateRef.current.isBlueprint = isBlueprint;
    }, [isBlueprint]);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        // 1. Scene & Camera Setup (Axonometric Isometric Orthographic Angle)
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
        camera.position.set(9, 7.5, 9);
        camera.lookAt(0, 0, 0);

        // 2. High-Efficiency WebGL Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
        renderer.shadowMap.enabled = false;
        container.appendChild(renderer.domElement);

        // 3. Studio Architectural Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
        keyLight.position.set(10, 15, 8);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xf59e0b, 1.2);
        fillLight.position.set(-8, 5, -6);
        scene.add(fillLight);

        // 4. Base CAD Grid Floor
        const gridHelper = new THREE.GridHelper(16, 16, 0x00f0ff, 0x1e293b);
        gridHelper.position.y = -2.6;
        scene.add(gridHelper);

        // 5. Monolith Assembly Root Group
        const rootGroup = new THREE.Group();
        scene.add(rootGroup);

        // 5.1 Materials Definitions (Solid vs Blueprint Wireframe)
        const solidObsidianMat = new THREE.MeshStandardMaterial({
            color: 0x0d111a,
            roughness: 0.25,
            metalness: 0.8,
        });

        const solidTitaniumMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.35,
            metalness: 0.6,
        });

        const solidGlassMat = new THREE.MeshPhysicalMaterial({
            color: 0x0284c7,
            transmission: 0.85,
            opacity: 0.85,
            transparent: true,
            roughness: 0.1,
            metalness: 0.1,
            clearcoat: 1.0,
        });

        const cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const amberGlowMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
        const wireframeCyanMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75 });
        const wireframeDimMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });

        // Helper to add architectural edge outlines
        const addEdges = (mesh, color = 0x00f0ff) => {
            const edges = new THREE.EdgesGeometry(mesh.geometry);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color }));
            mesh.add(line);
            return line;
        };

        // -----------------------------------------------------------------
        // TIER 01: SUBSTRUCTURE / FOUNDATION (DATABASE & RDS RELATIONAL ENGINE)
        // -----------------------------------------------------------------
        const tier1Group = new THREE.Group();
        tier1Group.position.y = -1.2;
        rootGroup.add(tier1Group);

        // Heavy concrete base slab
        const baseSlabGeo = new THREE.BoxGeometry(4.2, 0.45, 4.2);
        const baseSlab = new THREE.Mesh(baseSlabGeo, solidObsidianMat);
        addEdges(baseSlab, 0x00f0ff);
        tier1Group.add(baseSlab);

        // Internal relational server core blocks
        for (let x = -1; x <= 1; x += 2) {
            for (let z = -1; z <= 1; z += 2) {
                const coreBlockGeo = new THREE.BoxGeometry(1.2, 0.5, 1.2);
                const coreBlock = new THREE.Mesh(coreBlockGeo, solidTitaniumMat);
                coreBlock.position.set(x * 1.1, 0.45, z * 1.1);
                addEdges(coreBlock, 0x38bdf8);
                tier1Group.add(coreBlock);

                // Glowing blue database bus indicator
                const busGeo = new THREE.PlaneGeometry(0.8, 0.08);
                const bus = new THREE.Mesh(busGeo, cyanGlowMat);
                bus.position.set(x * 1.1, 0.71, z * 1.1 + 0.61);
                tier1Group.add(bus);
            }
        }

        // Subterranean glowing MySQL data ring
        const ringGeo = new THREE.RingGeometry(1.6, 1.8, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.72;
        tier1Group.add(ring);

        // -----------------------------------------------------------------
        // TIER 02: SUPERSTRUCTURE CORE (BUSINESS LOGIC, ELOQUENT & AST SERVICES)
        // -----------------------------------------------------------------
        const tier2Group = new THREE.Group();
        tier2Group.position.y = 0;
        rootGroup.add(tier2Group);

        // 6 Structural Architectural Columns
        const columnGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 12);
        const columnPositions = [
            [-1.7, 0, -1.7], [0, 0, -1.7], [1.7, 0, -1.7],
            [-1.7, 0, 1.7],  [0, 0, 1.7],  [1.7, 0, 1.7],
        ];

        columnPositions.forEach((pos) => {
            const col = new THREE.Mesh(columnGeo, solidTitaniumMat);
            col.position.set(...pos);
            addEdges(col, 0x38bdf8);
            tier2Group.add(col);
        });

        // Center Glass Core Room (Housing the Compiler AST)
        const coreRoomGeo = new THREE.BoxGeometry(2.4, 1.4, 2.4);
        const coreRoom = new THREE.Mesh(coreRoomGeo, solidGlassMat);
        addEdges(coreRoom, 0x00f0ff);
        tier2Group.add(coreRoom);

        // Floating rotating icosahedron inside the glass room
        const icoGeo = new THREE.IcosahedronGeometry(0.55, 1);
        const icoMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
        const icoMesh = new THREE.Mesh(icoGeo, icoMat);
        tier2Group.add(icoMesh);

        // -----------------------------------------------------------------
        // TIER 03: THE CROWN / INTERFACE PAVILION (REACT 18 & INERTIA UI)
        // -----------------------------------------------------------------
        const tier3Group = new THREE.Group();
        tier3Group.position.y = 1.35;
        rootGroup.add(tier3Group);

        // Cantilevered Observation Canopy Floor
        const canopyFloorGeo = new THREE.BoxGeometry(4.6, 0.28, 4.6);
        const canopyFloor = new THREE.Mesh(canopyFloorGeo, solidObsidianMat);
        addEdges(canopyFloor, 0x00f0ff);
        tier3Group.add(canopyFloor);

        // Cantilevered Glass Roof
        const roofGeo = new THREE.BoxGeometry(4.8, 0.18, 4.8);
        const roofMesh = new THREE.Mesh(roofGeo, solidTitaniumMat);
        roofMesh.position.y = 1.1;
        addEdges(roofMesh, 0x00f0ff);
        tier3Group.add(roofMesh);

        // Floating Holographic Screen Ribbons (UI Planes)
        const uiPlaneGeo = new THREE.PlaneGeometry(1.6, 0.85);
        const uiPlaneMat = new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            transmission: 0.7,
            transparent: true,
            opacity: 0.8,
            roughness: 0.1,
            metalness: 0.2,
            side: THREE.DoubleSide,
        });

        const uiPlane1 = new THREE.Mesh(uiPlaneGeo, uiPlaneMat);
        uiPlane1.position.set(0, 0.55, 1.8);
        addEdges(uiPlane1, 0x00f0ff);
        tier3Group.add(uiPlane1);

        const uiPlane2 = new THREE.Mesh(uiPlaneGeo, uiPlaneMat);
        uiPlane2.position.set(1.8, 0.55, 0);
        uiPlane2.rotation.y = Math.PI / 2;
        addEdges(uiPlane2, 0x00f0ff);
        tier3Group.add(uiPlane2);

        // Crown Antenna / Telemetry Mast
        const mastGeo = new THREE.CylinderGeometry(0.04, 0.06, 1.4, 8);
        const mast = new THREE.Mesh(mastGeo, cyanGlowMat);
        mast.position.set(0, 1.85, 0);
        tier3Group.add(mast);

        // Top beacon light
        const beaconGeo = new THREE.SphereGeometry(0.12, 12, 12);
        const beacon = new THREE.Mesh(beaconGeo, amberGlowMat);
        beacon.position.set(0, 2.55, 0);
        tier3Group.add(beacon);

        // -----------------------------------------------------------------
        // VERTICAL ARCHITECTURAL DIMENSION LINES (Revealed on Explode)
        // -----------------------------------------------------------------
        const dimGroup = new THREE.Group();
        rootGroup.add(dimGroup);

        const createDimLine = (x, z) => {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x, -2.5, z),
                new THREE.Vector3(x, 3.5, z),
            ]);
            const lineMat = new THREE.LineDashedMaterial({
                color: 0x00f0ff,
                dashSize: 0.2,
                gapSize: 0.15,
                transparent: true,
                opacity: 0,
            });
            const line = new THREE.Line(lineGeo, lineMat);
            line.computeLineDistances();
            dimGroup.add(line);
            return line;
        };

        const dimLines = [
            createDimLine(-2.3, -2.3),
            createDimLine(2.3, -2.3),
            createDimLine(-2.3, 2.3),
            createDimLine(2.3, 2.3),
        ];

        // 6. Interactive Drag Orbit & Parallax
        const state = stateRef.current;

        const onPointerDown = (e) => {
            state.isDragging = true;
            state.prevMouseX = e.clientX;
            state.prevMouseY = e.clientY;
        };

        const onPointerMove = (e) => {
            if (state.isDragging) {
                const deltaX = e.clientX - state.prevMouseX;
                const deltaY = e.clientY - state.prevMouseY;
                state.targetRotY += deltaX * 0.008;
                state.targetRotX += deltaY * 0.008;
                state.prevMouseX = e.clientX;
                state.prevMouseY = e.clientY;
            } else {
                // Gentle parallax when not dragging
                const rect = container.getBoundingClientRect();
                const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
                state.targetRotY = 0.6 + nx * 0.35;
                state.targetRotX = 0.25 - ny * 0.2;
            }
        };

        const onPointerUp = () => {
            state.isDragging = false;
        };

        container.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp);

        // 7. Viewport Visibility Culling (Pause RAF when scrolled off)
        let isVisible = true;
        let animId = null;

        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible && !animId) {
                animId = requestAnimationFrame(animate);
            }
        }, { threshold: 0.05 });
        observer.observe(container);

        // 8. Animation Loop
        const clock = new THREE.Clock();

        const animate = () => {
            if (!isVisible) {
                animId = null;
                return;
            }
            animId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            // Smooth interpolation for Explode factor (Spring feel)
            state.explodeT += (state.targetExplodeT - state.explodeT) * 0.08;
            const t = state.explodeT;

            // Explode positions:
            // Tier 1 drops: -1.2 -> -2.2
            tier1Group.position.y = -1.2 - t * 0.9;

            // Tier 2 stays: 0
            tier2Group.position.y = 0;

            // Tier 3 elevates: 1.35 -> 2.6
            tier3Group.position.y = 1.35 + t * 1.3;

            // Animate internal icosahedron core
            icoMesh.rotation.y = time * 0.8;
            icoMesh.rotation.x = time * 0.5;

            // Beacon pulsing
            beacon.scale.setScalar(1 + Math.sin(time * 4) * 0.15);

            // Dimension lines visibility and opacity
            dimLines.forEach((line) => {
                line.material.opacity = t * 0.6;
            });

            // Smooth rotation damping
            state.rotY += (state.targetRotY - state.rotY) * 0.06;
            state.rotX += (state.targetRotX - state.rotX) * 0.06;
            rootGroup.rotation.y = state.rotY;
            rootGroup.rotation.x = state.rotX;

            renderer.render(scene, camera);
        };

        animId = requestAnimationFrame(animate);

        // Resize handler
        const handleResize = () => {
            if (!container) return;
            const nw = container.clientWidth;
            const nh = container.clientHeight;
            if (nw === 0 || nh === 0) return;
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
        };
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            if (animId) cancelAnimationFrame(animId);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);

            renderer.dispose();
            if (renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className={`relative w-full h-full flex flex-col items-center select-none ${className}`}>
            {/* Viewport Canvas */}
            <div
                ref={containerRef}
                className="w-full h-full cursor-grab active:cursor-grabbing relative"
            />

            {/* Top CAD Coordinates Telemetry */}
            <div className="absolute top-3 left-4 flex items-center gap-3 font-cad text-[10px] text-cyan-400 bg-[#07090e]/80 border border-cyan-500/20 px-3 py-1 rounded backdrop-blur-md pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>AXONOMETRIC 3D MODEL</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">SCALE: 1:1 REALTIME</span>
            </div>

            {/* Bottom Interactive Blueprint Controls */}
            <div className="absolute bottom-3 inset-x-4 flex flex-wrap items-center justify-between gap-3 font-cad text-xs">
                {/* Mode Selector */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExploded(!isExploded)}
                        className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-wider uppercase transition-all border ${
                            isExploded
                                ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                                : 'bg-[#0d111a]/90 text-cyan-300 border-cyan-500/30 hover:border-cyan-400'
                        }`}
                    >
                        {isExploded ? 'ASSEMBLE MONOLITH' : 'EXPLODE TIERS (AKSONOMETRI)'}
                    </button>
                </div>

                {/* Structural Tier Indicators */}
                <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400 bg-[#0d111a]/85 border border-white/10 px-3 py-1 rounded backdrop-blur-md">
                    <span className="flex items-center gap-1.5 text-cyan-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        TIER 03: INERTIA UI
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1.5 text-amber-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        TIER 02: ELOQUENT AST
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1.5 text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        TIER 01: RDS ENGINE
                    </span>
                </div>
            </div>
        </div>
    );
}

