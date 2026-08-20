// src/pages/Checkout.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../STORE/CartStore";
import api from "../../api/axios";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const shipping = subtotal() > 5000 ? 0 : 99;
  const total = subtotal() + shipping;

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  const shippingAddress = {
    line1: e.target.line1.value,
    line2: e.target.line2.value,
    city: e.target.city.value,
    state: e.target.state.value,
    pincode: e.target.pincode.value,
  };

  const orderItems = items.map((i) => ({
    product: i.productId,
    qty: i.qty,
    size: i.size,
  }));

  try {
    const orderRes = await api.post("/orders", { items: orderItems, shippingAddress });
    const dbOrder = orderRes.data.data;

    const rzpRes = await api.post("/payments/create-razorpay-order", { orderId: dbOrder._id });
    const { razorpayOrderId, amount, currency, key } = rzpRes.data.data;

    const options = {
      key,
      amount,
      currency,
      name: "Naari",
      description: "Order Payment",
      order_id: razorpayOrderId,
     handler: async (response) => {
  console.log("RAZORPAY RESPONSE:", response);

  try {
    const verifyRes = await api.post("/payments/verify", {
      orderId: dbOrder._id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });

    console.log("PAYMENT VERIFIED:", verifyRes.data);

    clearCart();

    navigate(`/order-confirmation/${dbOrder._id}`);
  } catch (err) {
    console.error(
      "PAYMENT VERIFICATION ERROR:",
      err.response?.data || err
    );

    setError(
      err.response?.data?.message ||
        "Payment verification failed"
    );

    setLoading(false);
  }
},
      modal: {
        ondismiss: () => {
          setLoading(false); // user closed the widget without paying — order stays pending, cart stays intact
        },
      },
      theme: { color: "#D4A34E" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    // nothing after this line — success/failure is handled entirely inside `handler` above
  } catch (err) {
    setError(err.response?.data?.message || "Could not place order");
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0d0e12] px-6 lg:px-16 py-10">
      <h1 className="text-xl lg:text-2xl text-white font-light mb-6">
        Checkout
      </h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <input
            name="line1"
            placeholder="Address line 1"
            required
            className="w-full bg-transparent border-b border-white/20 text-white py-2 outline-none focus:border-[#D4A34E]"
          />
          <input
            name="line2"
            placeholder="Address line 2 (optional)"
            className="w-full bg-transparent border-b border-white/20 text-white py-2 outline-none focus:border-[#D4A34E]"
          />
          <div className="flex gap-4">
            <input
              name="city"
              placeholder="City"
              required
              className="flex-1 bg-transparent border-b border-white/20 text-white py-2 outline-none focus:border-[#D4A34E]"
            />
            <input
              name="state"
              placeholder="State"
              required
              className="flex-1 bg-transparent border-b border-white/20 text-white py-2 outline-none focus:border-[#D4A34E]"
            />
          </div>
          <input
            name="pincode"
            placeholder="Pincode"
            required
            className="w-full bg-transparent border-b border-white/20 text-white py-2 outline-none focus:border-[#D4A34E]"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest font-medium disabled:opacity-60"
          >
            {loading ? "PLACING ORDER..." : "PLACE ORDER"}
          </button>
        </form>

        <div className="mt-8 lg:mt-0 bg-[#14151a] p-5 rounded-lg h-fit">
          <h2 className="text-white text-sm font-medium mb-4">Order Summary</h2>
          {items.map((i) => (
            <div
              key={`${i.productId}-${i.size}`}
              className="flex justify-between text-xs text-gray-400 mb-2"
            >
              <span>
                {i.name} × {i.qty}
              </span>
              <span>₹{(i.price * i.qty).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="flex justify-between text-base text-white font-medium border-t border-white/10 pt-4 mt-2">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
