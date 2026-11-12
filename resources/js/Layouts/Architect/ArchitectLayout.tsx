import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { LayoutDashboard, Box, Wand2, Settings, GitBranch, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ArchitectLayout({ children, title }: { children: React.ReactNode, title?: string }) {
    const navItems = [
        { name: 'Dashboard', routeName: 'architect.dashboard', href: route('architect.dashboard'), icon: LayoutDashboard },
        { name: 'My Projects', routeName: 'architect.projects.index', href: route('architect.projects.index'), icon: Box },
        { name: 'Logic Refactorer', routeName: 'architect.tools.refactorer', href: route('architect.tools.refactorer'), icon: Wand2 },
        { name: 'Git Operations', routeName: '#', href: '#', icon: GitBranch },
        { name: 'Settings', routeName: '#', href: '#', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground font-sans antialiased">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-muted/30 flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <Box className="w-6 h-6" />
                        Architect<span className="text-primary">Engine</span>
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                // @ts-ignore
                                item.routeName !== '#' && route().current(item.routeName) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-2 w-full px-4 text-sm font-medium h-10 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors justify-start"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-14 border-b flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border flex items-center justify-center text-xs font-bold">
                            ME
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
