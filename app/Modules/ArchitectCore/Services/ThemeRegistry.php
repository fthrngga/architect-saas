<?php

namespace App\Modules\ArchitectCore\Services;

class ThemeRegistry
{
    /**
     * Curated list of tweakcn / shadcn themes ready for visual selection
     */
    public static function all(): array
    {
        return [
            [
                'id' => 'default-slate',
                'name' => 'Default Slate',
                'description' => 'Gaya monokrom bersih khas Shadcn UI standar.',
                'fontSans' => 'Plus Jakarta Sans',
                'googleFontUrl' => 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
                'radius' => '0.5rem',
                'swatches' => ['#ffffff', '#0f172a', '#0f172a', '#f1f5f9'],
                'light' => [
                    '--background' => '0 0% 100%',
                    '--foreground' => '222.2 84% 4.9%',
                    '--card' => '0 0% 100%',
                    '--card-foreground' => '222.2 84% 4.9%',
                    '--popover' => '0 0% 100%',
                    '--popover-foreground' => '222.2 84% 4.9%',
                    '--primary' => '222.2 47.4% 11.2%',
                    '--primary-foreground' => '210 40% 98%',
                    '--secondary' => '210 40% 96.1%',
                    '--secondary-foreground' => '222.2 47.4% 11.2%',
                    '--muted' => '210 40% 96.1%',
                    '--muted-foreground' => '215.4 16.3% 46.9%',
                    '--accent' => '210 40% 96.1%',
                    '--accent-foreground' => '222.2 47.4% 11.2%',
                    '--destructive' => '0 84.2% 60.2%',
                    '--destructive-foreground' => '210 40% 98%',
                    '--border' => '214.3 31.8% 91.4%',
                    '--input' => '214.3 31.8% 91.4%',
                    '--ring' => '222.2 84% 4.9%',
                    '--radius' => '0.5rem',
                ],
                'dark' => [
                    '--background' => '222.2 84% 4.9%',
                    '--foreground' => '210 40% 98%',
                    '--card' => '222.2 84% 4.9%',
                    '--card-foreground' => '210 40% 98%',
                    '--popover' => '222.2 84% 4.9%',
                    '--popover-foreground' => '210 40% 98%',
                    '--primary' => '210 40% 98%',
                    '--primary-foreground' => '222.2 47.4% 11.2%',
                    '--secondary' => '217.2 32.6% 17.5%',
                    '--secondary-foreground' => '210 40% 98%',
                    '--muted' => '217.2 32.6% 17.5%',
                    '--muted-foreground' => '215 20.2% 65.1%',
                    '--accent' => '217.2 32.6% 17.5%',
                    '--accent-foreground' => '210 40% 98%',
                    '--destructive' => '0 62.8% 30.6%',
                    '--destructive-foreground' => '210 40% 98%',
                    '--border' => '217.2 32.6% 17.5%',
                    '--input' => '217.2 32.6% 17.5%',
                    '--ring' => '212.7 26.8% 83.9%',
                    '--radius' => '0.5rem',
                ]
            ],
            [
                'id' => 'amber-minimal',
                'name' => 'Amber Minimal',
                'description' => 'Aksen oranye amber hangat di atas latar kertas editorial.',
                'fontSans' => 'Plus Jakarta Sans',
                'googleFontUrl' => 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
                'radius' => '0.625rem',
                'swatches' => ['#fefcf6', '#d97706', '#1c1917', '#fef3c7'],
                'light' => [
                    '--background' => '40 50% 98%',
                    '--foreground' => '24 10% 10%',
                    '--card' => '0 0% 100%',
                    '--card-foreground' => '24 10% 10%',
                    '--popover' => '0 0% 100%',
                    '--popover-foreground' => '24 10% 10%',
                    '--primary' => '38 92% 50%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '38 40% 93%',
                    '--secondary-foreground' => '24 10% 10%',
                    '--muted' => '38 25% 95%',
                    '--muted-foreground' => '24 8% 45%',
                    '--accent' => '38 92% 50%',
                    '--accent-foreground' => '0 0% 100%',
                    '--destructive' => '0 84% 60%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '38 25% 88%',
                    '--input' => '38 25% 88%',
                    '--ring' => '38 92% 50%',
                    '--radius' => '0.625rem',
                ],
                'dark' => [
                    '--background' => '20 14% 6%',
                    '--foreground' => '40 20% 95%',
                    '--card' => '20 14% 9%',
                    '--card-foreground' => '40 20% 95%',
                    '--popover' => '20 14% 9%',
                    '--popover-foreground' => '40 20% 95%',
                    '--primary' => '38 92% 50%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '20 14% 15%',
                    '--secondary-foreground' => '40 20% 95%',
                    '--muted' => '20 14% 14%',
                    '--muted-foreground' => '24 8% 65%',
                    '--accent' => '38 92% 50%',
                    '--accent-foreground' => '0 0% 100%',
                    '--destructive' => '0 70% 50%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '20 14% 18%',
                    '--input' => '20 14% 18%',
                    '--ring' => '38 92% 50%',
                    '--radius' => '0.625rem',
                ]
            ],
            [
                'id' => 'supabase-emerald',
                'name' => 'Supabase Emerald',
                'description' => 'Tema developer modern dengan aksen hijau emerald segar.',
                'fontSans' => 'JetBrains Mono',
                'googleFontUrl' => 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
                'radius' => '0.375rem',
                'swatches' => ['#121212', '#10b981', '#1f2937', '#064e3b'],
                'light' => [
                    '--background' => '0 0% 100%',
                    '--foreground' => '160 30% 10%',
                    '--card' => '0 0% 100%',
                    '--card-foreground' => '160 30% 10%',
                    '--popover' => '0 0% 100%',
                    '--popover-foreground' => '160 30% 10%',
                    '--primary' => '160 84% 39%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '160 30% 95%',
                    '--secondary-foreground' => '160 84% 25%',
                    '--muted' => '160 20% 96%',
                    '--muted-foreground' => '160 10% 45%',
                    '--accent' => '160 84% 39%',
                    '--accent-foreground' => '0 0% 100%',
                    '--destructive' => '0 84% 60%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '160 20% 90%',
                    '--input' => '160 20% 90%',
                    '--ring' => '160 84% 39%',
                    '--radius' => '0.375rem',
                ],
                'dark' => [
                    '--background' => '0 0% 7%',
                    '--foreground' => '160 20% 95%',
                    '--card' => '0 0% 10%',
                    '--card-foreground' => '160 20% 95%',
                    '--popover' => '0 0% 10%',
                    '--popover-foreground' => '160 20% 95%',
                    '--primary' => '160 84% 39%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '160 20% 14%',
                    '--secondary-foreground' => '160 84% 65%',
                    '--muted' => '0 0% 14%',
                    '--muted-foreground' => '160 10% 60%',
                    '--accent' => '160 84% 39%',
                    '--accent-foreground' => '0 0% 100%',
                    '--destructive' => '0 65% 50%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '0 0% 18%',
                    '--input' => '0 0% 18%',
                    '--ring' => '160 84% 39%',
                    '--radius' => '0.375rem',
                ]
            ],
            [
                'id' => 'catppuccin',
                'name' => 'Catppuccin Mocha',
                'description' => 'Palet pastel nyaman dan menyejukkan mata ala Catppuccin.',
                'fontSans' => 'Plus Jakarta Sans',
                'googleFontUrl' => 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
                'radius' => '0.75rem',
                'swatches' => ['#1e1e2e', '#cba6f7', '#89b4fa', '#313244'],
                'light' => [
                    '--background' => '230 45% 98%',
                    '--foreground' => '235 25% 20%',
                    '--card' => '0 0% 100%',
                    '--card-foreground' => '235 25% 20%',
                    '--popover' => '0 0% 100%',
                    '--popover-foreground' => '235 25% 20%',
                    '--primary' => '267 84% 81%',
                    '--primary-foreground' => '235 25% 20%',
                    '--secondary' => '220 70% 94%',
                    '--secondary-foreground' => '235 25% 20%',
                    '--muted' => '225 30% 94%',
                    '--muted-foreground' => '235 15% 50%',
                    '--accent' => '217 92% 76%',
                    '--accent-foreground' => '235 25% 20%',
                    '--destructive' => '343 81% 75%',
                    '--destructive-foreground' => '235 25% 20%',
                    '--border' => '225 30% 88%',
                    '--input' => '225 30% 88%',
                    '--ring' => '267 84% 81%',
                    '--radius' => '0.75rem',
                ],
                'dark' => [
                    '--background' => '240 21% 15%',
                    '--foreground' => '226 64% 88%',
                    '--card' => '240 21% 19%',
                    '--card-foreground' => '226 64% 88%',
                    '--popover' => '240 21% 19%',
                    '--popover-foreground' => '226 64% 88%',
                    '--primary' => '267 84% 81%',
                    '--primary-foreground' => '240 21% 15%',
                    '--secondary' => '237 16% 23%',
                    '--secondary-foreground' => '226 64% 88%',
                    '--muted' => '237 16% 23%',
                    '--muted-foreground' => '228 24% 72%',
                    '--accent' => '217 92% 76%',
                    '--accent-foreground' => '240 21% 15%',
                    '--destructive' => '343 81% 75%',
                    '--destructive-foreground' => '240 21% 15%',
                    '--border' => '237 16% 23%',
                    '--input' => '237 16% 23%',
                    '--ring' => '267 84% 81%',
                    '--radius' => '0.75rem',
                ]
            ],
            [
                'id' => 'doom-64',
                'name' => 'Doom 64',
                'description' => 'Gaya brutalist game retro dengan aksen merah bata dan font Oxanium.',
                'fontSans' => 'Oxanium',
                'googleFontUrl' => 'https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&display=swap',
                'radius' => '0px',
                'swatches' => ['#d7d7d7', '#b71c1c', '#2c2c2c', '#8b0000'],
                'light' => [
                    '--background' => '180 0% 84%',
                    '--foreground' => '0 0% 24%',
                    '--card' => '180 0% 76%',
                    '--card-foreground' => '0 0% 24%',
                    '--popover' => '180 0% 76%',
                    '--popover-foreground' => '0 0% 24%',
                    '--primary' => '360 73% 41%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '84 32% 43%',
                    '--secondary-foreground' => '0 0% 100%',
                    '--muted' => '0 0% 78%',
                    '--muted-foreground' => '0 0% 41%',
                    '--accent' => '216 35% 53%',
                    '--accent-foreground' => '0 0% 100%',
                    '--destructive' => '15 75% 58%',
                    '--destructive-foreground' => '0 0% 0%',
                    '--border' => '0 0% 43%',
                    '--input' => '0 0% 43%',
                    '--ring' => '360 73% 41%',
                    '--radius' => '0px',
                ],
                'dark' => [
                    '--background' => '0 0% 22%',
                    '--foreground' => '0 0% 91%',
                    '--card' => '0 0% 28%',
                    '--card-foreground' => '0 0% 91%',
                    '--popover' => '0 0% 28%',
                    '--popover-foreground' => '0 0% 91%',
                    '--primary' => '360 75% 55%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '94 45% 58%',
                    '--secondary-foreground' => '0 0% 0%',
                    '--muted' => '0 0% 26%',
                    '--muted-foreground' => '0 0% 71%',
                    '--accent' => '216 55% 68%',
                    '--accent-foreground' => '0 0% 0%',
                    '--destructive' => '15 80% 65%',
                    '--destructive-foreground' => '0 0% 0%',
                    '--border' => '0 0% 41%',
                    '--input' => '0 0% 41%',
                    '--ring' => '360 75% 55%',
                    '--radius' => '0px',
                ]
            ],
            [
                'id' => 'midnight-tokyo',
                'name' => 'Midnight Tokyo',
                'description' => 'Cyberpunk neon biru gelap malam kota metropolitan.',
                'fontSans' => 'Plus Jakarta Sans',
                'googleFontUrl' => 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
                'radius' => '0.5rem',
                'swatches' => ['#0a0f1d', '#38bdf8', '#1e293b', '#0284c7'],
                'light' => [
                    '--background' => '215 50% 98%',
                    '--foreground' => '222 47% 11%',
                    '--card' => '0 0% 100%',
                    '--card-foreground' => '222 47% 11%',
                    '--popover' => '0 0% 100%',
                    '--popover-foreground' => '222 47% 11%',
                    '--primary' => '199 89% 48%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '215 40% 93%',
                    '--secondary-foreground' => '222 47% 11%',
                    '--muted' => '215 30% 94%',
                    '--muted-foreground' => '215 20% 50%',
                    '--accent' => '199 89% 48%',
                    '--accent-foreground' => '0 0% 100%',
                    '--destructive' => '0 84% 60%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '215 30% 88%',
                    '--input' => '215 30% 88%',
                    '--ring' => '199 89% 48%',
                    '--radius' => '0.5rem',
                ],
                'dark' => [
                    '--background' => '224 71% 4%',
                    '--foreground' => '213 31% 91%',
                    '--card' => '224 71% 7%',
                    '--card-foreground' => '213 31% 91%',
                    '--popover' => '224 71% 7%',
                    '--popover-foreground' => '213 31% 91%',
                    '--primary' => '199 89% 48%',
                    '--primary-foreground' => '224 71% 4%',
                    '--secondary' => '222 47% 14%',
                    '--secondary-foreground' => '213 31% 91%',
                    '--muted' => '222 47% 11%',
                    '--muted-foreground' => '215 20% 65%',
                    '--accent' => '199 89% 48%',
                    '--accent-foreground' => '224 71% 4%',
                    '--destructive' => '0 62% 45%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '216 34% 17%',
                    '--input' => '216 34% 17%',
                    '--ring' => '199 89% 48%',
                    '--radius' => '0.5rem',
                ]
            ],
            [
                'id' => 'claude-terracotta',
                'name' => 'Claude Terracotta',
                'description' => 'Warna tanah liat terracotta hangat khas persona Claude.',
                'fontSans' => 'Plus Jakarta Sans',
                'googleFontUrl' => 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
                'radius' => '0.5rem',
                'swatches' => ['#faf8f5', '#d97706', '#262624', '#f5ebd9'],
                'light' => [
                    '--background' => '36 40% 97%',
                    '--foreground' => '30 10% 15%',
                    '--card' => '0 0% 100%',
                    '--card-foreground' => '30 10% 15%',
                    '--popover' => '0 0% 100%',
                    '--popover-foreground' => '30 10% 15%',
                    '--primary' => '24 95% 53%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '36 30% 92%',
                    '--secondary-foreground' => '30 10% 15%',
                    '--muted' => '36 20% 94%',
                    '--muted-foreground' => '30 8% 45%',
                    '--accent' => '24 95% 53%',
                    '--accent-foreground' => '0 0% 100%',
                    '--destructive' => '0 84% 60%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '36 25% 86%',
                    '--input' => '36 25% 86%',
                    '--ring' => '24 95% 53%',
                    '--radius' => '0.5rem',
                ],
                'dark' => [
                    '--background' => '30 12% 10%',
                    '--foreground' => '36 30% 92%',
                    '--card' => '30 12% 14%',
                    '--card-foreground' => '36 30% 92%',
                    '--popover' => '30 12% 14%',
                    '--popover-foreground' => '36 30% 92%',
                    '--primary' => '24 95% 53%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '30 12% 20%',
                    '--secondary-foreground' => '36 30% 92%',
                    '--muted' => '30 12% 18%',
                    '--muted-foreground' => '36 15% 65%',
                    '--accent' => '24 95% 53%',
                    '--accent-foreground' => '0 0% 100%',
                    '--destructive' => '0 65% 50%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '30 12% 22%',
                    '--input' => '30 12% 22%',
                    '--ring' => '24 95% 53%',
                    '--radius' => '0.5rem',
                ]
            ],
            [
                'id' => 'clean-slate',
                'name' => 'Clean Slate',
                'description' => 'Monokrom profesional netral, cocok untuk dashboard korporat.',
                'fontSans' => 'Plus Jakarta Sans',
                'googleFontUrl' => 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
                'radius' => '0.375rem',
                'swatches' => ['#f8fafc', '#475569', '#0f172a', '#e2e8f0'],
                'light' => [
                    '--background' => '210 40% 98%',
                    '--foreground' => '222.2 47.4% 11.2%',
                    '--card' => '0 0% 100%',
                    '--card-foreground' => '222.2 47.4% 11.2%',
                    '--popover' => '0 0% 100%',
                    '--popover-foreground' => '222.2 47.4% 11.2%',
                    '--primary' => '215 16% 47%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '210 40% 94%',
                    '--secondary-foreground' => '222.2 47.4% 11.2%',
                    '--muted' => '210 40% 94%',
                    '--muted-foreground' => '215 16% 47%',
                    '--accent' => '215 16% 47%',
                    '--accent-foreground' => '0 0% 100%',
                    '--destructive' => '0 84% 60%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '214.3 31.8% 88%',
                    '--input' => '214.3 31.8% 88%',
                    '--ring' => '215 16% 47%',
                    '--radius' => '0.375rem',
                ],
                'dark' => [
                    '--background' => '222.2 84% 4.9%',
                    '--foreground' => '210 40% 98%',
                    '--card' => '222.2 84% 7%',
                    '--card-foreground' => '210 40% 98%',
                    '--popover' => '222.2 84% 7%',
                    '--popover-foreground' => '210 40% 98%',
                    '--primary' => '210 40% 98%',
                    '--primary-foreground' => '222.2 47.4% 11.2%',
                    '--secondary' => '217.2 32.6% 17.5%',
                    '--secondary-foreground' => '210 40% 98%',
                    '--muted' => '217.2 32.6% 17.5%',
                    '--muted-foreground' => '215 20.2% 65.1%',
                    '--accent' => '210 40% 98%',
                    '--accent-foreground' => '222.2 47.4% 11.2%',
                    '--destructive' => '0 62.8% 30.6%',
                    '--destructive-foreground' => '210 40% 98%',
                    '--border' => '217.2 32.6% 17.5%',
                    '--input' => '217.2 32.6% 17.5%',
                    '--ring' => '212.7 26.8% 83.9%',
                    '--radius' => '0.375rem',
                ]
            ],
            [
                'id' => 'amethyst-haze',
                'name' => 'Amethyst Haze',
                'description' => 'Aura ungu lavender anggun dengan kontras tinggi yang menawan.',
                'fontSans' => 'Plus Jakarta Sans',
                'googleFontUrl' => 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
                'radius' => '0.5rem',
                'swatches' => ['#faf5ff', '#9333ea', '#1e1b4b', '#f3e8ff'],
                'light' => [
                    '--background' => '270 50% 98%',
                    '--foreground' => '275 35% 15%',
                    '--card' => '0 0% 100%',
                    '--card-foreground' => '275 35% 15%',
                    '--popover' => '0 0% 100%',
                    '--popover-foreground' => '275 35% 15%',
                    '--primary' => '272 72% 47%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '270 40% 94%',
                    '--secondary-foreground' => '275 35% 15%',
                    '--muted' => '270 25% 95%',
                    '--muted-foreground' => '270 15% 45%',
                    '--accent' => '272 72% 47%',
                    '--accent-foreground' => '0 0% 100%',
                    '--destructive' => '0 84% 60%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '270 25% 88%',
                    '--input' => '270 25% 88%',
                    '--ring' => '272 72% 47%',
                    '--radius' => '0.5rem',
                ],
                'dark' => [
                    '--background' => '270 45% 6%',
                    '--foreground' => '270 20% 95%',
                    '--card' => '270 45% 9%',
                    '--card-foreground' => '270 20% 95%',
                    '--popover' => '270 45% 9%',
                    '--popover-foreground' => '270 20% 95%',
                    '--primary' => '272 72% 57%',
                    '--primary-foreground' => '0 0% 100%',
                    '--secondary' => '270 30% 15%',
                    '--secondary-foreground' => '270 20% 95%',
                    '--muted' => '270 25% 14%',
                    '--muted-foreground' => '270 15% 65%',
                    '--accent' => '272 72% 57%',
                    '--accent-foreground' => '0 0% 100%',
                    '--destructive' => '0 70% 50%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '270 25% 18%',
                    '--input' => '270 25% 18%',
                    '--ring' => '272 72% 57%',
                    '--radius' => '0.5rem',
                ]
            ],
            [
                'id' => 'cyberpunk-neon',
                'name' => 'Cyberpunk Neon',
                'description' => 'Kontras tinggi hitam pekat dengan aksen cyan dan neon yellow elektrik.',
                'fontSans' => 'JetBrains Mono',
                'googleFontUrl' => 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
                'radius' => '0.25rem',
                'swatches' => ['#0d0d0d', '#00f0ff', '#ffe600', '#1f1f1f'],
                'light' => [
                    '--background' => '0 0% 98%',
                    '--foreground' => '0 0% 10%',
                    '--card' => '0 0% 100%',
                    '--card-foreground' => '0 0% 10%',
                    '--popover' => '0 0% 100%',
                    '--popover-foreground' => '0 0% 10%',
                    '--primary' => '184 100% 45%',
                    '--primary-foreground' => '0 0% 0%',
                    '--secondary' => '54 100% 50%',
                    '--secondary-foreground' => '0 0% 0%',
                    '--muted' => '0 0% 94%',
                    '--muted-foreground' => '0 0% 45%',
                    '--accent' => '184 100% 45%',
                    '--accent-foreground' => '0 0% 0%',
                    '--destructive' => '0 90% 55%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '0 0% 85%',
                    '--input' => '0 0% 85%',
                    '--ring' => '184 100% 45%',
                    '--radius' => '0.25rem',
                ],
                'dark' => [
                    '--background' => '0 0% 5%',
                    '--foreground' => '0 0% 98%',
                    '--card' => '0 0% 8%',
                    '--card-foreground' => '0 0% 98%',
                    '--popover' => '0 0% 8%',
                    '--popover-foreground' => '0 0% 98%',
                    '--primary' => '184 100% 50%',
                    '--primary-foreground' => '0 0% 0%',
                    '--secondary' => '54 100% 50%',
                    '--secondary-foreground' => '0 0% 0%',
                    '--muted' => '0 0% 15%',
                    '--muted-foreground' => '0 0% 65%',
                    '--accent' => '184 100% 50%',
                    '--accent-foreground' => '0 0% 0%',
                    '--destructive' => '0 90% 60%',
                    '--destructive-foreground' => '0 0% 100%',
                    '--border' => '0 0% 20%',
                    '--input' => '0 0% 20%',
                    '--ring' => '184 100% 50%',
                    '--radius' => '0.25rem',
                ]
            ]
        ];
    }

