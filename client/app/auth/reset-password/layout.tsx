import React from "react";
import { Toaster } from "@/components/ui/toaster";

interface ResetPasswordLayoutProps {
    children: React.ReactNode;
}

const ResetPasswordLayout: React.FC<ResetPasswordLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
            <main className="reset-password-content">
                {children}
            </main>
            <Toaster />
        </div>
    );
};

export default ResetPasswordLayout;