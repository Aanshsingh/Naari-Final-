// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { registerApi, loginApi, logoutApi, getCurrentUserApi } from "../api/authApi";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await getCurrentUserApi();
        setUser(res.data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    setUser(res.data.data.user);
  };

const register = async (name, email, password, phone, address) => {
  await registerApi({ name, email, password, phone, address });
};

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const loginWithGoogle = async (credential) => {
  const res = await api.post("/auth/google", { credential });
  setUser(res.data.data.user);
};

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);