'use client'

import { Heart, LayoutDashboard, Loader2, LogOut } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { auth } from '@/lib/appwrite'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useSession } from '../hooks/useSession'

export function Header() {
  const { isLoading, hasSession } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await auth.deleteSession('current')
      router.push('/auth/signin')
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      })
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
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
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : hasSession ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="hidden sm:flex items-center gap-2"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                {/* Mobile version - icon only */}
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="sm:hidden"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}