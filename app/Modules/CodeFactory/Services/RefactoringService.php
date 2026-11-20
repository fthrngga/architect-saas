<?php

namespace App\Modules\CodeFactory\Services;

class RefactoringService
{
    public function __construct(
        protected PHPParserService $parser
    ) {
    }

    public function analyzeAndDistribute(string $rawCode): array
    {
        // 1. Parse and Extract
        $extracted = $this->parser->extractLogic($rawCode);

        // 2. Prepare Suggestions
        $suggestions = [
            'request' => [],
            'repository' => [],
            'service' => [],
            'resource' => [],
        ];

        // 3. Logic: Validations -> Request
        if (!empty($extracted['validations'])) {
            $suggestions['request'] = [
                'name' => 'StoreEntityRequest', // Placeholder
                'rules' => $extracted['validations'], // Needs further parsing to extract array only
                'reason' => 'Validation logic detected.'
            ];
        }

        // 4. Logic: Queries -> Repository
        if (!empty($extracted['queries'])) {
            $suggestions['repository'] = [
                'name' => 'EntityRepository',
                'methods' => $extracted['queries'],
                'reason' => 'Database queries detected.'
            ];
        }

        // 5. Remaining -> Service / Controller
        // For now, we return the structured analysis
        return $suggestions;
    }
}
