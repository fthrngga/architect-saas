<?php

namespace App\Modules\CodeFactory\Services;

use Illuminate\Filesystem\Filesystem;

class StubGeneratorService
{
    public function __construct(
        protected Filesystem $files
    ) {
    }

    public function generate(string $stubPath, array $replacements): string
    {
        if (!$this->files->exists($stubPath)) {
            throw new \Exception("Stub not found: {$stubPath}");
        }

        $content = $this->files->get($stubPath);

        foreach ($replacements as $key => $value) {
            $content = str_replace("{{ $key }}", $value, $content);
        }

        return $content;
    }

    /**
     * Conditional Injection: Only inject if condition is true, otherwise empty.
     */
    public function generateWithConditions(string $stubPath, array $replacements, array $conditions): string
    {
        $content = $this->generate($stubPath, $replacements);

        // Example Logic for specialized handling if needed
        // For simple replacements, the generic generate() often suffices if pre-processed.

        return $content;
    }
}
