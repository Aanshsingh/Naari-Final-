// src/components/NavbarDesktop.jsx

import { IoIosSearch } from "react-icons/io";
import { FaShoppingBag, FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCartStore } from "../../../STORE/CartStore";
import { Heart } from "lucide-react";
import { useWishlistStore } from "../../../STORE/wishlistStore";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "SHOP", to: "/shop" },
  { label: "Contact-us", to: "/Contact" },
  { label: "About", to: "/about" },
];

export default function NavbarDesktop() {
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.qty, 0)
  );

  const likedCount = useWishlistStore(
    (state) => state.likedIds.length
  );

  return (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-[100] bg-[#0d0e12] border-b border-white/5">

      <div className="flex justify-between items-center px-14 py-4">

        {/* =========================
            LOGO + NAV LINKS
        ========================= */}

        <div className="flex items-center gap-10">

          <Link to="/">
            <h1 className="text-primary text-3xl font-logo font-light tracking-wide cursor-pointer">
              Naari
            </h1>
          </Link>

          <nav>
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#ABA194] hover:text-[#ECB855] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>


        {/* =========================
            RIGHT SIDE ICONS
        ========================= */}

        <ul className="flex items-center gap-5">

          {/* SEARCH */}

          <li>
            <Link to="/search">
              <IoIosSearch
                size={20}
                className="text-white hover:text-[#ECB855] transition-colors"
              />
            </Link>
          </li>


          {/* CART */}

          <li>
            <Link
              to="/cart"
              className="relative block"
            >
              <FaShoppingBag
                size={18}
                className="text-white hover:text-[#ECB855] transition-colors"
              />

              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4A34E] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </li>


          {/* ACCOUNT */}

          <li>
            <Link to="/account">
              <FaRegUser
                size={18}
                className="text-white hover:text-[#ECB855] transition-colors"
              />
            </Link>
          </li>


          {/* WISHLIST */}

          <li>
            <Link
              to="/wishlist"
              className="relative block"
            >
              <Heart
                size={18}
                className="text-white hover:text-[#ECB855] transition-colors"
              />

              {likedCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4A34E] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {likedCount}
                </span>
              )}
            </Link>
          </li>

        </ul>

      </div>
    </header>
  );
}