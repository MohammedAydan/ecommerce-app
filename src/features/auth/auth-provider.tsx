"use client"
import { AuthProvider } from "./auth-context";

const ClientAuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}

export default ClientAuthProvider;