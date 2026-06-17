import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type AuthContextType = {
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount to persist login
    const storedUser = localStorage.getItem('iasset_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('iasset_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('iasset_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
