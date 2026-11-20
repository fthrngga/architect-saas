import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const stateRef = useRef({
        x: -100,
        y: -100,
        ringX: -100,
        ringY: -100,
        isHover: false,
        label: '',
        isMoving: false,
        rafId: null,
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Don't activate on touch screens or mobile
        if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
            return;
        }

        document.body.classList.add('has-custom-cursor');

        const state = stateRef.current;

        const updateRingPosition = () => {
            const dx = state.x - state.ringX;
            const dy = state.y - state.ringY;

            state.ringX += dx * 0.22;
            state.ringY += dy * 0.22;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0)`;
            }

            // If still catching up, keep RAF going. If settled, pause RAF!
            if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
                state.rafId = requestAnimationFrame(updateRingPosition);
            } else {
                state.isMoving = false;
                state.rafId = null;
            }
        };

        const handleMouseMove = (e) => {
            state.x = e.clientX;
            state.y = e.clientY;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }

            // Start RAF only if not already running
            if (!state.isMoving) {
                state.isMoving = true;
                state.rafId = requestAnimationFrame(updateRingPosition);
            }

            // Check interactive targets
            const target = e.target;
            const isTextControl = target.closest('input, textarea, select');
            const interactive = target.closest('a, button, [data-cursor-hover], [role="button"]');
            const customLabelEl = target.closest('[data-cursor-label]');

            // If hovering over text input, hide custom cursor to show native text caret
            if (isTextControl) {
                if (dotRef.current) dotRef.current.style.opacity = '0';
                if (ringRef.current) ringRef.current.style.opacity = '0';
                return;
            } else {
                if (dotRef.current) dotRef.current.style.opacity = '1';
                if (ringRef.current) ringRef.current.style.opacity = '1';
            }

            const isInteractive = !!interactive;
            const customLabel = customLabelEl ? customLabelEl.getAttribute('data-cursor-label') : '';

            if (ringRef.current) {
                if (customLabel) {
                    ringRef.current.classList.add('is-label');
                    ringRef.current.classList.remove('is-hover');
                    ringRef.current.textContent = customLabel;
                } else if (isInteractive) {
                    ringRef.current.classList.add('is-hover');
                    ringRef.current.classList.remove('is-label');
                    ringRef.current.textContent = '';
                } else {
                    ringRef.current.classList.remove('is-hover', 'is-label');
                    ringRef.current.textContent = '';
                }
            }
        };

        const handleMouseLeave = () => {
            if (dotRef.current) dotRef.current.style.opacity = '0';
            if (ringRef.current) ringRef.current.style.opacity = '0';
        };

        const handleMouseEnter = () => {
            if (dotRef.current) dotRef.current.style.opacity = '1';
            if (ringRef.current) ringRef.current.style.opacity = '1';
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            document.body.classList.remove('has-custom-cursor');
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            if (state.rafId) cancelAnimationFrame(state.rafId);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </>
    );
}
