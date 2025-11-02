export default function Footer() {
    return (
        <footer className="border-t border-gray-300 bg-black text-white">
            <div className="container mx-auto px-4 md:px-6 py-4 text-center text-sm">
                © {new Date().getFullYear()} Passage Visualizer. All rights
                reserved.
            </div>
        </footer>
    );
}
