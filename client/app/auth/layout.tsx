// app/auth/layout.tsx
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { Toaster } from "@/components/ui/toaster"

interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <Heart className="h-8 w-8 text-rose-500" />
                            <span className="text-2xl font-bold text-gray-800">First Date</span>
                        </Link>
                        <nav className="flex items-center gap-4">
                            <Link
                                href="/auth/signin"
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/register"
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Register
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="min-h-screen pt-16 flex items-center justify-center p-4">
                {children}
            </main>

            {/* Footer */}
            <footer className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-rose-500" />
                            <span className="text-sm text-gray-600">
                                © {new Date().getFullYear()} First Date
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link
                                href="/privacy"
                                className="text-sm text-gray-600 hover:text-rose-500 transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-sm text-gray-600 hover:text-rose-500 transition-colors"
                            >
                                Terms
                            </Link>
                            <Link
                                href="/contact"
                                className="text-sm text-gray-600 hover:text-rose-500 transition-colors"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Toaster */}
            <Toaster />
        </div>
    )
}