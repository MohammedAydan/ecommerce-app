import SignUpType from "../types/sign-up-type";
import AuthResponse from "../types/auth-response";
import apiClient, { setAccessToken, setRefreshToken } from "@/lib/api";
import { AxiosError, isAxiosError } from "axios";

export const signUpAction = async (
  signUpData: SignUpType
): Promise<AuthResponse> => {
  try {
    const formData = new FormData();
    
    // Append all fields to FormData with proper field names
    Object.entries(signUpData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Handle file separately
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.post<AuthResponse>("/User/signUp", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const result = response.data;
    console.log("Auth response:", result);

    if (result.accessToken || result.refreshToken) {
      setAccessToken(result.accessToken);
      setRefreshToken(result.refreshToken);
    }

    return result;

  } catch (error) {
    console.error("Sign-up error:", error);

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
      error instanceof Error ? error.message : "Unknown error during sign-up"
    );
  }
};