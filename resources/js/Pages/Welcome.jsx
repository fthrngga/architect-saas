import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Box, Code2, Rocket, Settings2, Github, ChevronRight } from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
            <Head title="Architect SaaS" />

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Box className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-bold text-xl tracking-tight">Architect</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            {auth.user ? (
                                <Link href={route('architect.projects.index')}>
                                    <Button variant="default">Go to Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button variant="ghost" className="font-medium">Sign in</Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main>
                <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-500/20">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
                            Now in public beta
                        </div>

                        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-300 dark:to-white">
                            Build Applications <br />
                            <span className="text-indigo-600 dark:text-indigo-400">At Light Speed.</span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                            Architect is a powerful visual builder that transforms your ideas into production-ready Laravel and React source code. No lock-in, just pure velocity.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            {auth.user ? (
                                <Link href={route('architect.projects.index')}>
                                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25">
                                        Open Architect
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={route('register')}>
                                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25">
                                        Start Building for Free
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            )}
                            <a href="https://github.com" target="_blank" rel="noreferrer">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <Github className="w-5 h-5 mr-2" />
                                    View Source
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to ship faster</h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                                Stop writing boilerplate. Start building what matters.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-6">
                                    <Box className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Visual Data Modeling</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Define your database schema, relationships, and validations through an intuitive graphical interface.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 mb-6">
                                    <Code2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Clean Code Generation</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Generates clean, standardized Laravel Controllers, Models, Requests, and React Frontend Components.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-6">
                                    <Rocket className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">1-Click Export</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Export your entire project as a standalone, production-ready source code repository instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold">
                        <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span>Architect SaaS</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} Architect. All rights reserved. Laravel v{laravelVersion} (PHP v{phpVersion})
                    </div>
                </div>
            </footer>
        </div>
    );
}
