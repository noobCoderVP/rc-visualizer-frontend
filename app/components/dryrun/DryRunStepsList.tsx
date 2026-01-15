"use client";

import DryRunStepItem from "./DryRunStepItem";

type DryRunStep = {
    step: string;
    state: string;
    explanation: string;
};

type Props = {
    steps: DryRunStep[];
};

export default function DryRunStepsList({ steps }: Props) {
    return (
        <div className="space-y-5">
            {steps.map((s, i) => (
                <DryRunStepItem key={i} index={i} data={s} />
            ))}
        </div>
    );
}
