// src/components/NavbarMobile.jsx

import { IoIosSearch } from "react-icons/io";
import {
  Home,
  ShoppingBag,
  User,
  Grid,
  Heart,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import { useCartStore } from "../../../STORE/CartStore";
import { useWishlistStore } from "../../../STORE/wishlistStore";

const tabs = [
  {
    label: "Home",
    to: "/",
    icon: Home,
  },
  {
    label: "Shop",
    to: "/shop",
    icon: Grid,
  },
  {
    label: "Search",
    to: "/search",
    icon: IoIosSearch,
  },
  {
    label: "Bag",
    to: "/cart",
    icon: ShoppingBag,
  },
  {
    label: "Account",
    to: "/account",
    icon: User,
  },
];

export default function NavbarMobile() {
  const location = useLocation();

  const itemCount = useCartStore((state) =>
    state.items.reduce(
      (sum, item) => sum + item.qty,
      0
    )
  );

  const likedCount = useWishlistStore(
    (state) => state.likedIds.length
  );

  return (
    <>
      {/* =================================================
          FIXED TOP HEADER
      ================================================== */}

      <header className="lg:hidden fixed top-0 left-0 right-0 z-[100] h-[70px] bg-[#0d0e12] border-b border-white/5">

        <div className="relative h-full flex items-center justify-center px-5">

          {/* LOGO - ALWAYS CENTERED */}

          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <h1 className="text-[#D4A34E] text-3xl font-light tracking-wide font-logo">
              Naari
            </h1>
          </Link>
  
          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="absolute right-5 top-1/2 -translate-y-1/2"
          >
            <div className="relative">

              <Heart
                size={21}
                strokeWidth={1.8}
                className="text-white"
              />

              {likedCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4A34E] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {likedCount}
                </span>
              )}

            </div>
          </Link>

        </div>
      </header>


      {/* =================================================
          FIXED BOTTOM NAVIGATION
      ================================================== */}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] h-[64px] bg-[#0d0e12] border-t border-white/10">

        <div className="h-full flex justify-around items-center">

          {tabs.map((tab) => {

            const isActive =
              location.pathname === tab.to ||
              (
                tab.to !== "/" &&
                location.pathname.startsWith(tab.to)
              );

            const Icon = tab.icon;

            return (
              <Link
                key={tab.to}
                to={tab.to}
                className="relative flex flex-col items-center justify-center gap-1 w-16 h-full"
              >

                {/* ICON */}

                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className={
                    isActive
                      ? "text-[#D4A34E]"
                      : "text-gray-400"
                  }
                />

                {/* BAG COUNT */}

                {tab.label === "Bag" &&
                  itemCount > 0 && (
                    <span className="absolute top-1 right-2 bg-[#D4A34E] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}

                {/* LABEL */}

                <span
                  className={`text-[9px] ${
                    isActive
                      ? "text-[#D4A34E]"
                      : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </span>

              </Link>
            );
          })}

        </div>

      </nav>
    </>
  );
}