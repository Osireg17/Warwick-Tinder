// components/layout.tsx
import React from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <Heart className="h-8 w-8 text-rose-500" />
                            <span className="text-2xl font-bold text-gray-800">First Dates with RAG x WDSS</span>
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main content */}
            <main className="flex-grow bg-gradient-to-br from-rose-100 to-teal-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                        <div className="flex items-center gap-2">
                            <Heart className="h-6 w-6 text-rose-500" />
                            <span>© {new Date().getFullYear()} Love Connect</span>
                        </div>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-rose-300 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-rose-300 transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/contact" className="hover:text-rose-300 transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;