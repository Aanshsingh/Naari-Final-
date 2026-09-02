import { Outlet } from "react-router-dom";
import { AdminAuthProvider } from "../context/AuthContext.jsx";

export default function RootLayout() {
  return (
  
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}