// client/src/components/Footer.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
// import { subscribeNewsletterApi } from "../api/marketingApi";

export default function Footer() {
//   const [email, setEmail] = useState("");
//   const [status, setStatus] = useState("");

//   const handleSubscribe = async (e) => {
//     e.preventDefault();
//     try {
//       await subscribeNewsletterApi(email);
//       setStatus("Subscribed!");
//       setEmail("");
//     } catch (err) {
//       setStatus(err.response?.data?.message || "Could not subscribe");
//     }
//   };

  return (
    <footer className="bg-[#0d0e12] border-t border-white/10 px-5 lg:px-16 py-10 pb-28 lg:pb-10">
      <div className="lg:grid lg:grid-cols-4 lg:gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <h3 className="text-[#D4A34E] text-lg tracking-wide">Naari</h3>
          <p className="text-gray-500 text-xs mt-3 leading-relaxed">
            Curating the finest Indian heritage craftsmanship for the modern
            global woman. Festive elegance in every weave.
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.instagram.com/naariethnicbyprerna"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#D4A34E]"
            >
              <FaInstagram size={16} />
            </a>
            <a href="/contact" className="text-gray-400 hover:text-[#D4A34E]">
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Shop links */}
        <div className="mt-8 lg:mt-0">
          <p className="text-gray-400 text-xs tracking-widest mb-3">SHOP</p>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li>
              <Link to="/shop?category=sarees" className="hover:text-[#D4A34E]">
                Sarees
              </Link>
            </li>
            <li>
              <Link to="/shop?category=kurtis" className="hover:text-[#D4A34E]">
                Kurtis
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-[#D4A34E]">
                All Collections
              </Link>
            </li>
          </ul>
        </div>

        {/* Support links */}
        <div className="mt-8 lg:mt-0">
          <p className="text-gray-400 text-xs tracking-widest mb-3">SUPPORT</p>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li>
              <Link to="/contact" className="hover:text-[#D4A34E]">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-[#D4A34E]">
                Track Order
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-[#D4A34E]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-[#D4A34E]">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        {/* <div className="mt-8 lg:mt-0">
          <p className="text-gray-400 text-xs tracking-widest mb-3">
            STAY IN TOUCH
          </p>
          <p className="text-gray-500 text-xs mb-3">
            Festive styling guides and early access to new collections.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="bg-transparent border-b border-white/20 text-white text-sm py-2 outline-none focus:border-[#D4A34E]"
            />
            <button
              type="submit"
              className="text-xs text-[#D4A34E] underline self-start"
            >
              Subscribe
            </button>
            {status && <p className="text-gray-500 text-[10px]">{status}</p>}
          </form>
        </div> */}
      </div>

      <p className="text-center text-[10px] text-gray-600 mt-10">
        © {new Date().getFullYear()} Naari ethnic by prerna. All Rights Reserved.
      </p>
    </footer>
  );
}
