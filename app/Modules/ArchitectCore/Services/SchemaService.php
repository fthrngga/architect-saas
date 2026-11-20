<?php

namespace App\Modules\ArchitectCore\Services;

use App\Modules\ArchitectCore\Models\Project;
use App\Modules\ArchitectCore\Models\Schema;
use Illuminate\Support\Facades\DB;
use Exception;

class SchemaService
{
    /**
     * Create or Update an Atomic Entity Schema
     */
    public function saveSchema(Project $project, array $data): Schema
    {
        return DB::transaction(function () use ($project, $data) {
            $this->validateMetadata($data['metadata'] ?? []);

            return Schema::updateOrCreate(
                [
                    'project_id' => $project->id,
                    'name' => $data['name'],
                ],
                [
                    'type' => $data['type'] ?? 'model',
                    'metadata' => $data['metadata'] ?? [],
                    'ui_coordinates' => $data['ui_coordinates'] ?? null,
                ]
            );
        });
    }

    /**
     * Validate the complexity of the metadata structure
     */
    protected function validateMetadata(array $metadata): void
    {
        // Example: Ensure columns exist
        if (!isset($metadata['columns']) || !is_array($metadata['columns'])) {
            // It's possible to have an empty schema initially, but let's warn or set defaults
            // throw new Exception("Invalid Metadata: Columns definition missing.");
        }

        // Future: Add more rigid validation using JSON Schema or DTOs
    }

    public function getProjectSchemas(Project $project)
    {
        return $project->schemas()->get();
    }

    public function deleteSchema(Schema $schema): bool
    {
        return $schema->delete();
    }
}
