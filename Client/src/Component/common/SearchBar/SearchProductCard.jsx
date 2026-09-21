// client/src/components/SearchProductCard.jsx
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
 import { useWishlistStore } from "../../../STORE/wishlistStore.js";
// import ProductBadge from "./ProductBadge";

export default function SearchProductCard({ product, compact = false }) {
  const navigate = useNavigate();
  const { likedIds, toggleLike } = useWishlistStore();

  return (
    <article
      onClick={() => navigate(`/product/${product.slug}`)}
      className="group cursor-pointer"
    >
      <div className={`relative aspect-[3/4] overflow-hidden bg-[#14151a]`}>
        {/* <ProductBadge badge={product.effectiveBadge} /> */}

        <img
          src={product.images?.[0]?.url || "https://placehold.co/600x800/14151A/F0D68A?text=NAARI"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(product._id);
          }}
          className={`absolute top-2 ${compact ? "right-2 w-7 h-7" : "top-3 right-3 w-9 h-9"} flex items-center justify-center rounded-md border border-[#D4A34E]/50 bg-[#101116]/80 backdrop-blur-sm text-[#D4A34E] hover:bg-[#D4A34E] hover:text-[#101116] transition-all`}
        >
          <Heart
            size={compact ? 14 : 16}
            strokeWidth={1.4}
            className={likedIds.includes(product._id) ? "fill-current" : ""}
          />
        </button>
      </div>

      <div className={compact ? "pt-2" : "pt-3"}>
        <p className={`${compact ? "text-[7px]" : "text-[9px]"} tracking-[0.14em] text-[#D4A34E] uppercase mb-1`}>
          {product.category?.name || "COLLECTION"}
        </p>
        <p className={`${compact ? "text-[10px]" : "text-xs"} text-white font-light tracking-wide leading-relaxed line-clamp-2`}>
          {product.name}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <p className={`${compact ? "text-[10px]" : "text-xs"} text-[#E7B84B] font-medium`}>
            ₹{product.effectivePrice.toLocaleString("en-IN")}
          </p>
          {product.isOnSale && (
            <p className={`${compact ? "text-[8px]" : "text-[10px]"} text-gray-500 line-through`}>
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

