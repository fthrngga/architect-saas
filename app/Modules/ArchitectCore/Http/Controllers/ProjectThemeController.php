<?php

namespace App\Modules\ArchitectCore\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ArchitectCore\Models\Project;
use App\Modules\ArchitectCore\Services\ThemeRegistry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProjectThemeController extends Controller
{
    /**
     * Get all themes and active project theme
     */
    public function index(Project $project)
    {
        $allThemes = ThemeRegistry::all();
        $settings = $project->settings ?? [];
        $activeTheme = $settings['theme'] ?? ThemeRegistry::find('amber-minimal');

        return response()->json([
            'themes' => $allThemes,
            'active_theme' => $activeTheme,
        ]);
    }

    /**
     * Save theme selection or custom overrides
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'theme_id' => 'nullable|string',
            'radius' => 'nullable|string',
            'custom_css' => 'nullable|string',
            'custom_url' => 'nullable|string',
        ]);

        $settings = $project->settings ?? [];
        $theme = null;

        // 1. Direct CSS paste from tweakcn
        if (!empty($validated['custom_css'])) {
            $theme = ThemeRegistry::parseTweakcnCss($validated['custom_css']);
        }
        // 2. Remote URL or registry command import (e.g. npx shadcn@latest add https://tweakcn.com/r/themes/doom-64.json)
        elseif (!empty($validated['custom_url'])) {
            $input = trim($validated['custom_url']);
            $targetUrl = null;

            // Check if user pasted a CLI command like "npx shadcn@latest add https://tweakcn.com/r/themes/doom-64.json"
            if (preg_match('/https?:\/\/[^\s\'"]+/i', $input, $urlMatch)) {
                $targetUrl = $urlMatch[0];
            } elseif (str_starts_with($input, 'http://') || str_starts_with($input, 'https://')) {
                $targetUrl = $input;
            } else {
                // User just typed the slug, e.g. "doom-64" or "catppuccin"
                $cleanSlug = strtolower(preg_replace('/[^a-zA-Z0-9\-_]+/', '', $input));
                $targetUrl = "https://tweakcn.com/r/themes/{$cleanSlug}.json";
            }

            try {
                $response = Http::timeout(8)->get($targetUrl);
                if ($response->successful()) {
                    $json = $response->json();
                    if (is_array($json) && (isset($json['cssVars']) || isset($json['name']))) {
                        $theme = ThemeRegistry::parseTweakcnJson($json);
                    } else {
                        // Might be raw CSS response
                        $body = $response->body();
                        if (str_contains($body, ':root')) {
                            $theme = ThemeRegistry::parseTweakcnCss($body);
                        }
                    }
                }
            } catch (\Exception $e) {
                // If remote fetch fails, log or ignore
            }
        }

        // 3. Fallback to preset from registry
        if (!$theme && !empty($validated['theme_id'])) {
            $theme = ThemeRegistry::find($validated['theme_id']);
        }

        // 4. Ultimate fallback
        if (!$theme) {
            $theme = ThemeRegistry::find('default-slate');
        }

        // Apply radius override if provided
        if (!empty($validated['radius'])) {
            $theme['radius'] = $validated['radius'];
            $theme['light']['--radius'] = $validated['radius'];
            $theme['dark']['--radius'] = $validated['radius'];
        }

        $settings['theme'] = $theme;
        $project->update(['settings' => $settings]);

        return response()->json([
            'success' => true,
            'message' => 'Tema UI proyek berhasil diperbarui.',
            'theme' => $theme,
        ]);
    }
}
