// src/pages/Orders.jsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyOrdersApi } from "../../api/orderApi";

const statusColors = {
  placed: "text-yellow-400 border-yellow-400/40",
  processing: "text-blue-400 border-blue-400/40",
  shipped: "text-[#D4A34E] border-[#D4A34E]/40",
  delivered: "text-green-400 border-green-400/40",
  cancelled: "text-red-400 border-red-400/40",
};

export default function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrdersApi().then((res) => res.data.data),
  });

  return (
    <div className="min-h-screen bg-[#0d0e12] px-5 lg:px-16 py-8">
      <h1 className="text-lg lg:text-2xl text-white font-light mb-6">My Orders</h1>

      {isLoading && <p className="text-gray-500 text-sm">Loading orders...</p>}
      {!isLoading && orders?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
          <Link to="/shop" className="text-[#D4A34E] text-sm underline mt-3 inline-block">Start Shopping</Link>
        </div>
      )}

      <div className="space-y-4">
        {orders?.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block bg-[#14151a] p-4 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded border ${statusColors[order.orderStatus] || "text-gray-400 border-white/20"}`}>
                {order.orderStatus.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              {order.items.slice(0, 4).map((item, i) => (
                <img key={i} src={item.image} alt="" className="w-12 h-14 object-cover rounded" />
              ))}
              {order.items.length > 4 && (
                <div className="w-12 h-14 rounded bg-black/30 flex items-center justify-center text-xs text-gray-400">
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
              <span className="text-gray-500 text-xs">{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
              <span className="text-[#D4A34E] text-sm">₹{order.totalPrice.toLocaleString("en-IN")}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}