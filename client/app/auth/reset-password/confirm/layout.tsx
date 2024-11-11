import React from "react";

interface ResetPasswordConfirmLayout {
    children: React.ReactNode;
}

const ResetPasswordConfirmLayout: React.FC<ResetPasswordConfirmLayout> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
            <main className="reset-password-content">
                {children}
            </main>
        </div>
    );
};

export default ResetPasswordConfirmLayout;