<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'handle' => $user->handle,
                    'role' => $user->role,
                    'is_admin' => $user->isSuperAdmin(),
                    'tier' => $user->getEffectiveTier(),
                    'tier_expires_at' => $user->tier_expires_at?->toIso8601String(),
                    'lifetime_projects_count' => $user->lifetime_projects_count,
                    'lifetime_exports_count' => $user->lifetime_exports_count,
                    'can_create_project' => $user->canCreateProject(),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'tier_limit' => fn () => $request->session()->get('tier_limit') ?? $request->session()->get('errors')?->first('tier_limit'),
            ],
        ];
    }
}
