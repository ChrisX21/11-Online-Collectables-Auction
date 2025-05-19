"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../utils/axios";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/auth/details");
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    try {
      await api.put("/auth/update", data);
      // Update the user data in the context
      if (user) {
        setUser({
          ...user,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        checkAuth,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
