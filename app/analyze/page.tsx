'use client';

import AnalyzerPage from "../components/Analyzer";

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 space-y-8">
            <h1 className="text-4xl font-bold text-center text-gray-800">
                Passage Analyzer
            </h1>
            <AnalyzerPage />
        </div>
    );
}
