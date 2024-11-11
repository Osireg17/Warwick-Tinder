import React from "react";
import { Toaster } from "@/components/ui/toaster";

interface VerificationSentLayoutProps {
    children: React.ReactNode;
}

const VerificationSentLayout: React.FC<VerificationSentLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
            <main className="verification-sent-content">
                {children}
            </main>
            <Toaster />
        </div>
    );
};

export default VerificationSentLayout;