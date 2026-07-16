/**
 * Authentication Context
 * Manages login state, JWT token, and user data across the application
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ============================================================
// TYPES
// ============================================================

export interface Branch {
  id_cabang: string;
  nama_cabang: string;
  wilayah: string;
}

export interface User {
  id_user: string;
  nama: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Kurir';
  id_cabang: string | null;
  courier_id?: string | null; // For Kurir users
  branch?: Branch | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getToken: () => string | null;
  refreshUser: () => Promise<void>; // Refresh user data to get latest courier_id
}

// ============================================================
// CONSTANTS
// ============================================================

const TOKEN_KEY = 'laundrot_auth_token';
const USER_KEY = 'laundrot_auth_user';

// ============================================================
// CONTEXT
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// PROVIDER
// ============================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(() => {
    // Restore from localStorage on init
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const user = userStr ? (JSON.parse(userStr) as User) : null;

    // DEBUG: Log restored user
    if (user) {
      console.log('[AuthContext] Restored user from localStorage:', {
        id_user: user.id_user,
        nama: user.nama,
        role: user.role,
        id_cabang: user.id_cabang,
        courier_id: user.courier_id,
      });
    }

    return {
      isAuthenticated: !!token && !!user,
      user,
      token,
      isLoading: false,
    };
  });

  /**
   * Refresh user data - fetches latest courier_id from backend
   * Call this after login to ensure courier_id is correctly set
   */
  const refreshUser = useCallback(async () => {
    const token = state.token || localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.user) {
        // Update localStorage with fresh data
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setState((prev) => ({
          ...prev,
          user: data.user,
        }));
        console.log('[AuthContext] User refreshed:', {
          courier_id: data.user.courier_id,
        });
      }
    } catch (err) {
      console.error('[AuthContext] Failed to refresh user:', err);
    }
  }, [state.token]);

  /**
   * Login function - calls backend API
   */
  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }

      // Store token and user data
      const { token, user } = data.data;

      // DEBUG: Log login response
      console.log('[AuthContext] Login response:', {
        id_user: user.id_user,
        nama: user.nama,
        role: user.role,
        id_cabang: user.id_cabang,
        courier_id: user.courier_id,
      });

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      setState({
        isAuthenticated: true,
        user,
        token,
        isLoading: false,
      });

      // If Kurir but courier_id is null, try to refresh
      if (user.role === 'Kurir' && !user.courier_id) {
        console.log('[AuthContext] Kurir without courier_id, refreshing...');
        await refreshUser();
      }

      return { success: true };
    } catch (error) {
      console.error('[Auth] Login error:', error);
      return { success: false, error: 'Tidak dapat terhubung ke server. Pastikan server backend berjalan.' };
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [refreshUser]);

  /**
   * Logout function - clears token and user data
   */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
  }, []);

  /**
   * Get current token
   */
  const getToken = useCallback(() => {
    return state.token || localStorage.getItem(TOKEN_KEY);
  }, [state.token]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    getToken,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================
// HOOK
// ============================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ============================================================
// API HELPER
// ============================================================

/**
 * Helper function to make authenticated API requests
 */
export async function authFetch(
  url: string,
  options: RequestInit = {},
  token: string | null
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
