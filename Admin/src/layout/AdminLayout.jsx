// src/admin/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/Sidebar.jsx";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#0d0e12]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}