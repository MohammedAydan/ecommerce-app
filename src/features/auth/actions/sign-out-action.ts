import apiClient, { clearTokens } from "@/lib/api";
import { AxiosError, isAxiosError } from "axios";

/**
 * Signs the user out by clearing local tokens and notifying the backend.
 * Even if the backend call fails, local tokens are cleared to ensure the user is logged out client-side.
 * 
 * @returns {Promise<void>}
 */
export const signOutAction = async (): Promise<void> => {
    try {
        // First attempt to notify the backend about the sign-out
        // This helps invalidate the token on the server side for security
        try {
            await apiClient.post("/User/signOut");
            console.log("Sign-out notification sent to backend.");
        } catch (backendError) {
            // Log but don't throw - we still want to clear local tokens
            console.warn("Backend sign-out notification failed:", backendError);
            // Continue with local sign-out regardless of backend success
        }
        
        // Always clear tokens from localStorage to ensure local sign-out
        clearTokens();
        
        return Promise.resolve();

    } catch (error) {
        console.error("Sign-out error:", error);

        // Handle potential errors during the optional backend call
        if (isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                throw new Error(`Backend sign-out failed (${axiosError.response.status}): ${axiosError.response.data || 'Server error'}`);
            } else if (axiosError.request) {
                throw new Error("Network error during sign-out notification");
            } else {
                throw new Error(`Request setup error during sign-out: ${axiosError.message}`);
            }
        } else {
            // Handle any other unexpected errors
            throw new Error(
                error instanceof Error ? 
                error.message : 
                "Unknown error during sign-out"
            );
        }
        // Note: Even if the backend call fails, tokens are cleared locally.
        // Depending on requirements, you might want to handle this differently.
    }
};