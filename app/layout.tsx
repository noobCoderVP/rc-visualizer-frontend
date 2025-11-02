import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"; // ✅ client component
import Footer from "./components/Footer"; // ✅ separate footer

const roboto = Roboto({
    subsets: ["latin"],
    variable: "--font-roboto",
    weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
    title: "Passage Visualizer",
    description:
        "AI-powered RC Visualization and Solving Interface for CAT and similar exams",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={roboto.variable}>
            <body className="bg-white text-black antialiased flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container mx-auto px-4 md:px-6 py-6 md:py-10">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
