"use client";

import { motion } from "framer-motion";

type DryRunStep = {
    step: string;
    state: string;
    explanation: string;
};

type Props = {
    index: number;
    data: DryRunStep;
};

export default function DryRunStepItem({ index, data }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex gap-4 items-start"
        >
            {/* Step Number */}
            <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 rounded-lg border bg-white p-4 shadow-sm space-y-2">
                <p className="font-medium text-gray-900">{data.step}</p>

                <div className="text-sm text-gray-600">
                    <span className="font-semibold">State:</span> {data.state}
                </div>

                <p className="text-gray-800">{data.explanation}</p>
            </div>
        </motion.div>
    );
}
