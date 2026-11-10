import { createContext, useContext, useState, ReactNode } from 'react';

export type User = {
  fullName: string;
  email: string;
  phone: string;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (data: { fullName: string; email: string; phone: string; password: string }) => void;
  logout: () => void;
};

const defaultUser: User = {
  fullName: 'Property Owner',
  email: 'owner@gatedplus.com',
  phone: '+91 98765 43210',
};

const AuthContext = createContext<AuthContextValue>({
  user: defaultUser,
  login: () => {},
  register: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser);

  const login = (email: string, _password: string) => {
    setUser({ fullName: 'Property Owner', email, phone: '' });
  };

  const register = (data: { fullName: string; email: string; phone: string; password: string }) => {
    setUser({ fullName: data.fullName, email: data.email, phone: data.phone });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx;
}
