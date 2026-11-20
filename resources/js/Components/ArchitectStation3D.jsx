import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export default function ArchitectStation3D({ className = '', onModeChange }) {
    const containerRef = useRef(null);
    const [activeScreenIndex, setActiveScreenIndex] = useState(0);

    const screenModes = [
        { title: 'RELATIONAL SCHEMA GRAPH', badge: 'DATABASE COMPILER' },
        { title: 'ELOQUENT AST SYNTHESIZER', badge: 'PSR-12 BACKEND' },
        { title: 'INERTIA REACT UI PIPELINE', badge: 'FRONTEND RUNTIME' },
    ];

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || 600;
        const height = container.clientHeight || 400;

        // 1. Scene & Camera Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
        camera.position.set(0, 2.2, 8.5);
        camera.lookAt(0, 0.2, 0);

        // 2. High-Efficiency Renderer (Optimized Pixel Ratio & No Shadow Map overhead)
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'default',
        });
        renderer.setSize(width, height);
        // Cap pixel ratio to max 1.25 to prevent mobile/4K GPU thermal throttling
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
        renderer.shadowMap.enabled = false;
        container.appendChild(renderer.domElement);

        // 3. Lightweight Studio Lighting
        const ambientLight = new THREE.AmbientLight(0xf4f1ea, 1.1);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
        keyLight.position.set(6, 10, 8);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.8);
        fillLight.position.set(-6, 4, -4);
        scene.add(fillLight);

        // 4. Main Transform Group
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // Pre-baked Radial Soft Contact Shadow (Zero GPU calculation cost)
        const shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = 128;
        shadowCanvas.height = 128;
        const shadowCtx = shadowCanvas.getContext('2d');
        const grad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
        grad.addColorStop(0, 'rgba(16, 30, 56, 0.6)');
        grad.addColorStop(0.5, 'rgba(16, 30, 56, 0.2)');
        grad.addColorStop(1, 'rgba(16, 30, 56, 0)');
        shadowCtx.fillStyle = grad;
        shadowCtx.fillRect(0, 0, 128, 128);

        const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
        const shadowGeo = new THREE.PlaneGeometry(7.2, 4.2);
        const shadowMat = new THREE.MeshBasicMaterial({
            map: shadowTexture,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
        });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.rotation.x = -Math.PI / 2;
        shadowMesh.position.y = -1.55;
        mainGroup.add(shadowMesh);

        // 5. Pre-Render the 3 Screen Textures ONCE (0% continuous CPU/GPU upload overhead!)
        const createPreRenderedScreenTexture = (modeIdx) => {
            const sc = document.createElement('canvas');
            sc.width = 960;
            sc.height = 600;
            const c = sc.getContext('2d');

            // Background
            c.fillStyle = '#0a1222';
            c.fillRect(0, 0, 960, 600);

            // Subtle grid
            c.strokeStyle = 'rgba(99, 114, 143, 0.1)';
            c.lineWidth = 1;
            for (let x = 0; x < 960; x += 32) {
                c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 600); c.stroke();
            }
            for (let y = 0; y < 600; y += 32) {
                c.beginPath(); c.moveTo(0, y); c.lineTo(960, y); c.stroke();
            }

            // Top Studio Titlebar
            c.fillStyle = '#101e38';
            c.fillRect(0, 0, 960, 56);
            c.strokeStyle = 'rgba(244, 241, 234, 0.12)';
            c.strokeRect(0, 0, 960, 56);

            // Dots
            c.fillStyle = '#f43f5e'; c.beginPath(); c.arc(24, 28, 5, 0, Math.PI * 2); c.fill();
            c.fillStyle = '#f59e0b'; c.beginPath(); c.arc(42, 28, 5, 0, Math.PI * 2); c.fill();
            c.fillStyle = '#10b981'; c.beginPath(); c.arc(60, 28, 5, 0, Math.PI * 2); c.fill();

            // Status pills
            c.font = 'bold 16px monospace';
            c.fillStyle = '#38bdf8';
            c.fillText('ARCHITECT_CORE // v1.2', 90, 34);

            c.font = '14px monospace';
            c.fillStyle = '#10b981';
            c.fillText('● ENGINE ACTIVE', 540, 34);

            c.fillStyle = 'rgba(244, 241, 234, 0.55)';
            c.fillText('RDS: AP-SOUTHEAST-2', 740, 34);

            if (modeIdx === 0) {
                // Relational Schema Graph
                c.fillStyle = '#f4f1ea';
                c.font = 'bold 22px sans-serif';
                c.fillText('Relational Schema Blueprint (Project Scoped)', 36, 100);

                c.font = '14px monospace';
                c.fillStyle = 'rgba(244, 241, 234, 0.55)';
                c.fillText('Row-level isolation enforced via `project_id` UUID foreign keys', 36, 126);

                // Table 1: users
                drawStaticCard(c, 36, 155, 250, 'users (auth)', [
                    'id: UUID PRIMARY',
                    'name: VARCHAR(255)',
                    'email: VARCHAR(255) UQ',
                    'handle: VARCHAR(10) UQ',
                ], '#3b82f6');

                // Table 2: projects
                drawStaticCard(c, 355, 155, 250, 'projects (tenants)', [
                    'id: UUID PRIMARY',
                    'user_id: BIGINT FK',
                    'name: VARCHAR(255)',
                    'slug: VARCHAR(64) UQ',
                ], '#10b981');

                // Table 3: invoices
                drawStaticCard(c, 674, 155, 250, 'invoices (ledger)', [
                    'id: UUID PRIMARY',
                    'project_id: UUID INDEX',
                    'invoice_number: VARCHAR',
                    'amount_cents: BIGINT',
                ], '#f59e0b');

                // Connecting lines
                c.strokeStyle = '#38bdf8';
                c.lineWidth = 2.5;
                c.setLineDash([5, 5]);
                c.beginPath(); c.moveTo(286, 220); c.lineTo(355, 220); c.stroke();
                c.strokeStyle = '#34d399';
                c.beginPath(); c.moveTo(605, 220); c.lineTo(674, 220); c.stroke();
                c.setLineDash([]);

                // Telemetry footer
                c.fillStyle = 'rgba(16, 30, 56, 0.7)';
                c.beginPath(); c.roundRect(36, 500, 888, 65, 10); c.fill();
                c.strokeStyle = 'rgba(56, 189, 248, 0.25)'; c.stroke();

                c.font = 'bold 15px monospace';
                c.fillStyle = '#38bdf8';
                c.fillText('⚡ DETERMINISTIC COMPILER: Models and migrations compile in memory without breaking Vite chunks.', 54, 540);

            } else if (modeIdx === 1) {
                // Eloquent AST
                c.fillStyle = '#f4f1ea';
                c.font = 'bold 22px sans-serif';
                c.fillText('Synthesized Eloquent Model (Modular Architecture)', 36, 100);

                c.fillStyle = '#0f172a';
                c.beginPath(); c.roundRect(36, 125, 888, 440, 12); c.fill();
                c.strokeStyle = 'rgba(244, 241, 234, 0.1)'; c.stroke();

                const code = [
                    { t: '<?php', c: '#818cf8' },
                    { t: 'namespace App\\Modules\\Invoice\\Models;', c: '#f4f1ea' },
                    { t: 'use Illuminate\\Database\\Eloquent\\Model;', c: '#93c5fd' },
                    { t: 'use Illuminate\\Database\\Eloquent\\Concerns\\HasUuids;', c: '#93c5fd' },
                    { t: '', c: '#f4f1ea' },
                    { t: 'class Invoice extends Model {', c: '#38bdf8' },
                    { t: '    use HasUuids;', c: '#fbbf24' },
                    { t: '    protected $table = "invoices";', c: '#a7f3d0' },
                    { t: '    protected $fillable = ["project_id", "invoice_number", "amount_cents"];', c: '#a7f3d0' },
                    { t: '', c: '#f4f1ea' },
                    { t: '    public function scopeForProject($query, string $projectId) {', c: '#38bdf8' },
                    { t: '        return $query->where("project_id", $projectId);', c: '#f472b6' },
                    { t: '    }', c: '#38bdf8' },
                    { t: '}', c: '#38bdf8' },
                ];
                c.font = '16px monospace';
                code.forEach((l, i) => {
                    c.fillStyle = l.c;
                    c.fillText(l.t, 60, 165 + i * 26);
                });
            } else {
                // React UI
                c.fillStyle = '#f4f1ea';
                c.font = 'bold 22px sans-serif';
                c.fillText('React 18 + Inertia Client Interface', 36, 100);

                c.fillStyle = '#0f172a';
                c.beginPath(); c.roundRect(36, 125, 888, 440, 12); c.fill();
                c.strokeStyle = 'rgba(244, 241, 234, 0.1)'; c.stroke();

                const code = [
                    { t: 'import React from "react";', c: '#818cf8' },
                    { t: 'import { Head, Link } from "@inertiajs/react";', c: '#93c5fd' },
                    { t: 'import AppLayout from "@/Layouts/AppLayout";', c: '#93c5fd' },
                    { t: '', c: '#f4f1ea' },
                    { t: 'export default function InvoiceIndex({ items, project }) {', c: '#38bdf8' },
                    { t: '    return (', c: '#f4f1ea' },
                    { t: '        <AppLayout project={project} title="Invoice Ledger">', c: '#fbbf24' },
                    { t: '            <DynamicTable items={items} onFilter={applyScope} />', c: '#a7f3d0' },
                    { t: '        </AppLayout>', c: '#fbbf24' },
                    { t: '    );', c: '#f4f1ea' },
                    { t: '}', c: '#38bdf8' },
                ];
                c.font = '16px monospace';
                code.forEach((l, i) => {
                    c.fillStyle = l.c;
                    c.fillText(l.t, 60, 165 + i * 26);
                });
            }

            const tex = new THREE.CanvasTexture(sc);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        const drawStaticCard = (c, x, y, w, title, fields, accent) => {
            c.fillStyle = '#142442';
            c.beginPath(); c.roundRect(x, y, w, 220, 8); c.fill();
            c.strokeStyle = accent; c.lineWidth = 1.5; c.stroke();

            c.fillStyle = accent;
            c.beginPath(); c.roundRect(x, y, w, 34, [8, 8, 0, 0]); c.fill();

            c.fillStyle = '#ffffff';
            c.font = 'bold 14px monospace';
            c.fillText(title, x + 12, y + 22);

            fields.forEach((f, idx) => {
                c.fillStyle = idx % 2 === 0 ? 'rgba(244, 241, 234, 0.04)' : 'transparent';
                c.fillRect(x + 2, y + 36 + idx * 42, w - 4, 40);

                c.fillStyle = '#f4f1ea';
                c.font = '12px monospace';
                c.fillText(f, x + 10, y + 62 + idx * 42);
            });
        };

        const preRenderedTextures = [
            createPreRenderedScreenTexture(0),
            createPreRenderedScreenTexture(1),
            createPreRenderedScreenTexture(2),
        ];

        // 6. The 3D Workstation Station Deck & Display
        const stationGroup = new THREE.Group();
        mainGroup.add(stationGroup);

        // A. Sleek Brushed Metal Base Deck
        const deckGeo = new RoundedBoxGeometry(4.4, 0.35, 2.8, 6, 0.12);
        const deckMat = new THREE.MeshStandardMaterial({
            color: 0x142442,
            roughness: 0.35,
            metalness: 0.5,
        });
        const deckMesh = new THREE.Mesh(deckGeo, deckMat);
        deckMesh.position.y = -1.25;
        stationGroup.add(deckMesh);

        // Inset glowing stripe
        const deckStripeGeo = new THREE.PlaneGeometry(3.6, 0.04);
        const deckStripeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const deckStripe = new THREE.Mesh(deckStripeGeo, deckStripeMat);
        deckStripe.position.set(0, -1.06, 1.38);
        stationGroup.add(deckStripe);

        // B. Curved Floating Bezel Display
        const bezelGeo = new RoundedBoxGeometry(4.6, 2.88, 0.2, 6, 0.14);
        const bezelMat = new THREE.MeshStandardMaterial({
            color: 0x0b1528,
            roughness: 0.4,
            metalness: 0.3,
        });
        const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
        bezelMesh.position.set(0, 0.38, -0.2);
        bezelMesh.rotation.x = -0.08;
        stationGroup.add(bezelMesh);

        // C. OLED Screen Plane displaying pre-rendered texture
        const screenPlaneGeo = new THREE.PlaneGeometry(4.35, 2.65);
        const screenPlaneMat = new THREE.MeshBasicMaterial({
            map: preRenderedTextures[0],
            toneMapped: false,
        });
        const screenMesh = new THREE.Mesh(screenPlaneGeo, screenPlaneMat);
        screenMesh.position.set(0, 0.38, -0.08);
        screenMesh.rotation.x = -0.08;
        stationGroup.add(screenMesh);

        // 7. Floating Dimensional Badges (Rendered once)
        const badgeDefinitions = [
            { text: '🐘 Laravel 11.x', pos: [-3.2, 1.4, 0.8], phase: 0 },
            { text: '⚛️ React 18 + Inertia', pos: [3.2, 1.2, 0.7], phase: 1.5 },
            { text: '🗄️ AWS RDS MySQL', pos: [-3.0, -0.4, 1.2], phase: 3 },
            { text: '📦 Git Standalone', pos: [3.1, -0.5, 1.1], phase: 4.5 },
        ];

        const badgeMeshes = [];

        badgeDefinitions.forEach((def) => {
            const bCanvas = document.createElement('canvas');
            bCanvas.width = 280;
            bCanvas.height = 76;
            const bCtx = bCanvas.getContext('2d');

            bCtx.fillStyle = 'rgba(16, 30, 56, 0.9)';
            bCtx.beginPath();
            bCtx.roundRect(2, 2, 276, 72, 36);
            bCtx.fill();
            bCtx.lineWidth = 2.5;
            bCtx.strokeStyle = 'rgba(244, 241, 234, 0.25)';
            bCtx.stroke();

            bCtx.fillStyle = '#f4f1ea';
            bCtx.font = 'bold 24px sans-serif';
            bCtx.textAlign = 'center';
            bCtx.textBaseline = 'middle';
            bCtx.fillText(def.text, 140, 38);

            const bTex = new THREE.CanvasTexture(bCanvas);
            const bGeo = new THREE.PlaneGeometry(1.4, 0.38);
            const bMat = new THREE.MeshBasicMaterial({ map: bTex, transparent: true });
            const bMesh = new THREE.Mesh(bGeo, bMat);
            bMesh.position.set(...def.pos);
            bMesh.userData = { initialY: def.pos[1], phase: def.phase };
            stationGroup.add(bMesh);
            badgeMeshes.push(bMesh);
        });

        // 8. Viewport Intersection Observer: Pause loop when scrolled offscreen!
        let isVisible = true;
        let animId = null;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible && !animId) {
                    animId = requestAnimationFrame(animate);
                }
            },
            { threshold: 0.05 }
        );
        observer.observe(container);

        // 9. Pointer Tracking & Momentum Spin
        let targetRotX = 0;
        let targetRotY = 0;
        let spinMomentum = 0;
        let isPointerOver = false;
        let currentScreen = 0;

        const handlePointerMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

            targetRotY = x * 0.4;
            targetRotX = -y * 0.2;
            isPointerOver = true;
        };

        const handlePointerLeave = () => {
            isPointerOver = false;
        };

        const handleClick = () => {
            spinMomentum = Math.PI * 2;
            currentScreen = (currentScreen + 1) % 3;
            // Instant texture swap with 0 CPU overhead!
            screenMesh.material.map = preRenderedTextures[currentScreen];
            setActiveScreenIndex(currentScreen);
            if (onModeChange) onModeChange(screenModes[currentScreen]);
        };

        container.addEventListener('pointermove', handlePointerMove, { passive: true });
        container.addEventListener('pointerleave', handlePointerLeave, { passive: true });
        container.addEventListener('click', handleClick);

        // 10. Animation Loop (Only runs when visible!)
        const clock = new THREE.Clock();

        const animate = () => {
            if (!isVisible) {
                animId = null;
                return;
            }

            animId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Badge floating bobbing
            for (let i = 0; i < badgeMeshes.length; i++) {
                const b = badgeMeshes[i];
                b.position.y = b.userData.initialY + Math.sin(time * 2 + b.userData.phase) * 0.07;
            }

            // Gentle idle sway
            if (!isPointerOver) {
                targetRotY = Math.sin(time * 0.5) * 0.1;
                targetRotX = Math.cos(time * 0.7) * 0.05;
            }

            // Spin momentum friction
            if (spinMomentum > 0.001) {
                const step = spinMomentum * 0.12;
                stationGroup.rotation.y += step;
                spinMomentum -= step;
            } else {
                stationGroup.rotation.y += (targetRotY - stationGroup.rotation.y) * 0.08;
            }

            stationGroup.rotation.x += (targetRotX - stationGroup.rotation.x) * 0.08;

            renderer.render(scene, camera);
        };

        animId = requestAnimationFrame(animate);

        // Resize handler
        const handleResize = () => {
            if (!container) return;
            const newW = container.clientWidth;
            const newH = container.clientHeight;
            if (newW === 0 || newH === 0) return;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        };
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            if (animId) cancelAnimationFrame(animId);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('pointermove', handlePointerMove);
            container.removeEventListener('pointerleave', handlePointerLeave);
            container.removeEventListener('click', handleClick);

            preRenderedTextures.forEach((t) => t.dispose());
            shadowTexture.dispose();
            renderer.dispose();
            if (renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className={`relative w-full h-full flex flex-col items-center select-none ${className}`}>
            <div
                ref={containerRef}
                data-cursor-label="TAP / SPIN"
                className="w-full h-full cursor-grab active:cursor-grabbing relative"
            />
            {/* Interactive Mode Bar */}
            <div className="absolute bottom-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-950/80 backdrop-blur-md border border-cream/20 shadow-lg text-[12px] font-mono text-cream/90 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-sky-400">{screenModes[activeScreenIndex].title}</span>
                <span className="text-cream/40">|</span>
                <span className="text-[11px] text-cream/70">CLICK 3D STATION TO CYCLE</span>
            </div>
        </div>
    );
}
