"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/services/api';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Helper to check token validity
const isTokenValid = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token && isTokenValid(token)) {
         try {
             // Ideally fetch full user profile here if token doesn't have all data or to verify validity
             const res = await api.get('/auth/me');
             setUser(res.data);
         } catch (error) {
             console.error("Failed to load user", error);
             localStorage.removeItem('token');
             setUser(null);
         }
      } else {
         localStorage.removeItem('token');
         setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
    });
    
    // Redirect based on role
    if (data.role === 'ADMIN') router.push('/dashboard/admin');
    else if (data.role === 'PROVIDER') router.push('/dashboard/provider');
    else router.push('/dashboard/client');
  };

  const register = async (credentials: RegisterCredentials) => {
    const { data } = await api.post<AuthResponse>('/auth/register', credentials);
    localStorage.setItem('token', data.token);
    setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
    });
    
    if (data.role === 'PROVIDER') router.push('/dashboard/provider');
    else router.push('/dashboard/client');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
