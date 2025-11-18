"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  fullName: string;
  profilePicture: string | null;
  isSeller: boolean;
  isVerified: boolean;
  major: string | null;
  batch: string | null;
  nim: string | null;
  phoneNumber: string | null;
  bio: string | null;
  avgRating: number;
  totalReviews: number;
  totalOrdersCompleted: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  activateSellerMode: (phoneNumber: string, bio: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

if (!API_URL && typeof window !== "undefined") {
  console.error(
    "NEXT_PUBLIC_API_URL is not set! Please check your environment variables."
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Mulai dengan loading true
  const router = useRouter();

  // 1. fetchUserProfile dibuat dengan useCallback
  const fetchUserProfile = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const result = await response.json();
      setUser(result.data); // Set user
      return result.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      localStorage.removeItem("access_token");
      setUser(null); // Hapus user jika gagal
      return null;
    }
  }, []);

  // 2. initAuth juga dibungkus useCallback
  // Ini adalah satu-satunya fungsi yang akan mengontrol loading & fetch
  const initAuth = useCallback(async () => {
    setLoading(true); // Selalu set loading true di awal
    try {
      const token = localStorage.getItem("access_token");

      if (token) {
        await fetchUserProfile(token);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setUser(null);
    } finally {
      setLoading(false); // Set loading false HANYA setelah semua selesai
    }
  }, [fetchUserProfile]);

  // 3. useEffect utama untuk inisialisasi dan listener
  useEffect(() => {
    initAuth(); // Jalankan saat mount

    // Listener ini akan memanggil initAuth (yang mengatur loading)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token") {
        initAuth();
      }
    };

    // Listener ini juga memanggil initAuth
    const handleTokenSet = () => {
      initAuth();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const token = localStorage.getItem("access_token");
        // Jika ada token tapi tidak ada user (misal tab di-restore)
        if (token && !user) {
          initAuth();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tokenSet", handleTokenSet);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenSet", handleTokenSet);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [initAuth, user]); // dependensi 'user' penting untuk 'visibilitychange'

  // Login dengan Google
  const login = () => {
    if (!API_URL) {
      console.error(
        "API_URL is not configured. Cannot redirect to Google OAuth."
      );
      alert("Configuration error: API URL is not set. Please contact support.");
      return;
    }
    window.location.href = `${API_URL}/auth/google`;
  };

  // 5. Perbarui refreshUser agar mengatur loading state
  const refreshUser = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setLoading(true);
      await fetchUserProfile(token);
      setLoading(false);
    }
  };

  // 6. Perbarui activateSellerMode agar mengatur loading state
  const activateSellerMode = async (phoneNumber: string, bio: string) => {
    // State 'isActivating' di halaman /activate sudah cukup
    // TAPI kita juga perlu update user di context, jadi kita panggil refreshUser
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_URL}/users/activate-seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber,
          bio,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to activate seller mode");
      }

      // Langsung update user state dari data balikan
      setUser(result.data);

      router.push("/seller/dashboard");
    } catch (error) {
      console.error("Activate seller error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      router.push("/");
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    activateSellerMode,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
