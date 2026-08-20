import { Outlet } from "react-router-dom";
import { AdminAuthProvider } from "../context/AuthContext.jsx";
import AdminSidebar from "../components/Sidebar.jsx";

export default function RootLayout() {
  return (
  
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}