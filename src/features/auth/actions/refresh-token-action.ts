import UserType from "@/types/user-type";
import AuthResponse from "../types/auth-response";
import apiClient, { getRefreshToken, setAccessToken, setRefreshToken, clearTokens } from "@/lib/api";
import { AxiosError, isAxiosError } from "axios";

/**
 * Manually triggers a token refresh using the stored refresh token.
 * Note: Automatic token refresh on 401 errors is handled by the interceptor in api.ts.
 * This action might be useful for specific scenarios requiring manual refresh.
 * 
 * @returns {Promise<UserType>} The user data associated with the new tokens.
 */
export const refreshTokenAction = async (): Promise<UserType> => {
  const currentRefreshToken = getRefreshToken();

  if (!currentRefreshToken) {
    throw new Error("No refresh token available for manual refresh.");
  }

  try {
    // Use apiClient.post - interceptors will handle adding headers if needed
    // However, for refresh specifically, we might need to bypass the request interceptor's
    // default behavior of adding the *access* token. The interceptor logic in api.ts
    // already uses a base axios instance for the refresh call itself to avoid loops.
    // For consistency, we'll use apiClient here, assuming the backend ignores the Access token for this endpoint.
    const response = await apiClient.post<AuthResponse>("/User/refreshToken", {
      refreshToken: currentRefreshToken,
    });

    const result = response.data;
    console.log("Manual Refresh response:", result);

    // Validate response structure
    if (!result.accessToken || !result.refreshToken || !result.user) {
      throw new Error("Invalid token refresh response from server");
    }

    // Store the new tokens
    setAccessToken(result.accessToken);
    setRefreshToken(result.refreshToken);

    // Return updated user data
    return {
      ...result.user,
      imageUrl: "https://localhost/" + result.user.imageUrl,
    };

  } catch (error) {
    console.error("Manual token refresh error:", error);
    // If refresh fails (e.g., token expired/invalid), clear existing tokens.
    clearTokens(); 

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<AuthResponse>;

      if (axiosError.response) {
        const serverError = axiosError.response.data;
        // Specific handling for refresh errors might be needed depending on API response
        throw new Error(
          serverError?.message ||
          `Token refresh failed (${axiosError.response.status})`
        );
      } else if (axiosError.request) {
        throw new Error("Network error - no response during token refresh");
      } else {
        throw new Error(`Request setup error during token refresh: ${axiosError.message}`);
      }
    } else {
      throw new Error(
        error instanceof Error ? 
        error.message : 
        "Unknown token refresh error"
      );
    }
  }
};