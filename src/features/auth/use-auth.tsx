import { useContext } from "react";
import { AuthContext, AuthContextProps } from "./auth-context";

/**
 * Custom hook to access authentication context throughout the application.
 * Must be used within an AuthProvider component.
 * 
 * @returns {AuthContextProps} The authentication context with user data and auth methods
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}