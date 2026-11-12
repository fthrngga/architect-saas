import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import {
    LayoutDashboard,
    Box,
    Menu,
    X,
    LogOut,
    ChevronDown
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

interface UserAppLayoutProps {
    children: React.ReactNode;
    title?: string;
    project: any; // The current project context
    modules?: any[]; // List of modules for sidebar navigation
}

export default function UserAppLayout({ children, title, project, modules = [] }: UserAppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { auth, modules: sharedModules } = usePage().props as any;
    const effectiveModules = modules.length > 0 ? modules : (sharedModules || []);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0`}
            >
                <div className="h-16 flex items-center px-6 border-b">
                    <Link href={`/app/${project.owner.handle}/${project.slug}/dashboard`} className="flex items-center gap-2 font-bold text-xl">
                        <Box className="w-6 h-6 text-primary" />
                        <span>{project.name}</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden ml-auto"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    <div className="pk-2 py-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                            Menu
                        </h4>
                        <Link
                            href={`/app/${project.owner.handle}/${project.slug}/dashboard`}
                            // @ts-ignore
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${route().current('app.dashboard')
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <Link
                            href={`/app/${project.owner.handle}/${project.slug}/builder/modules`}
                            // @ts-ignore
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${route().current('app.builder.modules.index')
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <Box className="w-4 h-4" />
                            Builder
                        </Link>
                    </div>

                    {effectiveModules.length > 0 && (
                        <div className="pk-2 py-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                                Modules
                            </h4>
                            {effectiveModules.map((module: any) => {
                                const moduleUrl = `/app/${project.owner.handle}/${project.slug}/${module.table_name}`;
                                const isActive = usePage().url.startsWith(moduleUrl);

                                return (
                                    <Link
                                        key={module.id}
                                        href={moduleUrl}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        <Box className="w-4 h-4" />
                                        {module.name}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Navbar */}
                <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-4 ml-auto">
                        <Link href={route('architect.projects.index')} className="text-xs text-muted-foreground hover:text-primary">
                            Back to Architect
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.name}`} alt={auth.user.name} />
                                        <AvatarFallback>{auth.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{auth.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {auth.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route('logout')} method="post" as="button" className="w-full flex items-center">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
