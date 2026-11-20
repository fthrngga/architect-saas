import React from 'react';
import { Head } from '@inertiajs/react';
import ArchitectLayout from '@/Layouts/Architect/ArchitectLayout';
import LogicRefactorerComponent from '@/Pages/Architect/Components/LogicRefactorer';

export default function RefactorerPage() {
    return (
        <ArchitectLayout title="Logic Refactorer (Vibe Coding Bridge)">
            <Head title="Logic Refactorer" />
            <div className="h-[calc(100vh-120px)]">
                <LogicRefactorerComponent />
            </div>
        </ArchitectLayout>
    );
}
