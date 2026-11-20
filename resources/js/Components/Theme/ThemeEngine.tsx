import React, { useEffect, useMemo } from 'react';

export interface ThemeDefinition {
    id: string;
    name: string;
    description?: string;
    fontSans?: string;
    googleFontUrl?: string;
    radius?: string;
    swatches?: string[];
    light: Record<string, string>;
    dark: Record<string, string>;
    isCustom?: boolean;
    rawCss?: string;
}

interface ProjectThemeScopeProps {
    children: React.ReactNode;
    theme?: ThemeDefinition | null;
    isDark?: boolean;
    className?: string;
}

// Helper to convert OKLCH to raw HSL channels for Tailwind compatibility
function oklchToHsl(L: number, C: number, h_deg: number): string {
    const h_rad = (h_deg * Math.PI) / 180;
    const a = C * Math.cos(h_rad);
    const b_coord = C * Math.sin(h_rad);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b_coord;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b_coord;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b_coord;

    const l = Math.pow(Math.max(0, l_), 3);
    const m = Math.pow(Math.max(0, m_), 3);
    const s = Math.pow(Math.max(0, s_), 3);

    const r_lin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    const gamma = (c: number) => {
        if (c <= 0.0031308) return Math.max(0, Math.min(1, 12.92 * c));
        return Math.max(0, Math.min(1, 1.055 * Math.pow(c, 1 / 2.4) - 0.055));
    };

    const r = gamma(r_lin);
    const g = gamma(g_lin);
    const b = gamma(b_lin);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const lum = (max + min) / 2;

    let hue = 0;
    let sat = 0;
    if (delta !== 0) {
        sat = lum > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        if (max === r) {
            hue = (g - b) / delta + (g < b ? 6 : 0);
        } else if (max === g) {
            hue = (b - r) / delta + 2;
        } else {
            hue = (r - g) / delta + 4;
        }
        hue *= 60;
    }

    return `${hue.toFixed(1)} ${(sat * 100).toFixed(1)}% ${(lum * 100).toFixed(1)}%`;
}

const colorCache = new Map<string, string>();

function normalizeColorVal(val: string): string {
    if (!val) return val;
    val = val.trim();
    if (colorCache.has(val)) {
        return colorCache.get(val)!;
    }
    let res = val;
    if (val.startsWith('oklch(')) {
        const match = val.match(/oklch\(\s*([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)/);
        if (match) {
            res = oklchToHsl(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
        }
    } else if (val.startsWith('hsl(')) {
        res = val.replace(/^hsl\(/, '').replace(/\)$/, '').trim();
    }
    colorCache.set(val, res);
    return res;
}

export const DEFAULT_THEME: ThemeDefinition = {
    id: 'default-slate',
    name: 'Default Slate',
    description: 'Gaya monokrom bersih khas Shadcn UI standar.',
    fontSans: 'Plus Jakarta Sans',
    radius: '0.5rem',
    light: {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--card': '0 0% 100%',
        '--card-foreground': '222.2 84% 4.9%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '222.2 84% 4.9%',
        '--primary': '222.2 47.4% 11.2%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '210 40% 96.1%',
        '--secondary-foreground': '222.2 47.4% 11.2%',
        '--muted': '210 40% 96.1%',
        '--muted-foreground': '215.4 16.3% 46.9%',
        '--accent': '210 40% 96.1%',
        '--accent-foreground': '222.2 47.4% 11.2%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '214.3 31.8% 91.4%',
        '--input': '214.3 31.8% 91.4%',
        '--ring': '222.2 84% 4.9%',
        '--radius': '0.5rem',
    },
    dark: {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--card': '222.2 84% 7%',
        '--card-foreground': '210 40% 98%',
        '--popover': '222.2 84% 7%',
        '--popover-foreground': '210 40% 98%',
        '--primary': '210 40% 98%',
        '--primary-foreground': '222.2 47.4% 11.2%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--ring': '212.7 26.8% 83.9%',
        '--radius': '0.5rem',
    }
};

/**
 * Scoped container that applies custom CSS variables strictly to its children
 * without bleeding into the parent Studio interface.
 */
export function ProjectThemeScope({
    children,
    theme,
    isDark = false,
    className = ''
}: ProjectThemeScopeProps) {
    const effectiveTheme = theme || DEFAULT_THEME;

    // Dynamically inject Google Font if specified by the theme (debounced to avoid network thread lock)
    useEffect(() => {
        if (!effectiveTheme?.googleFontUrl) return;

        const linkId = `theme-font-${effectiveTheme.id}`;
        if (document.getElementById(linkId)) return;

        const timer = setTimeout(() => {
            if (!document.getElementById(linkId)) {
                const link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                link.href = effectiveTheme.googleFontUrl!;
                document.head.appendChild(link);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [effectiveTheme?.id, effectiveTheme?.googleFontUrl]);

    // Build CSS variable dictionary based on active mode
    const styleVariables = useMemo(() => {
        const activeVars = isDark ? (effectiveTheme.dark || effectiveTheme.light) : effectiveTheme.light;
        const styles: Record<string, string> = {};

        if (activeVars) {
            Object.entries(activeVars).forEach(([key, value]) => {
                styles[key] = normalizeColorVal(value);
            });
        }

        if (effectiveTheme.radius) {
            styles['--radius'] = effectiveTheme.radius;
        }

        if (effectiveTheme.fontSans) {
            styles['fontFamily'] = `"${effectiveTheme.fontSans}", sans-serif`;
        }

        return styles;
    }, [effectiveTheme, isDark]);

    return (
        <div
            className={`project-theme-scope ${isDark ? 'dark bg-background text-foreground' : 'bg-background text-foreground'} ${className}`}
            style={styleVariables as React.CSSProperties}
        >
            {children}
        </div>
    );
}
