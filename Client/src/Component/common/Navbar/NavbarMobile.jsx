// src/components/NavbarMobile.jsx
import { IoIosSearch } from "react-icons/io";
import { Home, ShoppingBag, User, Grid } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "../../../STORE/CartStore";
import { Heart } from "lucide-react";
import { useWishlistStore } from "../../../STORE/wishlistStore";

const tabs = [
  { label: "Home", to: "/", icon: Home },
  { label: "Shop", to: "/shop", icon: Grid },
  { label: "Search", to: "/search", icon: IoIosSearch },
  { label: "Bag", to: "/cart", icon: ShoppingBag },
  { label: "Account", to: "/account", icon: User },
];

export default function NavbarMobile() {
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.qty, 0),
  );
  const location = useLocation();
   const likedCount = useWishlistStore((state)=> state.likedIds.length); 

  return (
    <>
      {/* Top bar — just branding */}
      <div className="lg:hidden flex justify-between items-center px-5 py-4 bg-[#0d0e12] border-b border-white/5">
        <div className="w-6" /> {/* spacer to keep logo visually centered */}
        <Link to="/">
          <h1 className="text-primary text-2xl font-light tracking-wide">
            Naari
          </h1>
        </Link>
        <Link to="/wishlist" className="relative">
          <Heart size={20} className="text-white" />
          {likedCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#D4A34E] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {likedCount}
            </span>
          )}
        </Link>
      </div>

      {/* Bottom tab bar — all navigation happens here */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0d0e12] border-t border-white/10 flex justify-around items-center py-2 z-50">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="relative flex flex-col items-center gap-1 px-2"
            >
              <Icon
                size={20}
                className={isActive ? "text-[#D4A34E]" : "text-gray-400"}
              />
              {tab.label === "Bag" && itemCount > 0 && (
                <span className="absolute -top-1 right-0 bg-[#D4A34E] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span
                className={`text-[9px] ${isActive ? "text-[#D4A34E]" : "text-gray-500"}`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
