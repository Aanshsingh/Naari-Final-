// src/pages/Cart.jsx
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "../../STORE/CartStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BsBagXFill } from "react-icons/bs";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCartStore();
  const shipping = subtotal() > 5000 ? 0 : 99;
  const total = subtotal() + shipping;
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) { 
      navigate("/auth?redirect=checkout"); // send them to login, remember where they wanted to go
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex flex-col items-center justify-center px-6">
        <p className="text-gray-400 text-sm">Your bag is empty</p>
        <Link to="/shop" className="mt-4 text-[#D4A34E] text-5xl underline">
          <BsBagXFill />
        </Link>
      </div>
    );
  } 

  return (
    <div className="min-h-screen bg-[#0d0e12] px-6 lg:px-16 py-10">
      <h1 className="text-xl lg:text-2xl text-white font-light mb-6">
        Your Bag ({items.length})
      </h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex gap-4 bg-[#14151a] p-3 rounded-lg"
            >
              <img
                src={item.image || "https://placehold.co/600x800/14151A/F0D68A?text=NAARI"}
                alt={item.name}
                className="w-20 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-white text-sm">{item.name}</h3>
                {item.size && (
                  <p className="text-gray-500 text-xs mt-1">
                    Size: {item.size}
                  </p>
                )}
                <p className="text-[#D4A34E] text-sm mt-1">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      updateQty(
                        item.productId,
                        item.size,
                        Math.max(1, item.qty - 1),
                      )
                    }
                    className="w-7 h-7 border border-white/20 rounded flex items-center justify-center text-gray-300"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-white text-sm w-4 text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() =>
                      updateQty(item.productId, item.size, item.qty + 1)
                    }
                    className="w-7 h-7 border border-white/20 rounded flex items-center justify-center text-gray-300"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="ml-auto text-gray-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 lg:mt-0 bg-[#14151a] p-5 rounded-lg h-fit">
          <h2 className="text-white text-sm font-medium mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal().toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mb-4">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>
          <div className="flex justify-between text-base text-white font-medium border-t border-white/10 pt-4">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="block text-center w-full mt-6 py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest font-medium"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}
