import React from "react";
import { Toaster } from "@/components/ui/toaster";

interface VerifyLayoutProps {
    children: React.ReactNode;
}

const VerifyLayout: React.FC<VerifyLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
            <main className="verify-content">
                {children}
            </main>
            <Toaster />
        </div>
    );
};

export default VerifyLayout;