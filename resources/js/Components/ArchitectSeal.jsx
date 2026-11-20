import React from 'react';

export default function ArchitectSeal({ className = '', dark = false }) {
    const textColor = dark ? '#f6f4ee' : '#101c36';
    const accentColor = dark ? '#f97316' : '#c2410c';

    return (
        <div className={`relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center select-none pointer-events-none ${className}`}>
            {/* Rotating Circular Text Ring */}
            <svg
                viewBox="0 0 200 200"
                className="w-full h-full anim-spin-stamp"
            >
                <defs>
                    <path
                        id="sealCirclePath"
                        d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
                    />
                </defs>
                <text
                    fontSize="13.5"
                    fontWeight="700"
                    letterSpacing="3"
                    fill={textColor}
                    style={{ textTransform: 'uppercase', opacity: 0.85 }}
                >
                    <textPath href="#sealCirclePath" startOffset="0%">
                        • ARCHITECTURAL SYNTHESIS • 100% STANDALONE CODE • ZERO LOCK-IN •
                    </textPath>
                </text>
            </svg>

            {/* Inner Fixed Badge */}
            <div className="absolute inset-4 rounded-full border border-dashed flex flex-col items-center justify-center text-center p-2"
                style={{ borderColor: accentColor }}
            >
                <span className="font-mono text-[9px] uppercase tracking-widest font-bold" style={{ color: accentColor }}>
                    CERTIFIED
                </span>
                <span className="font-serif italic font-bold text-base leading-none" style={{ color: textColor }}>
                    Laravel 11
                </span>
                <span className="font-mono text-[8px] opacity-60 mt-0.5" style={{ color: textColor }}>
                    & React
                </span>
            </div>
        </div>
    );
}

