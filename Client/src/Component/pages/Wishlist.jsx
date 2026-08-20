// src/pages/Wishlist.jsx
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useLikedProducts } from "../../hook/useLikedProducts";
import { useCartStore } from "../../STORE/CartStore";

export default function Wishlist() {
  const { data: products, isLoading, toggleLike } = useLikedProducts();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToBag = (product) => {
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      price: product.discountPrice || product.price,
      qty: 1,
      size: product.sizes?.[0]?.label || null, // wishlist has no size picker — defaults to first size
    });
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] px-5 lg:px-16 py-8 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <Heart size={18} className="text-[#D4A34E] fill-[#D4A34E]" />
        <h1 className="text-lg lg:text-2xl text-white font-light">Your Liked Pieces</h1>
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}

      {!isLoading && products?.length === 0 && (
        <div className="text-center py-16">
          <Heart size={32} className="mx-auto text-gray-700" />
          <p className="text-gray-500 text-sm mt-4">Nothing here yet — tap the heart on any piece you love.</p>
          <Link to="/shop" className="text-[#D4A34E] text-sm underline mt-3 inline-block">Browse the collection</Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {products?.map((product) => (
          <div key={product._id} className="bg-[#14151a] rounded-lg overflow-hidden relative">
            <button
              type="button"
              onClick={() => toggleLike(product._id)}
              className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center"
            >
              <Heart size={14} className="text-[#D4A34E] fill-[#D4A34E]" />
            </button>

            <Link to={`/product/${product.slug}`}>
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-full aspect-[3/4] object-cover"
              />
            </Link>

            <div className="p-3">
              <Link to={`/product/${product.slug}`}>
                <h3 className="text-white text-xs lg:text-sm truncate">{product.name}</h3>
                <p className="text-[#D4A34E] text-sm mt-1">
                  ₹{(product.discountPrice || product.price).toLocaleString("en-IN")}
                </p>
              </Link>
              <button
                onClick={() => handleAddToBag(product)}
                className="w-full mt-3 py-2 rounded border border-[#D4A34E] text-[#D4A34E] text-[10px] tracking-widest flex items-center justify-center gap-1.5"
              >
                <ShoppingBag size={12} /> ADD TO BAG
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}