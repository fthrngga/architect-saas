import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ArchitectSculpture3D() {
    const mountRef = useRef(null);
    const stateRef = useRef({
        rafId: null,
        scene: null,
        camera: null,
        renderer: null,
        group: null,
        targetRotX: 0.35,
        targetRotY: 0.65,
        currentRotX: 0.35,
        currentRotY: 0.65,
        isVisible: true,
    });

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const width = container.clientWidth || 400;
        const height = container.clientHeight || 400;

        // SCENE
        const scene = new THREE.Scene();

        // ORTHOGRAPHIC / ISOMETRIC-LIKE PERSPECTIVE CAMERA
        const aspect = width / height;
        const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 1000);
        camera.position.set(20, 24, 30);
        camera.lookAt(0, 0, 0);

        // RENDERER
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        container.appendChild(renderer.domElement);

        // LIGHTING
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
        dirLight.position.set(20, 40, 20);
        scene.add(dirLight);

        const pointLight = new THREE.PointLight(0x818cf8, 4, 60);
        pointLight.position.set(-15, 10, -10);
        scene.add(pointLight);

        // ROOT ARCHITECTURAL GROUP
        const rootGroup = new THREE.Group();
        scene.add(rootGroup);

        // 1. ISOMETRIC BASE GRID / DRAFTING PLANE
        const gridHelper = new THREE.GridHelper(26, 14, 0x38bdf8, 0x1e293b);
        gridHelper.position.y = -3.5;
        gridHelper.material.opacity = 0.4;
        gridHelper.material.transparent = true;
        rootGroup.add(gridHelper);

        // 2. MODULAR ARCHITECTURAL BLOCKS (Software Foundation Layers)
        const blockGeo = new THREE.BoxGeometry(4.2, 1.4, 4.2);
        const edgesGeo = new THREE.EdgesGeometry(blockGeo);

        const blockConfigs = [
            // Center Core Foundation (Database / Tenancy)
            { x: 0, y: -2, z: 0, color: 0x1e1b4b, edgeColor: 0x6366f1, opacity: 0.85 },
            // Middle Layer (Business Logic / Schema)
            { x: -3.5, y: 0.2, z: 1.5, color: 0x0f172a, edgeColor: 0x38bdf8, opacity: 0.9 },
            { x: 3.5, y: 0.8, z: -1.5, color: 0x0f172a, edgeColor: 0x38bdf8, opacity: 0.9 },
            // Top Elevated Layer (Full-Stack UI / API)
            { x: 0, y: 3.2, z: 0, color: 0x0369a1, edgeColor: 0x38bdf8, opacity: 0.95 },
            // Floating Satellite Block (Client Application)
            { x: 4.8, y: 4.5, z: 3.2, color: 0x064e3b, edgeColor: 0x34d399, opacity: 0.9 },
        ];

        const blocks = [];

        blockConfigs.forEach((cfg) => {
            const blockGroup = new THREE.Group();
            blockGroup.position.set(cfg.x, cfg.y, cfg.z);

            // Translucent glass block body
            const mat = new THREE.MeshStandardMaterial({
                color: cfg.color,
                roughness: 0.2,
                metalness: 0.7,
                transparent: true,
                opacity: cfg.opacity,
            });
            const mesh = new THREE.Mesh(blockGeo, mat);
            blockGroup.add(mesh);

            // Glowing architectural wireframe edge
            const edgeMat = new THREE.LineBasicMaterial({
                color: cfg.edgeColor,
                linewidth: 2,
            });
            const edgeLines = new THREE.LineSegments(edgesGeo, edgeMat);
            blockGroup.add(edgeLines);

            rootGroup.add(blockGroup);
            blocks.push({ group: blockGroup, initY: cfg.y, speed: 0.002 + Math.random() * 0.001 });
        });

        // 3. GLOWING CONNECTING CONDUITS (Foreign Key Data Streams)
        const conduitMat = new THREE.LineDashedMaterial({
            color: 0x38bdf8,
            dashSize: 0.8,
            gapSize: 0.4,
            linewidth: 2,
            opacity: 0.7,
            transparent: true,
        });

        const conduitPoints = [
            new THREE.Vector3(0, -1.3, 0),
            new THREE.Vector3(-3.5, 0.2, 1.5),
            new THREE.Vector3(0, 3.2, 0),
            new THREE.Vector3(3.5, 0.8, -1.5),
            new THREE.Vector3(0, -1.3, 0),
            new THREE.Vector3(4.8, 4.5, 3.2),
        ];
        const conduitGeo = new THREE.BufferGeometry().setFromPoints(conduitPoints);
        const conduitLine = new THREE.Line(conduitGeo, conduitMat);
        conduitLine.computeLineDistances();
        rootGroup.add(conduitLine);

        // STORE TO STATE
        const state = stateRef.current;
        state.scene = scene;
        state.camera = camera;
        state.renderer = renderer;
        state.group = rootGroup;

        // MOUSE PARALLAX TILT
        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;

            state.targetRotY = 0.65 + relX * 0.8;
            state.targetRotX = 0.35 + relY * 0.5;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // VIEWPORT OBSERVER (Zero GPU load when scrolled out of view)
        const observer = new IntersectionObserver(
            ([entry]) => {
                state.isVisible = entry.isIntersecting;
            },
            { threshold: 0.05 }
        );
        observer.observe(container);

        // ANIMATION LOOP
        let clock = 0;
        const animate = () => {
            if (state.isVisible) {
                clock += 0.015;

                // Subtle smooth damping towards target cursor rotation
                state.currentRotX += (state.targetRotX - state.currentRotX) * 0.05;
                state.currentRotY += (state.targetRotY - state.currentRotY) * 0.05;

                rootGroup.rotation.x = state.currentRotX;
                rootGroup.rotation.y = state.currentRotY + Math.sin(clock * 0.4) * 0.05;

                // Gentle vertical floating of architectural blocks
                blocks.forEach((b, i) => {
                    b.group.position.y = b.initY + Math.sin(clock + i * 1.5) * 0.2;
                });

                renderer.render(scene, camera);
            }

            state.rafId = requestAnimationFrame(animate);
        };

        state.rafId = requestAnimationFrame(animate);

        // RESIZE HANDLER
        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            observer.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (state.rafId) cancelAnimationFrame(state.rafId);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            blockGeo.dispose();
            edgesGeo.dispose();
        };
    }, []);

    return (
        <div className="relative w-full h-[420px] sm:h-[480px] flex items-center justify-center">
            {/* Ambient lighting backdrop */}
            <div className="absolute inset-0 bg-radial-gradient from-sky-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

            {/* Three.js Canvas Container */}
            <div
                ref={mountRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                data-cursor-label="TILT"
            />

            {/* Subtle Interactive Floating Badge */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 text-[11px] font-mono text-slate-400 backdrop-blur-md flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span>Real-time Isometric Architecture Engine</span>
                </span>
            </div>
        </div>
    );
}

