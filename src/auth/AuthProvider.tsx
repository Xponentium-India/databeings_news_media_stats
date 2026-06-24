import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api, type AdminUser } from "@/lib/api";

interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  /** epoch ms when the current session hard-expires (40-min cap) */
  expiresAt: number | null;
  refresh: () => Promise<void>;
  setSession: (user: AdminUser, expiresAt: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const clearLocal = useCallback(() => {
    setUser(null);
    setExpiresAt(null);
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { user, expiresAt } = await api.me();
      if (user) {
        setUser(user);
        setExpiresAt(expiresAt ? new Date(expiresAt).getTime() : null);
      } else {
        clearLocal();
      }
    } catch {
      clearLocal();
    } finally {
      setLoading(false);
    }
  }, [clearLocal]);

  const setSession = useCallback((u: AdminUser, exp: string) => {
    setUser(u);
    setExpiresAt(new Date(exp).getTime());
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      clearLocal();
    }
  }, [clearLocal]);

  // initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // auto-logout exactly when the 40-min session expires
  useEffect(() => {
    if (!expiresAt) return;
    if (timer.current) clearTimeout(timer.current);
    const ms = expiresAt - Date.now();
    if (ms <= 0) {
      clearLocal();
      return;
    }
    timer.current = setTimeout(clearLocal, ms);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [expiresAt, clearLocal]);

  const value = useMemo(
    () => ({ user, loading, expiresAt, refresh, setSession, logout }),
    [user, loading, expiresAt, refresh, setSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
