// hooks/useSession.ts
import { useState, useEffect } from 'react'
import { auth } from '@/lib/appwrite'

interface UseSessionReturn {
    isLoading: boolean
    hasSession: boolean
}

export function useSession(): UseSessionReturn {
    const [isLoading, setIsLoading] = useState(true)
    const [hasSession, setHasSession] = useState(false)

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await auth.getSession('current')
                setHasSession(!!session)
            } catch (error: unknown) {
                setHasSession(false)
                console.error('Session check error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        checkSession()
    }, [])

    return { isLoading, hasSession }
}