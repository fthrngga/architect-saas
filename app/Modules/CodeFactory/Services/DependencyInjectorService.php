<?php

namespace App\Modules\CodeFactory\Services;

use Illuminate\Filesystem\Filesystem;

class DependencyInjectorService
{
    public function __construct(
        protected Filesystem $files
    ) {
    }

    /**
     * Inject a method into a Class file (e.g. adding a relation to a Model)
     */
    public function injectMethod(string $filePath, string $methodContent): bool
    {
        if (!$this->files->exists($filePath)) {
            return false;
        }

        $content = $this->files->get($filePath);

        // Find the last closing brace
        $pos = strrpos($content, '}');
        if ($pos === false) {
            return false;
        }

        // Insert code before the last brace
        $newContent = substr($content, 0, $pos) . "\n" . $methodContent . "\n" . substr($content, $pos);

        $this->files->put($filePath, $newContent);

        return true;
    }

    /**
     * Inject a Trait use statement into a Class
     */
    public function injectTrait(string $filePath, string $traitName): bool
    {
        // Simplistic regex approach for MVP
        if (!$this->files->exists($filePath)) {
            return false;
        }

        $content = $this->files->get($filePath);

        if (str_contains($content, "use $traitName;")) {
            return true; // Already exists
        }

        // Find the class definition opening
        // class X extends Y {
        $pattern = '/class\s+\w+.*\{/';
        if (preg_match($pattern, $content, $matches)) {
            $match = $matches[0];
            $replace = $match . "\n    use $traitName;";
            $content = str_replace($match, $replace, $content);
            $this->files->put($filePath, $content);
            return true;
        }

        return false;
    }
}
