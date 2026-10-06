import { createContext, useContext, useState, useEffect } from "react";

import {
  loginApi,
  logoutApi,
  getCurrentUserApi,
} from "../api/authApi";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // CHECK LOGIN
  // =========================================================

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await getCurrentUserApi();

        const user = res.data.data;

        if (user?.role === "admin") {
          setAdmin(user);
        } else {
          setAdmin(null);
          localStorage.removeItem("adminAccessToken");
        }
      } catch (error) {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (email, password) => {
    try {
      const res = await loginApi({
        email,
        password,
      });

      const user = res.data.data.user;
      const accessToken = res.data.data.accessToken;

      // Check admin role
      if (user?.role !== "admin") {
        await logoutApi();

        localStorage.removeItem("adminAccessToken");

        throw {
          response: {
            data: {
              message: "This account does not have admin access",
            },
          },
        };
      }

      // =====================================================
      // IMPORTANT:
      // Save JWT for Admin API requests
      // =====================================================

      if (accessToken) {
        localStorage.setItem(
          "adminAccessToken",
          accessToken
        );
      }

      setAdmin(user);

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Remove Admin JWT
      localStorage.removeItem("adminAccessToken");

      // Remove Admin from state
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () =>
  useContext(AdminAuthContext);