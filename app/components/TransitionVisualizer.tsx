/* eslint-disable @typescript-eslint/no-explicit-any */
export default function TransitionVisualizer({
    transitions,
}: {
    transitions: any[];
}) {
    return (
        <div className="space-y-4">
            {transitions.map((t, i) => (
                <div
                    key={i}
                    className="p-4 bg-white rounded-lg border border-pink-300 shadow-sm"
                >
                    <p>
                        <strong>From:</strong> {t.src}
                    </p>
                    <p>
                        <strong>To:</strong> {t.dest}
                    </p>
                    <p>
                        <strong>Relation:</strong> {t.relation}
                    </p>
                </div>
            ))}
        </div>
    );
}
