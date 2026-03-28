export default function Footer() {
    return (
        <footer className="mt-10 border-t border-slate-300/80 bg-white/85 text-slate-700 shadow-[0_-10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4 text-center text-sm md:px-6">
                © {new Date().getFullYear()} Passage Visualizer. All rights
                reserved.
            </div>
        </footer>
    );
}
