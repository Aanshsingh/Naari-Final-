// src/pages/product/ProductDetailMobile.jsx

import { useEffect, useState } from "react";
import { Heart, ChevronDown, ImageOff } from "lucide-react";
import { useProductDetail } from "../../../hook/useProductDetail";
import { useLikedProducts } from "../../../hook/useLikedProducts";
import ProductBadge from "../../common/ProductBadge.jsx";
import { Link } from "react-router-dom";

function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-white/10 py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center text-xs tracking-widest text-gray-300"
      >
        <span>{title}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="mt-2 text-xs text-gray-400 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailMobile() {
  const {
    product,
    isLoading,
    isError,
    related,
    activeImage,
    setActiveImage,
    selectedSize,
    setSelectedSize,
    handleAddToBag,
  } = useProductDetail();

  const [wishlist, setWishlist] = useState(false);
  const { likedIds, toggleLike } = useLikedProducts();

  useEffect(() => {
    setActiveImage(0);
  }, [product?._id, setActiveImage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center text-red-400">
        Product not found
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="min-h-screen bg-[#0d0e12] pb-40">
      <div className="relative overflow-hidden">
        {/* BADGE */}
        <ProductBadge badge={product.effectiveBadge} />

        {/* WISHLIST HEART */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleLike(product._id);
            setWishlist((prev) => !prev);
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

        {/* IMAGE SLIDER */}
        {images.length > 0 ? (
          <div
            className="w-full overflow-hidden touch-pan-y"
            onTouchStart={(e) => {
              e.currentTarget.dataset.startX = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const startX = Number(e.currentTarget.dataset.startX || 0);
              const endX = e.changedTouches[0].clientX;
              const difference = startX - endX;

              if (difference > 50) {
                setActiveImage((prev) => Math.min(prev + 1, images.length - 1));
              }
              if (difference < -50) {
                setActiveImage((prev) => Math.max(prev - 1, 0));
              }
            }}
          >
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${activeImage * 100}%)` }}
            >
              {images.map((img, index) => (
                <div
                  key={img.publicId || img.url || index}
                  className="min-w-full aspect-[3/4] bg-[#14151a]"
                >
                  <img
                    src={img.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover select-none"
                    draggable="false"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="aspect-[3/4] bg-[#14151a] flex flex-col items-center justify-center text-gray-600">
            <ImageOff size={32} />
            <p className="text-xs mt-2">No image available</p>
          </div>
        )}

        {/* IMAGE DOTS */}
        {images.length > 1 && (
          <div className="flex justify-center items-center gap-1.5 py-3">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`View image ${i + 1}`}
                onClick={() => setActiveImage(i)}
                className={`rounded-full transition-all duration-200 ${
                  activeImage === i
                    ? "w-4 h-1.5 bg-[#D4A34E]"
                    : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="px-5 pt-4">
        <h1 className="text-lg text-white font-light mt-2">{product.name}</h1>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg text-[#D4A34E]">
            ₹{product.effectivePrice.toLocaleString("en-IN")}
          </span>

          {product.isOnSale && (
            <>
              <span className="text-gray-500 line-through text-xs">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-green-400">
                {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* SIZE SELECTION */}
        {product.sizes?.length > 0 && (
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] tracking-widest text-gray-400">SELECT SIZE</p>
              <button type="button" className="text-[10px] text-[#D4A34E] underline">
                SIZE GUIDE
              </button>
            </div>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSelectedSize(s.label)}
                  className={`w-10 h-10 rounded border text-xs transition ${
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

        {/* ACCORDIONS */}
        <div className="mt-6">
          <AccordionSection title="FABRIC & CARE">
            {product.fabricCare || "Details coming soon for this piece."}
          </AccordionSection>

          <AccordionSection title="SHIPPING & RETURNS">
            ⚠️ NO COMPLETE OPENING VIDEO = NO DAMAGE/EXCHANGE CLAIM. We accept
            exchanges ONLY in case of a genuine manufacturing defect — not for
            colour preference, fabric preference, change of mind, or any damage
            caused after opening/wearing the product.
          </AccordionSection>
        </div>

        {/* RELATED PRODUCTS */}
        {related?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm text-[#D4A34E] mb-3">You May Also Adore</h2>
            <div className="grid grid-cols-2 gap-3">
              {related.slice(0, 2).map((p) => (
                <Link key={p._id} to={`/product/${p.slug}`} className="block">
                  <div className="aspect-[3/4] rounded overflow-hidden bg-[#14151a]">
                    <img src={p.images?.[0]?.url} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-white text-xs mt-1 truncate">{p.name}</p>
                  <p className="text-[#D4A34E] text-xs">
                    ₹{(p.discountPrice || p.price).toLocaleString("en-IN")}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STICKY ACTION BAR */}
      <div className="fixed bottom-[64px] left-0 right-0 z-50 bg-[#0d0e12]/95 backdrop-blur-md border-t border-white/10 px-5 py-3 flex gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleLike(product._id);
            setWishlist((prev) => !prev);
          }}
          className="flex-1 py-3 rounded border border-[#D4A34E] text-[#D4A34E] text-xs tracking-widest flex items-center justify-center gap-2"
        >
          <Heart size={14} className={wishlist ? "fill-[#D4A34E]" : ""} />
          WISHLIST
        </button>

        <button
          type="button"
          onClick={handleAddToBag}
          className="flex-1 py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-xs tracking-widest font-medium"
        >
          ADD TO BAG
        </button>
      </div>
    </div>
  );
}