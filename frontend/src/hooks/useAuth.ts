import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const login = (user: Parameters<typeof setAuth>[0], token: string) => {
    setAuth(user, token);
  };

  const logout = () => {
    clearAuth();
  };

  return { user, token, isAuthenticated, login, logout };
}