    /**
     * Find theme by id, fallback to default
     */
    public static function find(?string $id): array
    {
        $all = self::all();
        foreach ($all as $theme) {
            if ($theme['id'] === $id) {
                return $theme;
            }
        }
        return $all[0];
    }

    /**
     * Parse registry JSON downloaded from tweakcn.com
     * e.g. https://tweakcn.com/r/themes/doom-64.json
     */
    public static function parseTweakcnJson(array $json): array
    {
        $name = $json['name'] ?? 'Tweakcn Imported';
        $themeVars = $json['cssVars']['theme'] ?? [];
        $lightVars = $json['cssVars']['light'] ?? [];
        $darkVars = $json['cssVars']['dark'] ?? [];

        // Font
        $fontSans = 'Plus Jakarta Sans';
        if (isset($themeVars['font-sans'])) {
            $fontSans = trim(str_replace(['"', "'", 'sans-serif', ','], '', $themeVars['font-sans']));
        }

        // Radius
        $radius = $themeVars['radius'] ?? '0.5rem';

        // Normalize light variables
        $normalizedLight = [];
        foreach ($lightVars as $key => $val) {
            $cssKey = str_starts_with($key, '--') ? $key : "--{$key}";
            $normalizedLight[$cssKey] = self::normalizeColor($val);
        }
        $normalizedLight['--radius'] = $radius;

        // Normalize dark variables
        $normalizedDark = [];
        foreach ($darkVars as $key => $val) {
            $cssKey = str_starts_with($key, '--') ? $key : "--{$key}";
            $normalizedDark[$cssKey] = self::normalizeColor($val);
        }
        $normalizedDark['--radius'] = $radius;

        $id = 'tweakcn-' . strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));

        return [
            'id' => $id,
            'name' => ucwords(str_replace(['-', '_'], ' ', $name)),
            'description' => "Tema kustom dari Tweakcn ({$name})",
            'fontSans' => $fontSans,
            'googleFontUrl' => "https://fonts.googleapis.com/css2?family=" . urlencode($fontSans) . ":wght@400;600;700&display=swap",
            'radius' => $radius,
            'swatches' => [
                '#ffffff',
                '#101c36',
                $normalizedLight['--primary'] ?? '#0f172a',
                $normalizedLight['--secondary'] ?? '#f1f5f9',
            ],
            'light' => $normalizedLight,
            'dark' => !empty($normalizedDark) ? $normalizedDark : $normalizedLight,
            'isCustom' => true,
        ];
    }

    /**
     * Parse CSS variables pasted directly from tweakcn (index.css)
     */
    public static function parseTweakcnCss(string $css): array
    {
        $lightVars = [];
        $darkVars = [];

        // Match :root block
        if (preg_match('/:root\s*\{([^}]+)\}/s', $css, $rootMatch)) {
            $lightVars = self::extractVariables($rootMatch[1]);
        }

        // Match .dark block
        if (preg_match('/\.dark\s*\{([^}]+)\}/s', $css, $darkMatch)) {
            $darkVars = self::extractVariables($darkMatch[1]);
        }

        // Detect font if present
        $fontSans = 'Plus Jakarta Sans';
        if (isset($lightVars['--font-sans'])) {
            $fontSans = trim(str_replace(['"', "'", 'sans-serif', ','], '', $lightVars['--font-sans']));
        }

        // Detect radius
        $radius = $lightVars['--radius'] ?? '0.5rem';

        // Normalize all variables to raw HSL
        $normalizedLight = [];
        foreach ($lightVars as $k => $v) {
            $normalizedLight[$k] = self::normalizeColor($v);
        }

        $normalizedDark = [];
        foreach ($darkVars as $k => $v) {
            $normalizedDark[$k] = self::normalizeColor($v);
        }

        return [
            'id' => 'custom-tweakcn-' . substr(md5($css), 0, 8),
            'name' => 'Custom Tweakcn Theme',
            'description' => 'Tema kustom diimpor langsung dari tweakcn CSS.',
            'fontSans' => $fontSans,
            'googleFontUrl' => "https://fonts.googleapis.com/css2?family=" . urlencode($fontSans) . ":wght@400;600;700&display=swap",
            'radius' => $radius,
            'swatches' => [
                '#ffffff',
                '#101c36',
                $normalizedLight['--primary'] ?? '#0f172a',
                $normalizedLight['--secondary'] ?? '#f1f5f9',
            ],
            'light' => $normalizedLight,
            'dark' => !empty($normalizedDark) ? $normalizedDark : $normalizedLight,
            'isCustom' => true,
            'rawCss' => $css
        ];
    }

    /**
     * Extract key-value CSS variables
     */
    protected static function extractVariables(string $block): array
    {
        $vars = [];
        $lines = explode(';', $block);
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, ':') === false) continue;
            list($key, $val) = explode(':', $line, 2);
            $key = trim($key);
            $val = trim($val);
            if (str_starts_with($key, '--')) {
                $vars[$key] = $val;
            }
        }
        return $vars;
    }

    /**
     * Normalize any color format (OKLCH, HSL, Hex, RGB, raw channels) into raw HSL channels
     * e.g. "210 40% 98%" for flawless compatibility with Tailwind v3's hsl(var(--...)).
     */
    public static function normalizeColor(string $val): string
    {
        $val = trim($val);

        // If it's radius or numeric pixel/rem value, keep as is
        if (preg_match('/^[\d\.]+(?:px|rem|em|%)?$/', $val)) {
            return $val;
        }

        // If it's already raw HSL channels like "210 40% 98%" or "222.2 84% 4.9%"
        if (preg_match('/^[\d\.]+\s+[\d\.]+(?:%|deg)?\s+[\d\.]+%?$/', $val)) {
            return $val;
        }

        // If it's wrapped in hsl(...) or hsla(...)
        if (preg_match('/^hsla?\s*\(\s*([^)]+)\s*\)$/i', $val, $m)) {
            $inner = trim($m[1]);
            $parts = preg_split('/[\s,\/]+/', $inner);
            if (count($parts) >= 3) {
                $h = rtrim($parts[0], 'deg');
                $s = str_ends_with($parts[1], '%') ? $parts[1] : (round((float)$parts[1] * 100, 1)) . '%';
                $l = str_ends_with($parts[2], '%') ? $parts[2] : (round((float)$parts[2] * 100, 1)) . '%';
                return "{$h} {$s} {$l}";
            }
            return $inner;
        }

        // If it's oklch(...) e.g. "oklch(0.5016 0.1887 27.4816)" or "oklch(0.8452 0 0)"
        if (preg_match('/^oklch\s*\(\s*([^)]+)\s*\)$/i', $val, $m)) {
            $parts = preg_split('/[\s,\/]+/', trim($m[1]));
            if (count($parts) >= 3) {
                $L = (float) $parts[0];
                $C = (float) $parts[1];
                $h_deg = (float) rtrim($parts[2], 'deg');
                return self::oklchToHslChannels($L, $C, $h_deg);
            }
        }

        // If it's hex e.g. "#10b981" or "#ffffff"
        if (preg_match('/^#([a-f0-9]{3,8})$/i', $val, $m)) {
            return self::hexToHslChannels($val);
        }

        // If it's rgb(...)
        if (preg_match('/^rgba?\s*\(\s*([^)]+)\s*\)$/i', $val, $m)) {
            $parts = preg_split('/[\s,\/]+/', trim($m[1]));
            if (count($parts) >= 3) {
                $r = (float) $parts[0] / 255.0;
                $g = (float) $parts[1] / 255.0;
                $b = (float) $parts[2] / 255.0;
                return self::srgbToHslChannels($r, $g, $b);
            }
        }

        return $val;
    }

    /**
     * OKLCH to raw HSL channels
     */
    protected static function oklchToHslChannels(float $L, float $C, float $h_deg): string
    {
        $h_rad = deg2rad($h_deg);
        $a = $C * cos($h_rad);
        $b = $C * sin($h_rad);

        $l_ = $L + 0.3963377774 * $a + 0.2158037573 * $b;
        $m_ = $L - 0.1055613458 * $a - 0.0638541728 * $b;
        $s_ = $L - 0.0894841775 * $a - 1.2914855480 * $b;

        $l = pow(max(0.0, $l_), 3);
        $m = pow(max(0.0, $m_), 3);
        $s = pow(max(0.0, $s_), 3);

        $r_lin = +4.0767416621 * $l - 3.3077115913 * $m + 0.2309699292 * $s;
        $g_lin = -1.2684380046 * $l + 2.6097574011 * $m - 0.3413193965 * $s;
        $b_lin = -0.0041960863 * $l - 0.7034186147 * $m + 1.7076147010 * $s;

        $gamma = function ($c) {
            if ($c <= 0.0031308) {
                return max(0.0, min(1.0, 12.92 * $c));
            }
            return max(0.0, min(1.0, 1.055 * pow($c, 1.0 / 2.4) - 0.055));
        };

        $r = $gamma($r_lin);
        $g = $gamma($g_lin);
        $b = $gamma($b_lin);

        return self::srgbToHslChannels($r, $g, $b);
    }

    /**
     * sRGB float (0-1) to raw HSL channels
     */
    protected static function srgbToHslChannels(float $r, float $g, float $b): string
    {
        $max = max($r, $g, $b);
        $min = min($r, $g, $b);
        $delta = $max - $min;

        $lum = ($max + $min) / 2.0;

        if ($delta == 0.0) {
            $hue = 0.0;
            $sat = 0.0;
        } else {
            $sat = $lum > 0.5 ? $delta / (2.0 - $max - $min) : $delta / ($max + $min);
            if ($max == $r) {
                $hue = ($g - $b) / $delta + ($g < $b ? 6.0 : 0.0);
            } elseif ($max == $g) {
                $hue = ($b - $r) / $delta + 2.0;
            } else {
                $hue = ($r - $g) / $delta + 4.0;
            }
            $hue *= 60.0;
        }

        $h = round($hue, 1);
        $s = round($sat * 100, 1);
        $l = round($lum * 100, 1);
        return "{$h} {$s}% {$l}%";
    }

    /**
     * Hex string to raw HSL channels
     */
    protected static function hexToHslChannels(string $hex): string
    {
        $hex = ltrim($hex, '#');
        if (strlen($hex) === 3) {
            $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }
        $r = hexdec(substr($hex, 0, 2)) / 255.0;
        $g = hexdec(substr($hex, 2, 2)) / 255.0;
        $b = hexdec(substr($hex, 4, 2)) / 255.0;

        return self::srgbToHslChannels($r, $g, $b);
    }

    /**
     * Generate complete CSS replacement string for app.css when exporting
     */
    public static function buildCssContent(array $theme): string
    {
        $lightLines = "";
        foreach ($theme['light'] as $k => $v) {
            $lightLines .= "    {$k}: {$v};\n";
        }

        $darkLines = "";
        foreach ($theme['dark'] as $k => $v) {
            $darkLines .= "    {$k}: {$v};\n";
        }

        return <<<CSS
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
{$lightLines}
  }

  .dark {
{$darkLines}
  }

  * {
    border-color: hsl(var(--border));
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: "{$theme['fontSans']}", sans-serif;
  }
}
CSS;
    }
}
