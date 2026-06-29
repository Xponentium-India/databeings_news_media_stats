/**
 * Tiny fetch wrapper for the admin API.
 * In dev, requests go to /api and Vite proxies them to the Node backend.
 * In prod, set VITE_API_BASE to the deployed backend origin.
 */
const BASE = import.meta.env.VITE_API_BASE ?? "";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  pictureUrl: string | null;
  isAdmin: boolean;
  loginCount: number;
  lastLoginAt: string | null;
}

export interface StatImage {
  id: string;
  language: string;
  period: "Weekly" | "Monthly";
  year: number;
  monthOrWeek: string;
  reportType?: string;
  imagePath: string;
  createdAt: string;
}

/**
 * Resolve an image link from the API. Absolute URLs (S3/R2) are used as-is;
 * relative paths (local /uploads/...) get the API base prefixed for prod.
 */
export const assetUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${BASE}${path}`;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  me: () =>
    request<{ user: AdminUser | null; expiresAt?: string }>("/api/auth/me"),

  googleLogin: (credential: string) =>
    request<{ user: AdminUser; expiresAt: string }>("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    }),

  devLogin: (email: string) =>
    request<{ user: AdminUser; expiresAt: string }>("/api/auth/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }),

  logout: () => request<{ ok: true }>("/api/auth/logout", { method: "POST" }),

  listStats: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ items: StatImage[] }>(`/api/stats${qs ? `?${qs}` : ""}`);
  },

  uploadStat: (form: FormData) =>
    request<{ item: StatImage }>("/api/admin/stats", {
      method: "POST",
      body: form,
    }),

  deleteStat: (id: string) =>
    request<{ ok: true }>(`/api/admin/stats/${id}`, { method: "DELETE" }),
};
