<?php

namespace App\Modules\ArchitectCore\Services;

use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SchemaValidator
{
    /**
     * Protected system tables that must never be created or dropped by dynamic modules.
     */
    public const SYSTEM_TABLES = [
        'users',
        'projects',
        'modules',
        'migrations',
        'sessions',
        'cache',
        'cache_locks',
        'jobs',
        'job_batches',
        'failed_jobs',
        'password_reset_tokens',
        'personal_access_tokens',
    ];

    /**
     * Reserved PHP keywords that cannot be used as Class / Module names.
     */
    public const RESERVED_PHP_WORDS = [
        'class', 'interface', 'trait', 'enum', 'function', 'object', 'string', 'int',
        'float', 'bool', 'iterable', 'void', 'never', 'mixed', 'array', 'null',
        'true', 'false', 'self', 'parent', 'static', 'echo', 'print', 'exit', 'die',
        'return', 'include', 'require', 'include_once', 'require_once', 'new', 'clone',
        'throw', 'try', 'catch', 'finally', 'namespace', 'use', 'as', 'if', 'else',
        'elseif', 'endif', 'while', 'endwhile', 'do', 'for', 'endfor', 'foreach',
        'endforeach', 'switch', 'endswitch', 'case', 'default', 'break', 'continue',
        'goto', 'global', 'var', 'const', 'public', 'private', 'protected', 'abstract',
        'final', 'readonly', 'match', 'yield', 'fn', 'list'
    ];

    /**
     * System columns that are automatically injected and managed.
     */
    public const MANAGED_COLUMNS = [
        'id',
        'project_id',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    /**
     * Sanitize and validate module name.
     */
    public static function sanitizeModuleName(string $name): string
    {
        $clean = preg_replace('/[^a-zA-Z0-9]/', '', $name);
        $studly = Str::studly($clean);

        if (empty($studly) || is_numeric($studly[0])) {
            $studly = 'Entity' . $studly;
        }

        if (in_array(strtolower($studly), self::RESERVED_PHP_WORDS)) {
            $studly .= 'Model';
        }

        return $studly;
    }

    /**
     * Sanitize and validate table name.
     */
    public static function sanitizeTableName(string $tableName, string $moduleName): string
    {
        $clean = Str::snake(preg_replace('/[^a-zA-Z0-9_]/', '', $tableName));

        if (empty($clean) || is_numeric($clean[0])) {
            $clean = 'tbl_' . ($clean ?: strtolower($moduleName) . 's');
        }

        // Prevent collision with system tables
        if (in_array($clean, self::SYSTEM_TABLES)) {
            $clean = 'app_' . $clean;
        }

        // Max MySQL table name is 64 chars
        return substr($clean, 0, 64);
    }

    /**
     * Sanitize and filter column attributes array.
     */
    public static function sanitizeAttributes(array $attributes): array
    {
        $sanitized = [];
        $seenNames = [];

        foreach ($attributes as $attr) {
            $rawName = $attr['name'] ?? '';
            $rawType = $attr['type'] ?? 'string';
            $nullable = !empty($attr['nullable']);

            // Clean column name: lowercase, letters, numbers, underscores only
            $colName = Str::snake(preg_replace('/[^a-zA-Z0-9_]/', '', $rawName));

            // If empty or starts with number
            if (empty($colName)) {
                continue;
            }
            if (is_numeric($colName[0])) {
                $colName = 'col_' . $colName;
            }

            // Max MySQL column identifier length is 64
            $colName = substr($colName, 0, 64);

            // Skip managed columns (id, project_id, timestamps, soft_deletes)
            if (in_array($colName, self::MANAGED_COLUMNS)) {
                continue;
            }

            // Skip duplicates within same module
            if (in_array($colName, $seenNames)) {
                continue;
            }

            $seenNames[] = $colName;

            // Whitelist supported types
            $allowedTypes = ['string', 'integer', 'float', 'currency', 'boolean', 'text', 'date', 'relation', 'enum'];
            $colType = in_array($rawType, $allowedTypes) ? $rawType : 'string';

            $sanitized[] = [
                'name' => $colName,
                'type' => $colType,
                'nullable' => $nullable,
            ];
        }

        // If all attributes were stripped or none provided, inject a safe default
        if (empty($sanitized)) {
            $sanitized[] = [
                'name' => 'title',
                'type' => 'string',
                'nullable' => false,
            ];
        }

        return $sanitized;
    }

    /**
     * Check if a table is a protected system table.
     */
    public static function isProtectedTable(string $tableName): bool
    {
        return in_array(strtolower($tableName), self::SYSTEM_TABLES);
    }
}

