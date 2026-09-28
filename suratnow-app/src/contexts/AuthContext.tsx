import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "../lib/api";

type Role = "superadmin" | "admin" | "petugas" | "user" | null;

interface User {
  id: number;
  email: string;
  name: string;
  nik: string;
  phone: string;
  role: Role;
  address?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.get("/user");
        setUser(response.data);
        setRole(response.data.role);
      } catch {
        setUser(null);
        setRole(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setRole(userData.role);
  };

  const signOut = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      setRole(null);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, role, isLoading, isAuthenticated, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
