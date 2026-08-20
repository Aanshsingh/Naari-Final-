// src/pages/Home.jsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Heart, Gem, Crown, Sparkles, Shirt, Watch } from "lucide-react";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { ShieldCheck,Truck } from "lucide-react";

import {getProductsApi} from "../../../api/productApi";
import { getCategoriesApi } from "../../../api/catogries";
import Productlist from "./ProductList.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { getApprovedTestimonialsApi } from "../../../api/TestimonialApi.js";
import TestimonialModal from "../../common/TestimonialModal.jsx";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import heroimage from "../../../photos/home1.png";

const categoryIcons = {
  sarees: Sparkles,
  kurtis: Shirt,
  lehengas: Crown,
  suits: Watch,
  accessories: Gem,
};


export default function HomeScreenDesktop() {
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", { sort: "newest", limit: 4 }],
    queryFn: () =>
      getProductsApi({ sort: "newest", limit: 4 }).then((res) => res.data.data),
  });

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi().then((res) => res.data.data),
  });

  const { data: testimonials } = useQuery({
  queryKey: ["testimonials"],
  queryFn: () => getApprovedTestimonialsApi().then((res) => res.data.data),
});

  return (
    <div className="bg-[#0d0e12]">
      {/* Hero */}
      <section className="relative h-[100vh]  mt-5  border-t-2 border-t-surface">
        
        <img
          src={heroimage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-black/30 to-black/10" />

        <div className="absolute bottom-25 left-6 lg:left-16 right-6 lg:right-auto lg:max-w-md">
          <h1 className="text-3xl lg:text-4xl tracking-wide text-[#F0D68A] font-light">
            Festive Edit — New In
          </h1>
          <p className="hidden lg:block mt-3 text-gray-300 text-sm">
            Curated craftsmanship for the modern woman. Discover the harmony of
            tradition and luxury.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-5 px-8 py-3 bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest rounded"
          >
            SHOP NEW ARRIVALS
          </Link>
        </div>
      </section>

      {/* Category strip */}
      <section className="px-6 lg:px-16 py-10">
        <div className="flex justify-between  overflow-x-auto">
          {categoriesLoading && (
            <p className="text-gray-500 text-sm">Loading categories...</p>
          )}
          {categories?.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Gem;
            return (
              <Link
                key={cat._id}
                to={`/shop?category=${cat._id}`}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                <div className="w-40 h-40 rounded-lg border border-[#D4A34E]/40 hover:border-primary flex items-center justify-center">
                  <div className="bg-surface h-36 w-36 flex align-center justify-center pt-10 rounded-lg">
                    {" "}
                    <Icon size={45} className="text-[#D4A34E]" />
                  </div>
                </div>
                <span className="text-[18px] tracking-widest text-gray-300 uppercase">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="px-6 lg:px-16 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl text-[#D4A34E] tracking-wide">New Arrivals</h2>
            <p className="hidden lg:block text-sm text-gray-500 mt-1">
              The latest from our artisan workshop
            </p>
          </div>
          <Link to="/shop" className="hidden lg:block text-xs tracking-widest text-[#D4A34E] underline hover:font-bold">
            VIEW ALL
          </Link>
        </div>
       <Swiper
  modules={[EffectCoverflow, Navigation, Pagination]}
  effect="coverflow"
  loop
  centeredSlides
  // navigation
  pagination={{ clickable: true }}
  breakpoints={{
    0: {
      slidesPerView: 1.5,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 25,
    },
    1024: {
      slidesPerView: 2.5,
      spaceBetween: 30,
    },
  }}
>
  {productsData?.products?.map((product) => (
    <SwiperSlide key={product._id}>
      <Link
        to={`/product/${product.slug}`}
        className="group block bg-[#14151a] rounded-xl overflow-hidden"
      >
        <div className="relative hover:border-primary">
          <span className="absolute top-3 left-3 z-10 bg-[#D4A34E] text-black text-xs px-2 py-1 rounded">
            NEW
          </span>

          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center"
          >
            <Heart size={16} className="text-white" />
          </button>

          <img
            src={
              product.images?.[0]?.url ||
              "https://placehold.co/600x800/14151A/F0D68A?text=NAARI"
            }
            alt={product.name}
            className="w-full aspect-3/4 object-cover group-hover:scale-105 transition duration-500"
          />
        </div>

        <div className="p-4">
          <h3 className="text-white text-sm font-medium">
            {product.name}
          </h3>

          <p className="text-[#D4A34E] mt-2">
            ₹{(product.discountPrice || product.price).toLocaleString("en-IN")}
          </p>
        </div>
      </Link>
    </SwiperSlide>
  ))}
</Swiper>

      </section>

      {/* Desktop: Customer Favorites — static for now, wire to real reviews in Week 3 */}
      <section className="hidden lg:block bg-[#111217] py-16 px-16">
  <div className="flex justify-center items-center gap-3 mb-10">
    <h2 className="text-center text-2xl text-[#D4A34E] tracking-wide">Customer Favorites</h2>
    <button
      onClick={() => setShowTestimonialModal(true)}
      className="text-gray-400 hover:text-[#D4A34E] transition-colors"
      title="Write a comment"
    >
      <MessageSquarePlus size={20} />
    </button>
  </div>

  {testimonials?.length === 0 && (
    <p className="text-center text-gray-500 text-sm">Be the first to share your experience.</p>
  )}

  <div className="grid grid-cols-3 gap-6">
    {testimonials?.slice(0, 3).map((t) => (
      <div key={t._id} className="bg-[#0d0e12] p-6 rounded-lg text-center">
        <p className="text-[#D4A34E] text-sm mb-3">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</p>
        <p className="text-gray-300 text-sm italic">"{t.message}"</p>
        <p className="text-gray-500 text-xs mt-4 tracking-widest">— {t.name.toUpperCase()}</p>
      </div>
    ))}
  </div>
</section>

{showTestimonialModal && <TestimonialModal onClose={() => setShowTestimonialModal(false)} />}
Mobile — add the icon near your existing Instagram-community block

 
      

      {/* Desktop: As seen on Instagram — grayscale strip */}
      <section className="hidden lg:block px-16 py-12">
        <p className="text-center text-xs tracking-widest text-gray-500 mb-6">
          AS SEEN ON INSTAGRAM
        </p>
       <div className="grid grid-cols-4 gap-4">
  {[
    <img src="https://placehold.co/600x800/14151A/F0D68A?text=NAARI" alt="" />,
    <img src="https://placehold.co/600x800/14151A/F0D68A?text=NAARI" alt="" />,
    <img src="https://placehold.co/600x800/14151A/F0D68A?text=NAARI" alt="" />,
    <img src="https://placehold.co/600x800/14151A/F0D68A?text=NAARI" alt="" />,
  ].map((img, index) => (
    <div
      key={index}
      className="aspect-square overflow-hidden rounded"
    >
      {img}
    </div>
  ))}
</div>
      </section>

      {/* Trust badges */}
      <section className="border-t border-white/10 px-6 lg:px-16 py-8">
        <div className="flex flex-wrap justify-center lg:justify-between gap-6 text-s font-bold text-[#D1C4B1] tracking-widest">
          <span className="flex gap-2"> <ShieldCheck size={22} />  AUTHENTIC SILK</span>
         
         
          <span className=" flex gap-2"> <HiOutlineCheckBadge size={22}/> HANDPICKED FABRICS</span>
          <span className="flex gap-2 "><Truck size={22}/> PAN-INDIA SHIPPING</span>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 lg:px-16 py-10">
        <div className="lg:flex lg:justify-between">
          <div className="lg:max-w-xs">
            <h3 className="text-[#D4A34E] text-lg tracking-wide">Naari</h3>
            <p className="text-gray-500 text-xs mt-3 leading-relaxed">
              Curating the finest Indian heritage craftsmanship for the modern
              global woman. Festive elegance in every weave.
            </p>
          </div>
          <div className="hidden lg:flex gap-16 text-xs">
            <div>
              <p className="text-gray-400 tracking-widest mb-3">SERVICE</p>
              <ul className="space-y-2 text-gray-500">
                <li>Returns</li>
                <li>COD Policy</li>
                <li>Fabric Care</li>
                <li>Delivery Info</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-400 tracking-widest mb-3">COMPANY</p>
              <ul className="space-y-2 text-gray-500">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Use</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-10">
          © 2026 Naari Ethnic Wear. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
