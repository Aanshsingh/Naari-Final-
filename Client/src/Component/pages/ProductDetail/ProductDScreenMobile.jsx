// src/pages/product/ProductDetailMobile.jsx
import { useState } from "react";
import { Heart, ChevronDown } from "lucide-react";
import { useProductDetail } from "../../../hook/useProductDetail";

function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-white/10 py-4">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex justify-between items-center text-xs tracking-widest text-gray-300">
        {title}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-2 text-xs text-gray-400 leading-relaxed">{children}</div>}
    </div>
  );
}

export default function ProductDetailMobile() {
  const {
    product, isLoading, isError, related,
    activeImage, setActiveImage,
    selectedSize, setSelectedSize,
    handleAddToBag,
  } = useProductDetail();

  if (isLoading) return <div className="min-h-screen bg-[#0d0e12] text-center py-20 text-gray-400">Loading...</div>;
  if (isError || !product) return <div className="min-h-screen bg-[#0d0e12] text-center py-20 text-red-400">Product not found</div>;

  return (
    <div className="min-h-screen bg-[#0d0e12] pb-24">
      {/* Image */}
      <div className="relative">
        <span className="absolute top-3 left-3 z-10 bg-[#D4A34E] text-black text-[10px] px-2 py-0.5 rounded tracking-widest">
          HERITAGE
        </span>
        <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
          <Heart size={16} className="text-white" />
        </button>
        <img
          src={product.images?.[activeImage]?.url}
          alt={product.name}
          className="w-full aspect-[3/4] object-cover"
        />
        {product.images?.length > 1 && (
          <div className="flex justify-center gap-1.5 py-3">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-1.5 h-1.5 rounded-full ${activeImage === i ? "bg-[#D4A34E]" : "bg-white/20"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pt-4">
        <p className="text-[10px] tracking-[0.3em] text-[#D4A34E]">THE HERITAGE COLLECTION</p>
        <h1 className="text-lg text-white font-light mt-2">{product.name}</h1>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg text-[#D4A34E]">₹{(product.discountPrice || product.price).toLocaleString("en-IN")}</span>
          {product.discountPrice && (
            <>
              <span className="text-gray-500 line-through text-xs">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-[10px] text-green-400">
                {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {product.sizes?.length > 0 && (
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] tracking-widest text-gray-400">SELECT SIZE</p>
              <button className="text-[10px] text-[#D4A34E] underline">SIZE GUIDE</button>
            </div>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSize(s.label)}
                  disabled={s.stock === 0}
                  className={`w-10 h-10 rounded border text-xs ${
                    selectedSize === s.label ? "border-[#D4A34E] text-[#D4A34E]" : "border-white/20 text-gray-300"
                  } ${s.stock === 0 ? "opacity-30" : ""}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <AccordionSection title="FABRIC & CRAFTSMANSHIP">
            Pure mulberry silk with hand-woven zari border. Dry clean only.
          </AccordionSection>
          <AccordionSection title="SHIPPING & RETURNS">
            Ships within 3-5 business days. Easy 7-day returns.
          </AccordionSection>
        </div>

        {related?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm text-[#D4A34E] mb-3">You May Also Adore</h2>
            <div className="grid grid-cols-2 gap-3">
              {related.slice(0, 2).map((p) => (
                <a key={p._id} href={`/product/${p.slug}`} className="block">
                  <div className="aspect-[3/4] rounded overflow-hidden bg-[#14151a]">
                    <img src={p.images?.[0]?.url} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-white text-xs mt-1 truncate">{p.name}</p>
                  <p className="text-[#D4A34E] text-xs">₹{(p.discountPrice || p.price).toLocaleString("en-IN")}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0d0e12] border-t border-white/10 px-5 py-3 flex gap-3">
        <button className="flex-1 py-3 rounded border border-[#D4A34E] text-[#D4A34E] text-xs tracking-widest">
          WISHLIST
        </button>
        <button
          onClick={handleAddToBag}
          className="flex-1 py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-xs tracking-widest font-medium"
        >
          ADD TO BAG
        </button>
      </div>
    </div>
  );
}