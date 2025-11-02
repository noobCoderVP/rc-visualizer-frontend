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
        <div className={`${color} ${border} border-2 rounded-xl p-5 shadow-sm`}>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {title}
            </h3>
            {children}
        </div>
    );
}
