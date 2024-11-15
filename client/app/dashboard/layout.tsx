'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { UniversalHeader } from '../components/header'


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <UniversalHeader />

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-gray-800 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                        <div className="flex items-center gap-2">
                            <Heart className="h-6 w-6 text-rose-500" />
                            <span>© {new Date().getFullYear()} First Date</span>
                        </div>
                        <div className="flex gap-6">
                            <Link href="/terms" className="hover:text-rose-300 transition-colors">
                                Terms
                            </Link>
                            <Link href="/privacy" className="hover:text-rose-300 transition-colors">
                                Privacy
                            </Link>
                            <Link href="/contact" className="hover:text-rose-300 transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}