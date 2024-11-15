// hooks/useUser.ts
import { useState, useEffect } from 'react';
import { auth } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

interface User {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    email: string;
    emailVerification: boolean;
    name: string;
    labels?: string[];
    prefs?: Record<string, string | number | boolean>;
    status: boolean;
}

interface UseUserReturn {
    user: User | null;
    loading: boolean;
    error: Error | null;
    isAdmin: boolean;
    refreshUser: () => Promise<void>;
}

export function useUser(): UseUserReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    const checkAdminStatus = (user: User | null) => {
        const hasAdminLabel = user?.labels?.[0] === 'admin';
        setIsAdmin(hasAdminLabel);
        return hasAdminLabel;
    };

    const fetchUser = async () => {
        try {
            setLoading(true);
            const currentUser = await auth.get();
            setUser(currentUser as User);
            checkAdminStatus(currentUser as User);
            setError(null);
        } catch (err) {
            setUser(null);
            setIsAdmin(false);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [router]);

    const refreshUser = async () => {
        await fetchUser();
    };

    return { user, loading, error, isAdmin, refreshUser };
}