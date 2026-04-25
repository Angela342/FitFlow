import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl: string = error.config?.url ?? "";
    const isAuthEndpoint = requestUrl.includes("/auth/");

    // Only force-redirect on 401 for protected endpoints.
    // Auth endpoints (login, register) handle their own errors inline.
    if (error.response?.status === 401 && !isAuthEndpoint) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie = "fitflow_token=; path=/; max-age=0";
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
