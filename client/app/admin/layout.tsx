// app/admin/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Loader2, LayoutDashboard, FileSpreadsheet, Users, Settings } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useUser } from '../hooks/useUser'
import { UniversalHeader } from '../components/header'

const adminNavItems = [
    {
        href: '/admin',
        label: 'Overview',
        icon: LayoutDashboard
    },
    {
        href: '/admin/responses',
        label: 'Responses',
        icon: FileSpreadsheet
    },
    {
        href: '/admin/users',
        label: 'Users',
        icon: Users
    },
    {
        href: '/admin/settings',
        label: 'Settings',
        icon: Settings
    }
]

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, loading } = useUser()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!loading && (!user || !user.labels?.includes('admin'))) {
            router.push('/dashboard')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                    <p className="text-gray-600">Loading admin panel...</p>
                </div>
            </div>
        )
    }

    if (!user || !user.labels?.includes('admin')) {
        return null // Let the useEffect handle the redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100">
            {/* Header */}
            <UniversalHeader />
            {/* Main content with sidebar */}
            <div className="flex min-h-[calc(100vh-4rem)]">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-white/80 backdrop-blur-md border-r p-4">
                    <nav className="space-y-2">
                        {adminNavItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <Button
                                    key={item.href}
                                    asChild
                                    variant={isActive ? "default" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        isActive && "bg-rose-500 hover:bg-rose-600 text-white"
                                    )}
                                >
                                    <Link href={item.href}>
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                </Button>
                            )
                        })}
                    </nav>

                    {/* Quick actions */}
                    <div className="mt-8 pt-4 border-t">
                        <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start gap-2"
                        >
                            <Link href="/dashboard">
                                <LayoutDashboard className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>
                </aside>

                {/* Main content area */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>

            <Toaster />
        </div>
    )
}