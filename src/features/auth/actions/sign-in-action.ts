import SignInType from "../types/sign-in-type";
import AuthResponse from "../types/auth-response";
import apiClient, { setAccessToken, setRefreshToken } from "@/lib/api";
import { AxiosError, isAxiosError } from "axios";

export const signInAction = async (
  { email, password }: SignInType
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/User/signIn", {
      email,
      password,
    });

    const result = response.data;
    console.log("Auth response:", result);

    if (result.accessToken || result.refreshToken) {
      setAccessToken(result.accessToken);
      setRefreshToken(result.refreshToken);
    }

    return result;

  } catch (error) {
    console.error("Authentication error:", error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<AuthResponse>; // Type assertion for better access

      if (axiosError.response) {
        const serverError = axiosError.response.data;
        throw new Error(
          serverError?.message || // Use optional chaining
          `Authentication failed (${axiosError.response.status})`
        );
      } else if (axiosError.request) {
        throw new Error("Network error - no response from server");
      } else {
        throw new Error(`Request setup error: ${axiosError.message}`);
      }
    } else {
      throw new Error(
        error instanceof Error ?
          error.message :
          "Unknown authentication error"
      );
    }
  }
};