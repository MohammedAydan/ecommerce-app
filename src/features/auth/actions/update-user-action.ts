import apiClient from "@/lib/api";
import { AxiosError, isAxiosError } from "axios";
import UpdateUserType from "../types/update-user-type";
import UserType from "@/types/user-type";

export const updateUserAction = async (
    updateUserAction: UpdateUserType
): Promise<UserType> => {
    try {
        const formData = new FormData();

        // Append all fields to FormData with proper field names
        Object.entries(updateUserAction).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                // Handle file separately
                if (value instanceof File) {
                    formData.append(key, value, value.name);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        const response = await apiClient.put<UserType>("/User/update", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });


        if (response.status != 200 || !response.data) {
            throw new Error("Update user failed");
        }

        return response.data;

    } catch (error) {
        console.error("Update user error:", error);

        if (isAxiosError(error)) {
            const axiosError = error as AxiosError<{
                errors?: Record<string, string[]>;
                title?: string;
                type?: string;
                status?: number;
            }>;

            if (axiosError.response?.data?.errors) {
                // Handle validation errors
                const errorMessages = Object.entries(axiosError.response.data.errors)
                    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                    .join("\n");
                throw new Error(errorMessages);
            } else if (axiosError.response?.data?.title) {
                throw new Error(axiosError.response.data.title);
            } else if (axiosError.message) {
                throw new Error(axiosError.message);
            }
        }

        throw new Error(
            error instanceof Error ? error.message : "Unknown error during update user"
        );
    }
};