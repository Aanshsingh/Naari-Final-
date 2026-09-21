// client/src/components/MobileSideDrawer.jsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { X, ChevronRight, User, Heart, Package } from "lucide-react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { getCategoriesApi } from "../../../api/catogries.js";
import { FaInstagram } from "react-icons/fa6";

export default function MobileSideDrawer({ isOpen, onClose }) {
  const { user } = useAuth();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi().then((res) => res.data.data),
    enabled: isOpen, // only fetch once the drawer is actually opened
  });

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-[85%] max-w-xs bg-[#0d0e12] border-r border-white/10 z-50
          overflow-y-auto transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 pt-6 pb-4">
          <h1 className="text-2xl tracking-[0.15em] text-[#F0D68A] font-light">NAARI</h1>
          <button onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>
        <p className="px-5 text-[10px] tracking-[0.3em] text-gray-500 -mt-2 mb-5">
          THE ETHNIC STORE
        </p>

        {/* Greeting */}
        <div className="px-5 pb-5 border-b border-white/10">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#14151a] border border-[#D4A34E]/40 flex items-center justify-center">
                <User size={16} className="text-[#D4A34E]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs">Namaste,</p>
                <p className="text-white text-sm">{user.name}</p>
              </div>
              <Link to="/account" onClick={onClose} className="text-xs text-[#D4A34E] underline">
                Profile
              </Link>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={onClose}
              className="block text-center py-2.5 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-xs tracking-widest"
            >
              LOGIN / SIGN UP
            </Link>
          )}
        </div>

        {/* Curated collections */}
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-[10px] tracking-[0.3em] text-gray-500 mb-3">COLLECTIONS</p>

          <Link
            to="/shop?sort=newest"
            onClick={onClose}
            className="flex justify-between items-center py-2.5 text-sm text-gray-200"
          >
            New Arrivals
            <ChevronRight size={14} className="text-gray-600" />
          </Link>

          <p className="text-sm text-gray-200 py-2.5">Sarees</p>
          {categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/shop?category=${cat.slug}`}
                  onClick={onClose}
                  className="text-[11px] border border-white/20 rounded-full px-3 py-1.5 text-gray-300"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/shop"
            onClick={onClose}
            className="flex justify-between items-center py-2.5 text-sm text-gray-200 border-t border-white/5 mt-1"
          >
            Shop All
            <ChevronRight size={14} className="text-gray-600" />
          </Link>
        </div>

        {/* Account shortcuts */}
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-[10px] tracking-[0.3em] text-gray-500 mb-3">MY ACCOUNT</p>

          <Link
            to="/orders"
            onClick={onClose}
            className="flex items-center gap-3 py-2.5 text-sm text-gray-200"
          >
            <Package size={16} className="text-gray-500" /> Track Order
          </Link>

          <Link
            to="/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 py-2.5 text-sm text-gray-200"
          >
            <Heart size={16} className="text-gray-500" /> Saved Wishlist
          </Link>
        </div>

        {/* Social */}
        <div className="px-5 py-5">
          <a
            href="https://www.instagram.com/naariethnicbyprerna"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs tracking-widest text-gray-400"
          >
            <FaInstagram size={14} className="text-[#D4A34E]" /> INSTAGRAM
          </a>
        </div>

        <p className="px-5 pb-6 pt-4 text-[10px] text-gray-600 border-t border-white/5">
          © {new Date().getFullYear()} Naari Ethnic Wear
        </p>
      </aside>
    </>
  );
}