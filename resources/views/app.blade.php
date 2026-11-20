<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Architect SaaS') }}</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">

        <!-- Google Fonts: Bebas Neue (Architectural Poster), Newsreader (Editorial Serif), Caveat (Handwritten Blueprint Notes), Plus Jakarta Sans, JetBrains Mono -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Caveat:wght@600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400;1,6..72,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @php
            $component = $page['component'] ?? null;
            $pageFile = null;
            if ($component) {
                if (file_exists(resource_path("js/Pages/{$component}.tsx"))) {
                    $pageFile = "resources/js/Pages/{$component}.tsx";
                } elseif (file_exists(resource_path("js/Pages/{$component}.jsx"))) {
                    $pageFile = "resources/js/Pages/{$component}.jsx";
                }
            }
        @endphp
        @vite(array_filter(['resources/js/app.jsx', $pageFile]))
        @inertiaHead
    </head>
    <body class="antialiased bg-[#07090e] text-[#f1f5f9]">
        @inertia
    </body>
</html>
