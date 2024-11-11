import React from "react";
import { Toaster } from "@/components/ui/toaster";

interface ConfirmationLayoutProps {
    children: React.ReactNode;
}

const ConfirmationLayout: React.FC<ConfirmationLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
            <main className="confirmation-content">
                {children}
            </main>
            <Toaster />
        </div>
    );
};

export default ConfirmationLayout;