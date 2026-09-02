// admin/src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0d0e12]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0">
        {/* Mobile top bar — only visible below lg breakpoint */}
        <div className="lg:hidden flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-300">
            <Menu size={22} />
          </button>
          <h1 className="text-[#D4A34E] text-base font-light">Naari Admin</h1>
        </div>

        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}