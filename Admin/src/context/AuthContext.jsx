import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, logoutApi, getCurrentUserApi } from "../api/authApi";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await getCurrentUserApi();
        const user = res.data.data;
        setAdmin(user.role === "admin" ? user : null); // silently ignore a valid session that isn't an admin
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const user = res.data.data.user;
    if (user.role !== "admin") {
      await logoutApi(); // they had valid credentials but aren't an admin — clear the cookie immediately
      throw { response: { data: { message: "This account does not have admin access" } } };
    }
    setAdmin(user);
  };

  const logout = async () => {
    await logoutApi();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
