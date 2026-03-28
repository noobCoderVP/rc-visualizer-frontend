export default function SectionCard({
    title,
    children,
    color,
    border,
}: {
    title: string;
    children: React.ReactNode;
    color: string;
    border: string;
}) {
    return (
        <div
            className={`${color} ${border} rounded-2xl border-2 p-5 shadow-lg ring-1 ring-white/60 transition-shadow duration-200 hover:shadow-xl`}
        >
            <h3 className="mb-3 text-xl font-semibold tracking-tight text-gray-800">
                {title}
            </h3>
            {children}
        </div>
    );
}
