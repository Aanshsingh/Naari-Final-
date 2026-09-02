// admin/src/components/AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Image, Star, ShoppingBag, TrendingUp, Grid, Mail, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Products", to: "/products", icon: Package },
  { label: "Categories", to: "/categories", icon: Grid },
  { label: "Banners", to: "/banners", icon: Image },
  // { label: "Instagram", to: "/instagram" },
  { label: "Reviews", to: "/reviews", icon: Star },
  { label: "Testimonials", to: "/testimonials", icon: Star },
  { label: "Orders", to: "/orders", icon: ShoppingBag },
  { label: "Marketing", to: "/marketing", icon: Mail },
  { label: "Sales", to: "/sales", icon: TrendingUp },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Backdrop — mobile only, closes sidebar on tap outside */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full w-56 shrink-0 bg-[#111217] border-r border-white/5 py-6 z-50
          transform transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <div className="px-6 mb-8 flex justify-between items-center">
          <h1 className="text-[#D4A34E] text-xl font-light tracking-wide">Naari Admin</h1>
          <button onClick={onClose} className="lg:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-6 py-3 text-sm ${
                  isActive
                    ? "text-[#D4A34E] border-l-2 border-[#D4A34E] bg-white/5"
                    : "text-gray-400 border-l-2 border-transparent hover:text-gray-200"
                }`}
              >
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}