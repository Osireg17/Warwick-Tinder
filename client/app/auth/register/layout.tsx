import React from 'react';
import { Toaster } from "@/components/ui/toaster"

interface RegisterLayoutProps {
    children: React.ReactNode;
}

const RegisterLayout: React.FC<RegisterLayoutProps> = ({ children }) => {
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