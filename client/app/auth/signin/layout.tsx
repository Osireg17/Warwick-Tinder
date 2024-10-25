import React from 'react';
import { Toaster } from "@/components/ui/toaster"

interface SignInLayoutProps {
    children: React.ReactNode;
}

const RegisterLayout: React.FC<SignInLayoutProps> = ({ children }) => {
    return (
        <div className="register-layout">
            <main className="register-content">
                {children}
            </main>
            <Toaster />
        </div>
    );
};

export default RegisterLayout;