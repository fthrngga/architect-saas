<?php

namespace App\Modules\CodeFactory\Services;

use PhpParser\Error;
use PhpParser\Node;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitorAbstract;
use PhpParser\Parser;
use PhpParser\ParserFactory;
use PhpParser\PrettyPrinter;

class PHPParserService
{
    protected Parser $parser;
    protected PrettyPrinter\Standard $printer;

    public function __construct()
    {
        $this->parser = (new ParserFactory)->createForNewestSupportedVersion();
        $this->printer = new PrettyPrinter\Standard;
    }

    /**
     * Parse raw PHP code and return AST
     */
    public function parse(string $code): ?array
    {
        try {
            // Add open tag if missing, to ensure parser works
            if (!str_starts_with(trim($code), '<?php')) {
                $code = "<?php\n" . $code;
            }

            return $this->parser->parse($code);
        } catch (Error $e) {
            // Handle parse error
            return null;
        }
    }

    /**
     * Extract Logic into segments: Validation, Query, Business
     */
    public function extractLogic(string $code): array
    {
        $ast = $this->parse($code);
        if (!$ast) {
            return [];
        }

        $validations = [];
        $queries = [];
        $printer = $this->printer;

        $visitor = new class ($validations, $queries, $printer) extends NodeVisitorAbstract {
            public function __construct(
            public array &$validations,
            public array &$queries,
            protected $printer
            ) {}

            public function enterNode(Node $node)
            {
                // Find $request->validate([...])
                if ($node instanceof Node\Expr\MethodCall) {
                    if ($node->name instanceof Node\Identifier && $node->name->name === 'validate') {
                        $this->validations[] = $this->printer->prettyPrint([$node]);
                    }
                }

                // Find Model::create() or where()
                if ($node instanceof Node\Expr\StaticCall) {
                    // Check if it's a model call (heuristic: starts with uppercase)
                    if ($node->class instanceof Node\Name) {
                        $className = $node->class->getLast();
                        // Assume Models are capitalized
                        if (ctype_upper($className[0])) {
                            $this->queries[] = $this->printer->prettyPrint([$node]);
                        }
                    }
                }
            }
        };

        $traverser = new NodeTraverser();
        $traverser->addVisitor($visitor);
        $traverser->traverse($ast);

        return [
            'validations' => $validations,
            'queries' => $queries,
            'original_code' => $code
        ];
    }
}
