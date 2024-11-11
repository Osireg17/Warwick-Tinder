// app/dashboard/layout.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Heart, LogOut } from 'lucide-react'
import Link from 'next/link'
import { auth } from '@/lib/appwrite'
import { useToast } from "@/hooks/use-toast"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            await auth.deleteSession('current')
            router.push('/auth/signin')
        } catch (error) {
            console.error('Logout error:', error)
            toast({
                title: "Error",
                description: "Failed to log out. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white/80 backdrop-blur-md border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <Heart className="h-8 w-8 text-rose-500" />
                            <span className="text-2xl font-bold text-gray-800">First Dates with RAG x WDSS</span>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

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