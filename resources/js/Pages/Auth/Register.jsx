import React, { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, Check } from 'lucide-react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            title="CREATE WORKSPACE"
            subtitle="Start drafting full-stack Laravel & React architectures free"
        >
            <Head title="Create Workspace - Architect SaaS" />

            <form onSubmit={submit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#101c36]" htmlFor="name">
                        Full Name / Organization
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User className="h-4 w-4" />
                        </div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoComplete="name"
                            required
                            placeholder="Alex Morgan"
                            className="w-full rounded-xl bg-slate-50 border border-[#101c36]/20 pl-10 pr-3.5 py-2.5 text-sm text-[#101c36] placeholder:text-slate-400 focus:outline-none focus:border-[#101c36] focus:ring-1 focus:ring-[#101c36] transition-all"
                        />
                    </div>
                    {errors.name && (
                        <p className="text-xs text-rose-600 font-medium mt-1">{errors.name}</p>
                    )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#101c36]" htmlFor="email">
                        Work Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="h-4 w-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="username"
                            required
                            placeholder="alex@domain.com"
                            className="w-full rounded-xl bg-slate-50 border border-[#101c36]/20 pl-10 pr-3.5 py-2.5 text-sm text-[#101c36] placeholder:text-slate-400 focus:outline-none focus:border-[#101c36] focus:ring-1 focus:ring-[#101c36] transition-all"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-rose-600 font-medium mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#101c36]" htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="h-4 w-4" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                            required
                            placeholder="Minimum 8 characters"
                            className="w-full rounded-xl bg-slate-50 border border-[#101c36]/20 pl-10 pr-10 py-2.5 text-sm text-[#101c36] placeholder:text-slate-400 focus:outline-none focus:border-[#101c36] focus:ring-1 focus:ring-[#101c36] transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-rose-600 font-medium mt-1">{errors.password}</p>
                    )}
                </div>

                {/* Password Confirmation */}
                <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#101c36]" htmlFor="password_confirmation">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="h-4 w-4" />
                        </div>
                        <input
                            id="password_confirmation"
                            type={showPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                            required
                            placeholder="Repeat your password"
                            className="w-full rounded-xl bg-slate-50 border border-[#101c36]/20 pl-10 pr-3.5 py-2.5 text-sm text-[#101c36] placeholder:text-slate-400 focus:outline-none focus:border-[#101c36] focus:ring-1 focus:ring-[#101c36] transition-all"
                        />
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-xs text-rose-600 font-medium mt-1">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Workspace Guarantee info */}
                <div className="p-3 rounded-xl bg-[#101c36]/5 border border-[#101c36]/10 flex items-center gap-2.5 text-xs text-[#475569]">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free workspace with automatic row-level tenant isolation.</span>
                </div>

                {/* Submit Action */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#101c36] hover:bg-[#1a2d52] active:bg-[#0e172a] py-3 text-sm font-mono font-bold uppercase tracking-wider text-[#f5f2eb] shadow-lg shadow-[#101c36]/20 transition-all disabled:opacity-50 mt-2 active:scale-98"
                    data-cursor-label="REGISTER"
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Creating Workspace...</span>
                        </>
                    ) : (
                        <>
                            <span>Initialize Free Workspace</span>
                            <ArrowRight className="w-4 h-4 text-[#f97316]" />
                        </>
                    )}
                </button>

                {/* Divider to Login */}
                <div className="pt-3 border-t border-[#101c36]/10 text-center text-xs text-[#64748b]">
                    <span>Already have a workspace? </span>
                    <Link
                        href={route('login')}
                        className="text-[#c2410c] hover:underline font-bold"
                    >
                        Sign In here
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
