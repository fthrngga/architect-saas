import React, { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout
            title="SIGN IN TO STUDIO"
            subtitle="Access your visual database architectures & code repositories"
        >
            <Head title="Sign In - Architect SaaS" />

            {status && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-mono">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
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
                            placeholder="architect@domain.com"
                            className="w-full rounded-xl bg-slate-50 border border-[#101c36]/20 pl-10 pr-3.5 py-2.5 text-sm text-[#101c36] placeholder:text-slate-400 focus:outline-none focus:border-[#101c36] focus:ring-1 focus:ring-[#101c36] transition-all"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-rose-600 font-medium mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                        <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#101c36]" htmlFor="password">
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-[#c2410c] hover:underline font-semibold"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
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
                            autoComplete="current-password"
                            required
                            placeholder="••••••••••••"
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

                {/* Remember Session */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 rounded border-[#101c36]/30 text-[#101c36] focus:ring-[#101c36]"
                        />
                        <span className="text-xs text-[#475569]">Remember this device</span>
                    </label>
                </div>

                {/* Submit Action */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#101c36] hover:bg-[#1a2d52] active:bg-[#0e172a] py-3 text-sm font-mono font-bold uppercase tracking-wider text-[#f5f2eb] shadow-lg shadow-[#101c36]/20 transition-all disabled:opacity-50 mt-2 active:scale-98"
                    data-cursor-label="SIGN IN"
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Authenticating...</span>
                        </>
                    ) : (
                        <>
                            <span>Enter Studio Workspace</span>
                            <ArrowRight className="w-4 h-4 text-[#f97316]" />
                        </>
                    )}
                </button>

                {/* Divider to Register */}
                <div className="pt-3 border-t border-[#101c36]/10 text-center text-xs text-[#64748b]">
                    <span>Don't have a workspace? </span>
                    <Link
                        href={route('register')}
                        className="text-[#c2410c] hover:underline font-bold"
                    >
                        Create your workspace free
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
