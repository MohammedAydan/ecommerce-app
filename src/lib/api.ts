import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AuthResponse from "@/features/auth/types/auth-response";

const getAccessToken = (): string | null =>
  localStorage.getItem("ACCESS_TOKEN");

const getRefreshToken = (): string | null =>
  localStorage.getItem("REFRESH_TOKEN");

const setAccessToken = (token: string): void => {
  localStorage.setItem("ACCESS_TOKEN", token);
};

const setRefreshToken = (token: string): void => {
  localStorage.setItem("REFRESH_TOKEN", token);
};

const clearTokens = (): void => {
  localStorage.removeItem("ACCESS_TOKEN");
  localStorage.removeItem("REFRESH_TOKEN");
};
//#endregion

//#region === Axios Client Setup ===
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
  },
});

const apiUnauth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
  },
});
//#endregion

//#region === Token Refresh Logic ===
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    return error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};
//#endregion

//#region === Request Interceptor ===
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);
//#endregion

//#region === Response Interceptor (Handle Token Expiry) ===
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await apiUnauth.post<AuthResponse>(
        `${apiClient.defaults.baseURL}/User/refresh-token`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Invalid token refresh response");
      }

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
      }
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;

      processQueue(null, data.accessToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearTokens();
      processQueue(refreshError as AxiosError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
//#endregion

//#region === Exports ===
export {
  apiClient,
  apiUnauth,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
};
export default apiClient;
//#endregion
