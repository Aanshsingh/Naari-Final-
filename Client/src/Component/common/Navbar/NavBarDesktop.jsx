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
    state.items.reduce((sum, i) => sum + i.qty, 0),
  );

  const likedCount = useWishlistStore((state)=> state.likedIds.length);

  return (
    <div className="hidden lg:flex justify-between items-center px-14 py-4 bg-[#0d0e12]">
      <div className="flex items-center gap-10">
        <Link to="/">
          <h1 className="text-primary text-3xl font-light tracking-wide cursor-pointer">
            Naari
          </h1>
        </Link>

        <ul className="flex gap-6">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-sm text-[#ABA194] cursor-pointer hover:text-[#ECB855] transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <ul className="flex items-center gap-5">
        <li>
          <Link to="/search">
            <IoIosSearch size={20} className="text-white" />
          </Link>
        </li>
        <li>
          <Link to="/cart" className="relative block">
            <FaShoppingBag size={18} className="text-white" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4A34E] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </li>
        <li>
          <Link to="/account">
            <FaRegUser size={18} className="text-white" />
          </Link>
        </li>
        <li>
          <Link to="/wishlist" className="relative block">
            <Heart size={18} className="text-white" />
            {likedCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4A34E] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {likedCount}
              </span>
            )}
          </Link>
        </li>
      </ul>
    </div>
  );
}
