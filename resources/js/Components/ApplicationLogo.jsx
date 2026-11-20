import React from 'react';

export default function ApplicationLogo({ 
    className = 'w-8 h-8', 
    variant = 'icon', 
    dark = false,
    ...props 
}) {
    const navyColor = dark ? '#f5f2eb' : '#101c36';
    const accentColor = '#c2410c'; // Architectural Terracotta
    const secondaryColor = dark ? '#94a3b8' : '#475569';

    // ICON ONLY
    const iconMark = (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            {/* Outer Architectural Framing (Subtle) */}
            <rect
                x="2"
                y="2"
                width="60"
                height="60"
                rx="14"
                fill={dark ? 'rgba(255,255,255,0.05)' : 'rgba(16,28,54,0.04)'}
                stroke={dark ? 'rgba(255,255,255,0.1)' : 'rgba(16,28,54,0.12)'}
                strokeWidth="1.5"
            />

            {/* Left Architectural Beam (Ascending) */}
            <path
                d="M17 48L30 14H34L21 48H17Z"
                fill={navyColor}
            />

            {/* Right Architectural Beam (Isometric Elevation) */}
            <path
                d="M30 14L47 48H43L31 22L30 14Z"
                fill={navyColor}
                opacity="0.8"
            />

            {/* Isometric Drafting Depth Plane */}
            <path
                d="M32 14L41 20L44 46L43 48L32 14Z"
                fill={navyColor}
                opacity="0.4"
            />

            {/* Architectural Crossbar / Caliper Tie-Rod (Terracotta) */}
            <rect
                x="20"
                y="33"
                width="24"
                height="4"
                rx="2"
                fill={accentColor}
            />

            {/* Precision Drafting Apex Point */}
            <circle
                cx="32"
                cy="14"
                r="3"
                fill={accentColor}
            />
        </svg>
    );

    if (variant === 'icon' || variant === 'symbol') {
        return iconMark;
    }

    // FULL LOGO WITH TYPOGRAPHY
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {iconMark}
            <div className="flex flex-col leading-none">
                <span className="font-poster text-2xl tracking-wider uppercase" style={{ color: navyColor }}>
                    ARCHITECT<span style={{ color: accentColor }}>SAAS</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest font-bold" style={{ color: secondaryColor }}>
                    SOFTWARE ATELIER
                </span>
            </div>
        </div>
    );
}
