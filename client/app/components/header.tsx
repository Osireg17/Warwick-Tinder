// components/universal-header.tsx
'use client'

import { Heart, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { auth } from '@/lib/appwrite'
import { useRouter, usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

import { useState } from 'react'
import { useUser } from '../hooks/useUser'

export function UniversalHeader() {
  const { user, loading, isAdmin } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isAdminPage = pathname?.startsWith('/admin')

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await auth.deleteSession('current')
      router.push('/')
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
    } finally {
      setIsLoggingOut(false)
    }
  }

  // If user is loading, show minimal header
  if (loading) {
    return (
      <header className="bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="text-2xl font-bold text-gray-800">
                First Dates with RAG x WDSS
              </span>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Heart className="h-8 w-8 text-rose-500" />
            <span className="text-2xl font-bold text-gray-800">
              {isAdminPage ? "Admin Dashboard" : "First Dates with RAG x WDSS"}
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Show admin link if user is admin and not on admin pages */}
                {isAdmin && !isAdminPage && (
                  <Button
                    asChild
                    variant="outline"
                    className="hidden sm:flex items-center gap-2"
                  >
                    <Link href="/admin">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}

                {/* Show dashboard link if on admin pages */}
                {isAdminPage && (
                  <Button
                    asChild
                    variant="outline"
                  >
                    <Link href="/dashboard">
                      Back to Dashboard
                    </Link>
                  </Button>
                )}

                {/* Logout button */}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
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
      </div>
    </header>
  )
}