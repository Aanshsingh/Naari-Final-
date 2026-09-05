// src/pages/product/ProductDetailDesktop.jsx
import { useState } from "react";
import {
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useProductDetail } from "../../../hook/useProductDetail";
import ZoomImage from "../../common/zoom";
import ProductBadge from "../../common/ProductBadge.jsx"; // ← add this import

function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-white/10 py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center text-sm tracking-widest text-gray-300"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-3 text-sm text-gray-400 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailDesktop() {
  const {
    product,
    isLoading,
    isError,
    related,
    activeImage,
    setActiveImage,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    handleAddToBag,
  } = useProductDetail();

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#0d0e12] text-center py-32 text-gray-400">
        Loading...
      </div>
    );
  if (isError || !product)
    return (
      <div className="min-h-screen bg-[#0d0e12] text-center py-32 text-red-400">
        Product not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0d0e12] px-16 py-10">
      <div className="grid grid-cols-2 gap-16">
        {/* Left: gallery */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-20 rounded overflow-hidden border ${activeImage === i ? "border-[#D4A34E]" : "border-white/10"}`}
              >
                <ZoomImage
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <div className="relative flex-1 rounded-lg overflow-hidden bg-[#14151a]">
            {/* BADGE — added here, on the main image container */}
            <ProductBadge badge={product.effectiveBadge} />
            <img
              src={
                product.images?.[activeImage]?.url ||
                "https://placehold.co/600x800/14151A/F0D68A?text=NAARI"
              }
              alt={product.name}
              className="w-full h-[600px] object-cover"
            />
          </div>
        </div>

        {/* Right: details */}
        <div>
          <p className="text-xs tracking-[0.3em] text-[#D4A34E]">
            HANDCRAFTED HERITAGE
          </p>
          <h1 className="text-3xl text-white font-light mt-3">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl text-[#D4A34E]">
              ₹{product.effectivePrice.toLocaleString("en-IN")}
            </span>
            {product.isOnSale && (
              <span className="text-gray-500 line-through text-sm">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="text-gray-400 text-sm mt-4 leading-relaxed">
            {product.description}
          </p>

          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="text-xs tracking-widest text-gray-400 mb-3">
                SELECT COLOUR
              </p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c.name)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === c.name ? "border-[#D4A34E]" : "border-white/20"}`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs tracking-widest text-gray-400">
                  SELECT SIZE
                </p>
                <button className="text-xs text-[#D4A34E] underline">
                  SIZE GUIDE
                </button>
              </div>
              <div className="flex gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedSize(s.label)}
                    className={`w-11 h-11 rounded border text-sm ${
                      selectedSize === s.label
                        ? "border-[#D4A34E] text-[#D4A34E]"
                        : "border-white/20 text-gray-300"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToBag}
            className="w-full mt-8 py-4 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-[0.2em] font-medium cursor-pointer"
          >
            ADD TO BAG
          </button>
          <button className="w-full mt-3 py-4 rounded border border-[#D4A34E] text-[#D4A34E] text-sm tracking-[0.2em] flex items-center justify-center gap-2">
            <Heart size={16} /> WISHLIST ITEM
          </button>

          <div className="mt-8">
            <AccordionSection title="FABRIC & CARE">
              {product.fabricCare || "Details coming soon for this piece."}
            </AccordionSection>
            <AccordionSection title="SHIPPING & RETURNS">
              ⚠️ NO COMPLETE OPENING VIDEO = NO DAMAGE/EXCHANGE CLAIM. We accept
              exchanges ONLY in case of a genuine manufacturing defect — not for
              colour preference, fabric preference, change of mind, or any
              damage caused after opening/wearing the product.
            </AccordionSection>
          </div>
        </div>
      </div>

      {/* Heritage banner */}
      <div className="mt-20 bg-[#14151a] rounded-lg py-14 px-10 text-center">
        <ShieldCheck className="mx-auto text-[#D4A34E]" size={28} />
        <h2 className="text-2xl text-[#D4A34E] font-light mt-4">
          The Legacy of 1,000 Threads
        </h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mt-3 leading-relaxed">
          Every Naari saree is a labor of love, taking up to 300 hours for a
          master weaver to complete. Our silk is sourced from the finest
          mulberry farms, and our gold zari ensures your heirloom piece remains
          as brilliant as the day it was woven.
        </p>
        <div className="flex justify-center gap-16 mt-8">
          <div>
            <p className="text-xl text-white">400+</p>
            <p className="text-xs text-gray-500 tracking-widest">ARTISANS</p>
          </div>
          <div>
            <p className="text-xl text-white">100%</p>
            <p className="text-xs text-gray-500 tracking-widest">PURE SILK</p>
          </div>
          <div>
            <p className="text-xl text-white">24K</p>
            <p className="text-xs text-gray-500 tracking-widest">GOLD ZARI</p>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related?.length > 0 && (
        <div className="mt-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-[#D4A34E]">You May Also Adore</h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-gray-400">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-gray-400">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {related.map((p) => (
              <a key={p._id} href={`/product/${p.slug}`} className="block">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#14151a]">
                  <img
                    src={
                      p.images?.[0]?.url ||
                      "https://placehold.co/600x800/14151A/F0D68A?text=NAARI"
                    }
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white text-sm mt-2">{p.name}</p>
                <p className="text-[#D4A34E] text-sm">
                  ₹{(p.discountPrice || p.price).toLocaleString("en-IN")}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}