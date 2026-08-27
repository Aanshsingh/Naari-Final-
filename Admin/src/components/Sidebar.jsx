// src/admin/components/AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Image, Star, ShoppingBag, TrendingUp,  Film  } from "lucide-react";
import { ListSortAscending } from "lucide-react";
const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Products", to: "/products", icon: Package },
  { label: "Banners", to: "/banners", icon: Image },
  { label: "Reviews", to: "/reviews", icon: Star },
  { label: "Orders", to: "/orders", icon: ShoppingBag },
  { label: "Sales", to: "/sales", icon: TrendingUp },
  {label:  "Categories", to: "/categories", icon: ListSortAscending},
  {label:  "InstaReel", to: "/instagram", icon:  Film  },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-56 shrink-0 bg-[#111217] border-r border-white/5 py-6">
      <div className="px-6 mb-8">
        <h1 className="text-[#D4A34E] text-xl font-light tracking-wide">Naari Admin</h1>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
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
  );
}