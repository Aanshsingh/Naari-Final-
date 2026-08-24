// src/pages/HomeMobile.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Heart, MessageSquarePlus } from "lucide-react";
import { getProductsApi } from "../../../api/productApi";
import { getCategoriesApi } from "../../../api/catogries";
import { getApprovedTestimonialsApi } from "../../../api/TestimonialApi.js";
import { useLikedProducts } from "../../../hook/useLikedProducts";
import TestimonialModal from "../../common/TestimonialModal.jsx";
import { FaInstagram } from "react-icons/fa";

export default function HomeMobile() {
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  const { likedIds, toggleLike } = useLikedProducts();

  const { data: newArrivals, isLoading: newLoading } = useQuery({
    queryKey: ["products", { sort: "newest", limit: 4 }],
    queryFn: () =>
      getProductsApi({ sort: "newest", limit: 4 }).then((res) => res.data.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi().then((res) => res.data.data),
  });

  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => getApprovedTestimonialsApi().then((res) => res.data.data),
  });

  return (
    <div className="bg-[#0d0e12] pb-6">
      {/* Hero — shorter than desktop, no long paragraph */}
      <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
        <Link to="/" className="block w-full h-full">
          <img
            src="/homemobile.png"
            alt="Naari"
            className="w-full h-full object-cover object-[70%_center]"
          />
        </Link>
      </section>

      {/* Category strip — horizontal scroll, no wrap */}
      <section className="px-5 py-6">
        <div className="flex gap-4 overflow-x-auto pb-1">
          {categories?.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 shrink-0"
            >
              <div className="w-12 h-12 rounded-full border border-[#D4A34E]/40 flex items-center justify-center bg-[#14151a]">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-[#D4A34E] text-xs">
                    {cat.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-[9px] tracking-widest text-gray-300 uppercase">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals — 2-column grid, compact */}
      <section className="px-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm text-[#D4A34E] tracking-wide">New Arrivals</h2>
          <Link to="/shop" className="text-[10px] text-gray-400 underline">
            View All
          </Link>
        </div>

        {newLoading && <p className="text-gray-500 text-xs">Loading...</p>}

        <div className="grid grid-cols-2 gap-3">
          {newArrivals?.products?.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product.slug}`}
              className="relative block bg-[#14151a] rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleLike(product._id);
                }}
                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center"
              >
                <Heart
                  size={12}
                  className={
                    likedIds.includes(product._id)
                      ? "text-[#D4A34E] fill-[#D4A34E]"
                      : "text-white"
                  }
                />
              </button>
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="p-2">
                <h3 className="text-white text-[11px] truncate">
                  {product.name}
                </h3>
                <p className="text-[#D4A34E] text-xs mt-0.5">
                  ₹
                  {(product.discountPrice || product.price).toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 mt-8 text-center">
        <div className="flex justify-center items-center gap-2">
          <h2 className="text-[#D4A34E] tracking-widest text-sm">
            CUSTOMER FAVORITES
          </h2>
          <button
            onClick={() => setShowTestimonialModal(true)}
            className="text-gray-400"
          >
            <MessageSquarePlus size={16} />
          </button>
        </div>

        {testimonials?.length === 0 && (
          <p className="text-gray-500 text-xs mt-3">
            Be the first to share your experience.
          </p>
        )}

        <div className="space-y-3 mt-4">
          {testimonials?.slice(0, 2).map((t) => (
            <div key={t._id} className="bg-[#14151a] p-4 rounded-lg text-left">
              <p className="text-[#D4A34E] text-xs">
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </p>
              <p className="text-gray-300 text-xs italic mt-2">"{t.message}"</p>
              <p className="text-gray-500 text-[10px] mt-2 tracking-widest">
                — {t.name.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram — follow link, not a live embed */}
      <section className="px-5 mt-8 text-center">
        <a
          href="https://www.instagram.com/naariethnicbyprerna"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-300 text-xs tracking-widest border border-white/20 rounded-full px-5 py-2.5"
        >
          <FaInstagram size={14} className="text-[#D4A34E]" /> FOLLOW
          @NAARIethnicbyprerna
        </a>
      </section>

      {/* Trust badges — compact single row */}
      <section className="px-5 mt-8 flex justify-between text-[9px] text-gray-500 tracking-widest border-t border-white/10 pt-5">
        <span>AUTHENTIC SILK</span>
        <span>EASY RETURNS</span>
        <span>PAN-INDIA SHIPPING</span>
      </section>

      {showTestimonialModal && (
        <TestimonialModal onClose={() => setShowTestimonialModal(false)} />
      )}
    </div>
  );
}
