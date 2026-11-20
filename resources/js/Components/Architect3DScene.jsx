import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Architect3DScene({ className = '' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 1. Scene setup
        const scene = new THREE.Scene();

        // 2. Camera setup
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(12, 10, 16);
        camera.lookAt(0, 0, 0);

        // 3. Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // 4. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(10, 20, 15);
        dirLight.castShadow = true;
        scene.add(dirLight);

        const accentLight = new THREE.PointLight(0x3b82f6, 3, 25);
        accentLight.position.set(-5, 4, -2);
        scene.add(accentLight);

        const amberLight = new THREE.PointLight(0xf59e0b, 3, 25);
        amberLight.position.set(5, 4, 3);
        scene.add(amberLight);

        // 5. Architectural 3D Group
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // Grid Floor
        const gridHelper = new THREE.GridHelper(24, 24, 0x94a3b8, 0xe2e8f0);
        gridHelper.position.y = -2;
        mainGroup.add(gridHelper);

        // Materials
        const primaryGlassMat = new THREE.MeshPhysicalMaterial({
            color: 0x2563eb,
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.7,
            transparent: true,
            opacity: 0.85,
            reflectivity: 0.9,
            clearcoat: 1.0,
        });

        const accentGlassMat = new THREE.MeshPhysicalMaterial({
            color: 0xf59e0b,
            metalness: 0.1,
            roughness: 0.2,
            transmission: 0.6,
            transparent: true,
            opacity: 0.9,
            clearcoat: 1.0,
        });

        const slateMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.3,
            metalness: 0.7,
        });

        const wireframeMat = new THREE.LineBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.4,
        });

        // Center Monolith: The Architect Engine Core
        const coreGeo = new THREE.BoxGeometry(2.4, 3.2, 2.4);
        const coreMesh = new THREE.Mesh(coreGeo, primaryGlassMat);
        coreMesh.position.set(0, 0.6, 0);
        coreMesh.castShadow = true;
        mainGroup.add(coreMesh);

        // Core Wireframe edges
        const coreEdges = new THREE.EdgesGeometry(coreGeo);
        const coreLine = new THREE.LineSegments(coreEdges, new THREE.LineBasicMaterial({ color: 0x60a5fa, linewidth: 2 }));
        coreMesh.add(coreLine);

        // Internal glowing core
        const innerCoreGeo = new THREE.IcosahedronGeometry(0.7, 1);
        const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
        const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
        coreMesh.add(innerCoreMesh);

        // Satellite Nodes definitions
        const satellites = [
            { name: 'RDS MySQL', pos: [-4.5, 0.2, 3], color: 0x0284c7, size: [1.8, 1.2, 1.8], isCylinder: true },
            { name: 'Eloquent Models', pos: [4.5, 0.4, -2.5], color: 0xf59e0b, size: [1.6, 2, 1.6] },
            { name: 'Inertia React UI', pos: [3.8, 0.6, 4], color: 0x8b5cf6, size: [1.8, 1.8, 1.8] },
            { name: 'Git Export ZIP', pos: [-4, 0.5, -3.5], color: 0x10b981, size: [1.6, 1.5, 1.6] },
        ];

        const satelliteMeshes = [];
        const conduits = [];

        satellites.forEach((sat) => {
            let satMesh;
            if (sat.isCylinder) {
                const cylGeo = new THREE.CylinderGeometry(sat.size[0] / 2, sat.size[0] / 2, sat.size[1], 16);
                const satMat = new THREE.MeshPhysicalMaterial({
                    color: sat.color,
                    transmission: 0.6,
                    roughness: 0.2,
                    transparent: true,
                    opacity: 0.85
                });
                satMesh = new THREE.Mesh(cylGeo, satMat);
            } else {
                const boxGeo = new THREE.BoxGeometry(...sat.size);
                const satMat = new THREE.MeshPhysicalMaterial({
                    color: sat.color,
                    transmission: 0.6,
                    roughness: 0.2,
                    transparent: true,
                    opacity: 0.85
                });
                satMesh = new THREE.Mesh(boxGeo, satMat);
                const edges = new THREE.EdgesGeometry(boxGeo);
                const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: sat.color }));
                satMesh.add(line);
            }

            satMesh.position.set(...sat.pos);
            satMesh.castShadow = true;
            mainGroup.add(satMesh);
            satelliteMeshes.push(satMesh);

            // Base pedestal under satellite
            const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.2, 16);
            const pedestalMesh = new THREE.Mesh(pedestalGeo, slateMat);
            pedestalMesh.position.set(sat.pos[0], -1.9, sat.pos[2]);
            mainGroup.add(pedestalMesh);

            // Conduit connecting Satellite to Core
            const p1 = new THREE.Vector3(sat.pos[0], sat.pos[1], sat.pos[2]);
            const p2 = new THREE.Vector3(0, 0.6, 0);
            const mid = p1.clone().lerp(p2, 0.5).add(new THREE.Vector3(0, 1.2, 0));

            const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
            const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
            const tubeMat = new THREE.MeshStandardMaterial({
                color: 0x94a3b8,
                roughness: 0.4,
                metalness: 0.8,
                transparent: true,
                opacity: 0.6
            });
            const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
            mainGroup.add(tubeMesh);

            // Energy Pulse traveling along the curve
            const pulseGeo = new THREE.SphereGeometry(0.12, 12, 12);
            const pulseMat = new THREE.MeshBasicMaterial({ color: sat.color });
            const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
            mainGroup.add(pulseMesh);

            conduits.push({ curve, pulse: pulseMesh, speed: 0.006 + Math.random() * 0.004, progress: Math.random() });
        });

        // Floating architectural particles
        const particleCount = 70;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            particlePositions[i] = (Math.random() - 0.5) * 16;
            particlePositions[i + 1] = Math.random() * 8 - 1;
            particlePositions[i + 2] = (Math.random() - 0.5) * 16;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x38bdf8,
            size: 0.08,
            transparent: true,
            opacity: 0.7,
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        mainGroup.add(particles);

        // 6. Interaction & Animation
        let targetRotationX = 0;
        let targetRotationY = 0;
        let isPointerOver = false;

        const handlePointerMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

            targetRotationY = x * 0.4;
            targetRotationX = -y * 0.25;
            isPointerOver = true;
        };

        const handlePointerLeave = () => {
            isPointerOver = false;
        };

        container.addEventListener('pointermove', handlePointerMove);
        container.addEventListener('pointerleave', handlePointerLeave);

        // Responsive resize
        const handleResize = () => {
            if (!container) return;
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        // Animation Loop
        let animationFrameId;
        let clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            // Core idle animation
            coreMesh.rotation.y = time * 0.2;
            innerCoreMesh.rotation.x = time * 0.5;
            innerCoreMesh.rotation.z = time * 0.4;

            // Satellites floating bobbing
            satelliteMeshes.forEach((mesh, idx) => {
                mesh.position.y += Math.sin(time * 2 + idx) * 0.003;
                mesh.rotation.y += 0.005;
            });

            // Update energy pulses traveling conduits
            conduits.forEach((c) => {
                c.progress = (c.progress + c.speed) % 1;
                const point = c.curve.getPointAt(c.progress);
                c.pulse.position.copy(point);
            });

            // Particles floating
            particles.rotation.y = time * 0.03;

            // Interactive swaying rotation with smooth damping
            if (!isPointerOver) {
                targetRotationY = Math.sin(time * 0.3) * 0.15;
                targetRotationX = 0;
            }

            mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
            mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('pointermove', handlePointerMove);
            container.removeEventListener('pointerleave', handlePointerLeave);
            if (renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden ${className}`}
        />
    );
}

