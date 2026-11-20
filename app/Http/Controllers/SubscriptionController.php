<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $payments = $user->subscriptionPayments()->latest()->get();

        return Inertia::render('Billing/Index', [
            'tier' => $user->getEffectiveTier(),
            'tier_expires_at' => $user->tier_expires_at?->toIso8601String(),
            'lifetime_projects_count' => $user->lifetime_projects_count,
            'lifetime_exports_count' => $user->lifetime_exports_count,
            'active_projects_count' => $user->projects()->count(),
            'payments' => $payments,
        ]);
    }

    public function createInvoice(Request $request)
    {
        $validated = $request->validate([
            'tier' => 'required|in:pro,agency',
        ]);

        $user = $request->user();

        // Check if user already has an active pending invoice for this tier
        $existing = SubscriptionPayment::where('user_id', $user->id)
            ->where('tier', $validated['tier'])
            ->where('status', 'pending')
            ->latest()
            ->first();

        if ($existing) {
            return redirect()->route('billing.index')->with('success', 'Silakan selesaikan pembayaran untuk tagihan yang masih aktif.');
        }

        $baseAmount = $validated['tier'] === 'pro' ? 49000 : 199000;
        $uniqueCode = rand(101, 899);
        $totalAmount = $baseAmount + $uniqueCode;

        $payment = SubscriptionPayment::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'invoice_number' => 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(6)),
            'tier' => $validated['tier'],
            'base_amount' => $baseAmount,
            'unique_code' => $uniqueCode,
            'total_amount' => $totalAmount,
            'payment_method' => 'qris',
            'status' => 'pending',
        ]);

        return redirect()->route('billing.index')->with('success', 'Tagihan berhasil dibuat. Silakan transfer tepat hingga 3 digit terakhir.');
    }

    public function uploadProof(Request $request, SubscriptionPayment $payment)
    {
        if ($payment->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'proof_image' => 'required|image|max:5120', // max 5MB
            'notes' => 'nullable|string|max:500',
        ]);

        if ($request->hasFile('proof_image')) {
            $path = $request->file('proof_image')->store('payment_proofs', 'public');
            $payment->update([
                'proof_image' => '/storage/' . $path,
                'notes' => $validated['notes'] ?? $payment->notes,
            ]);
        }

        return redirect()->route('billing.index')->with('success', 'Bukti pembayaran berhasil diunggah! Super Admin akan segera memverifikasinya.');
    }
}
