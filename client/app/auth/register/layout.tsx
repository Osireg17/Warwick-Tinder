import React from 'react';
import { Toaster } from "@/components/ui/toaster"

interface RegisterLayoutProps {
    children: React.ReactNode;
}

const RegisterLayout: React.FC<RegisterLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
            <main className="register-content">
                {children}
            </main>
            <Toaster />
        </div>
    );
};

export default RegisterLayout;