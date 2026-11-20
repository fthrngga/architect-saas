<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPayment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');

        $query = SubscriptionPayment::with(['user', 'approver'])->latest();
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $payments = $query->paginate(20);

        $stats = [
            'pending_count' => SubscriptionPayment::where('status', 'pending')->count(),
            'approved_count' => SubscriptionPayment::where('status', 'approved')->count(),
            'total_users' => User::count(),
            'pro_users' => User::where('tier', 'pro')->count(),
            'agency_users' => User::where('tier', 'agency')->count(),
        ];

        $users = User::latest()->paginate(15, ['*'], 'users_page');

        return Inertia::render('Admin/Subscriptions/Index', [
            'payments' => $payments,
            'stats' => $stats,
            'users' => $users,
            'currentStatus' => $status,
        ]);
    }

    public function approve(Request $request, SubscriptionPayment $payment)
    {
        $user = $payment->user;
        if (!$user) {
            return back()->withErrors(['message' => 'User pemilik tagihan tidak ditemukan.']);
        }

        // Add 30 days of subscription from now or extend existing active subscription
        $currentExpiry = $user->tier_expires_at && $user->tier_expires_at->isFuture()
            ? $user->tier_expires_at
            : now();

        $newExpiry = $currentExpiry->copy()->addDays(30);

        $user->update([
            'tier' => $payment->tier,
            'tier_expires_at' => $newExpiry,
        ]);

        $payment->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
            'admin_notes' => $request->input('admin_notes', 'Disetujui oleh Super Admin'),
        ]);

        return back()->with('success', "Pembayaran disetujui! Akun {$user->name} resmi ditingkatkan ke tier {$payment->tier} hingga {$newExpiry->format('d M Y')}.");
    }

    public function reject(Request $request, SubscriptionPayment $payment)
    {
        $validated = $request->validate([
            'admin_notes' => 'required|string|max:500',
        ]);

        $payment->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'],
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        return back()->with('success', 'Pembayaran telah ditolak dengan catatan yang diberikan.');
    }

    public function updateUserTier(Request $request, User $user)
    {
        $validated = $request->validate([
            'tier' => 'required|in:free,pro,agency',
            'role' => 'required|in:user,superadmin',
            'add_days' => 'nullable|integer|min:0|max:3650',
        ]);

        $tierExpiresAt = $user->tier_expires_at;
        if (!empty($validated['add_days']) && $validated['add_days'] > 0) {
            $base = ($tierExpiresAt && $tierExpiresAt->isFuture()) ? $tierExpiresAt : now();
            $tierExpiresAt = $base->copy()->addDays($validated['add_days']);
        }

        if ($validated['tier'] === 'free') {
            $tierExpiresAt = null;
        }

        $user->update([
            'tier' => $validated['tier'],
            'role' => $validated['role'],
            'tier_expires_at' => $tierExpiresAt,
        ]);

        return back()->with('success', "Profil dan tier user {$user->name} berhasil diperbarui.");
    }
}
