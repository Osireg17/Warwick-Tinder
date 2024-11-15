// app/auth/layout.tsx
import { Toaster } from "@/components/ui/toaster"

import { Footer } from '../components/footer'
import { UniversalHeader } from "../components/header"

interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100">
            <UniversalHeader />
            <main className="min-h-screen pt-16 flex items-center justify-center p-4">
                {children}
            </main>
            <Footer />
            <Toaster />
        </div>
    )
}