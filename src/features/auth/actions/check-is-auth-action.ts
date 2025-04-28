import UserType from "@/types/user-type";
import apiClient, { clearTokens } from "@/lib/api";
import { AxiosError, isAxiosError } from "axios";

export const checkIsAuthAction = async (): Promise<UserType> => {
    try {
        const response = await apiClient.get<UserType>("/User");

        const result = response.data;
        return result;
    } catch (error) {
        console.error("Authentication check failed:", error);

        if (isAxiosError(error) && error.response?.status === 401) {
            clearTokens();
        }

        if (isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                if (axiosError.response.status === 401) {
                    throw new Error("User not authenticated."); // Or return null/undefined depending on app logic
                }
                throw new Error(`Authentication check failed (${axiosError.response.status}): ${axiosError.response.data || 'Server error'}`);
            } else if (axiosError.request) {
                throw new Error("Network error during authentication check");
            } else {
                throw new Error(`Request setup error during authentication check: ${axiosError.message}`);
            }
        } else {
            // Handle non-Axios errors
            throw new Error(
                error instanceof Error ?
                    error.message :
                    "Unknown error during authentication check"
            );
        }
    }
};