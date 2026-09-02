// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

import {
  registerApi,
  loginApi,
  logoutApi,
  getCurrentUserApi,
} from "../api/authApi";

import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await getCurrentUserApi();

        setUser(res.data.data);
      } catch (err) {
        // User is not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Normal login
  const login = async (email, password) => {
    try {
      const res = await loginApi({
        email,
        password,
      });

      setUser(res.data.data.user);

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // Register
  const register = async (
    name,
    email,
    password,
    phone,
    address
  ) => {
    try {
      const res = await registerApi({
        name,
        email,
        password,
        phone,
        address,
      });

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  // Google login
  const loginWithGoogle = async (credential) => {
    try {
      const res = await api.post("/auth/google", {
        credential,
      });

      setUser(res.data.data.user);

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);