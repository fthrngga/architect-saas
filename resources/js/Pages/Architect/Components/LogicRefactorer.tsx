import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

interface AnalysisResult {
    request: { name: string; rules: string[] };
    repository: { name: string; methods: string[] };
}

export default function LogicRefactorer() {
    const [code, setCode] = useState('// Paste raw PHP code here...');
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

    const handleAnalyze = async () => {
        // Call backend API to analyze code
        console.log("Analyzing code:", code);
        // Mock response for now
        setAnalysis({
            request: { name: 'StoreOrderRequest', rules: ['required', 'string'] },
            repository: { name: 'OrderRepository', methods: ['create'] }
        });
    };

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader className="py-2 border-b">
                <CardTitle className="text-sm font-medium flex justify-between items-center">
                    <span>Logic Refactorer (Vibe Coding Bridge)</span>
                    <Button onClick={handleAnalyze} size="sm">Analyze & Refactor</Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex">
                <div className="w-1/2 border-r h-full">
                    <Editor
                        height="100%"
                        defaultLanguage="php"
                        value={code}
                        onChange={(value) => setCode(value || '')}
                        theme="vs-dark"
                        options={{ minimap: { enabled: false }, fontSize: 13 }}
                    />
                </div>
                <div className="w-1/2 p-4 h-full overflow-auto bg-muted/50">
                    {analysis ? (
                        <div className="space-y-4">
                            <div className="p-3 bg-background border rounded-md">
                                <h4 className="font-bold text-xs text-primary mb-2">SUGGESTED REQUEST</h4>
                                <pre className="text-xs">{JSON.stringify(analysis.request, null, 2)}</pre>
                            </div>
                            <div className="p-3 bg-background border rounded-md">
                                <h4 className="font-bold text-xs text-primary mb-2">SUGGESTED REPOSITORY</h4>
                                <pre className="text-xs">{JSON.stringify(analysis.repository, null, 2)}</pre>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground text-sm mt-10">
                            Paste code and click Analyze to see suggestions.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
