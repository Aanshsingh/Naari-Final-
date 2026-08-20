// src/pages/Account.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useUserProfile } from "../../hook/userUserProfile";
import { useLikedProducts } from "../../hook/useLikedProducts";
import { resendVerificationApi } from "../../api/authApi";

const statusColors = {
  placed: "text-yellow-400",
  processing: "text-blue-400",
  shipped: "text-[#D4A34E]",
  delivered: "text-green-400",
  cancelled: "text-red-400",
};

export default function Account() {
  const { user, orders, ordersLoading, logout } = useUserProfile();
  const navigate = useNavigate();
  const { data: likedProducts } = useLikedProducts();
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationApi();
      setResent(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] px-5 lg:px-16 py-8 pb-24">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#14151a] border border-[#D4A34E]/40 flex items-center justify-center">
          <span className="text-xl text-[#D4A34E]">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-white text-lg">{user?.name}</h1>
          <p className="text-gray-500 text-xs mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* Email verification banner */}
      {user && !user.isVerified && (
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-3 mt-6 flex justify-between items-center flex-wrap gap-2">
          <p className="text-yellow-400 text-xs">
            {resent
              ? "Verification email sent — check your inbox."
              : "Your email isn't verified yet."}
          </p>
          {!resent && (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-xs text-[#D4A34E] underline disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend verification email"}
            </button>
          )}
        </div>
      )}

      {/* My Orders preview */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm tracking-widest text-[#D4A34E]">MY ORDERS</h2>
          <button
            onClick={() => navigate("/orders")}
            className="text-xs text-gray-400 flex items-center gap-1"
          >
            View All <ChevronRight size={12} />
          </button>
        </div>

        {ordersLoading && (
          <p className="text-gray-500 text-xs">Loading orders...</p>
        )}
        {!ordersLoading && orders?.length === 0 && (
          <p className="text-gray-500 text-xs">No orders yet.</p>
        )}

        <div className="space-y-3">
          {orders?.slice(0, 2).map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/order-confirmation/${order._id}`)}
              className="flex items-center gap-4 bg-[#14151a] p-3 rounded-lg cursor-pointer"
            >
              <img
                src={order.items?.[0]?.image}
                alt=""
                className="w-14 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-white text-sm">
                  {order.items?.[0]?.name}
                  {order.items.length > 1
                    ? ` +${order.items.length - 1} more`
                    : ""}
                </p>
                <p
                  className={`text-xs mt-1 ${statusColors[order.orderStatus] || "text-gray-400"}`}
                >
                  {order.orderStatus.charAt(0).toUpperCase() +
                    order.orderStatus.slice(1)}
                </p>
              </div>
              <p className="text-[#D4A34E] text-sm">
                ₹{order.totalPrice.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Saved Items — real, backed by useLikedProducts */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm tracking-widest text-[#D4A34E] flex items-center gap-2">
            <Heart size={14} /> SAVED ITEMS
          </h2>
          <button
            onClick={() => navigate("/wishlist")}
            className="text-xs text-gray-400 flex items-center gap-1"
          >
            View All <ChevronRight size={12} />
          </button>
        </div>

        {likedProducts?.length === 0 && (
          <p className="text-gray-500 text-xs">No liked items yet.</p>
        )}

        <div className="flex gap-3 overflow-x-auto pb-1">
          {likedProducts?.slice(0, 4).map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product.slug}`)}
              className="shrink-0 w-20 cursor-pointer"
            >
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-20 h-24 object-cover rounded"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Addresses */}
      <section className="mt-8">
        <h2 className="text-sm tracking-widest text-[#D4A34E] mb-3 flex items-center gap-2">
          <MapPin size={14} /> ADDRESSES
        </h2>
        {user?.addresses?.length === 0 && (
          <p className="text-gray-500 text-xs">No saved addresses.</p>
        )}
        <div className="space-y-3">
          {user?.addresses?.map((addr, i) => (
            <div key={i} className="bg-[#14151a] p-4 rounded-lg">
              <div className="flex justify-between">
                <p className="text-white text-sm">{addr.label || "Home"}</p>
                {addr.isDefault && (
                  <span className="text-[10px] text-[#D4A34E] border border-[#D4A34E]/40 px-2 py-0.5 rounded">
                    DEFAULT
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-1">
                {addr.line1}, {addr.line2 ? `${addr.line2}, ` : ""}
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Settings */}
      <section className="mt-8">
        <h2 className="text-sm tracking-widest text-[#D4A34E] mb-3 flex items-center gap-2">
          <Settings size={14} /> SETTINGS
        </h2>
        <div className="bg-[#14151a] rounded-lg divide-y divide-white/5">
          <button className="w-full text-left px-4 py-3 text-sm text-gray-300 flex justify-between items-center">
            Personal Details{" "}
            <ChevronRight size={14} className="text-gray-600" />
          </button>
          <button className="w-full text-left px-4 py-3 text-sm text-gray-300 flex justify-between items-center">
            Notification Preferences{" "}
            <ChevronRight size={14} className="text-gray-600" />
          </button>
          <button className="w-full text-left px-4 py-3 text-sm text-gray-300 flex justify-between items-center">
            Privacy &amp; Security{" "}
            <ChevronRight size={14} className="text-gray-600" />
          </button>
        </div>
      </section>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full mt-8 py-3 rounded border border-red-400/40 text-red-400 text-sm flex items-center justify-center gap-2"
      >
        <LogOut size={16} /> LOGOUT FROM NAARI
      </button>
    </div>
  );
}