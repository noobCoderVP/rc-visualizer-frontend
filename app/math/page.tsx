"use client";

import { useState } from "react";
import AdditionPractice from "../components/AdditionPractice";
import MultiplicationPractice from "../components/MultiplicationPractice";

export default function MathPracticePage() {
    const [mode, setMode] = useState<"addition" | "multiplication">("addition");

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center text-gray-800">
                🧮 Math Practice
            </h1>

            {/* Tabs */}
            <div className="flex justify-center gap-3">
                {["addition", "multiplication"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() =>
                            setMode(tab as "addition" | "multiplication")
                        }
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            mode === tab
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {tab === "addition" ? "Addition" : "Multiplication"}
                    </button>
                ))}
            </div>

            {/* Render based on mode */}
            {mode === "addition" ? (
                <AdditionPractice />
            ) : (
                <MultiplicationPractice />
            )}
        </div>
    );
}
