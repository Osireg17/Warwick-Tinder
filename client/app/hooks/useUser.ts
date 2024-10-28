import { useState, useEffect } from 'react';
import { auth } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

interface User {
    $id: string;
    email: string;
    name: string;
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await auth.get();
                setUser(currentUser);
            } catch {
                setUser(null);
                router.push('/auth/signin');
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [router]);

    return { user, loading };
}