// src/pages/OrderDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getOrderByIdApi } from "../../api/orderApi";

const statusColors = {
  placed: "text-yellow-400",
  processing: "text-blue-400",
  shipped: "text-[#D4A34E]",
  delivered: "text-green-400",
  cancelled: "text-red-400",
};

export default function OrderDetail() {
  const { orderId } = useParams();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderByIdApi(orderId).then((res) => res.data.data),
  });

  if (isLoading) return <div className="min-h-screen bg-[#0d0e12] text-center py-20 text-gray-400">Loading...</div>;
  if (isError || !order) return <div className="min-h-screen bg-[#0d0e12] text-center py-20 text-red-400">Order not found</div>;

  return (
    <div className="min-h-screen bg-[#0d0e12] px-5 lg:px-16 py-8">
      <Link to="/orders" className="inline-flex items-center gap-2 text-gray-400 text-sm mb-6">
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-white text-lg">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-gray-500 text-xs mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <span className={`text-xs font-medium ${statusColors[order.orderStatus] || "text-gray-400"}`}>
          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
        </span>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-10">
        <div className="lg:col-span-2 space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4 bg-[#14151a] p-3 rounded-lg">
              <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded" />
              <div className="flex-1">
                <p className="text-white text-sm">{item.name}</p>
                {item.size && <p className="text-gray-500 text-xs mt-1">Size: {item.size}</p>}
                <p className="text-gray-400 text-xs mt-1">Qty: {item.qty}</p>
              </div>
              <p className="text-[#D4A34E] text-sm">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 lg:mt-0 space-y-4">
          <div className="bg-[#14151a] p-4 rounded-lg">
            <p className="text-xs tracking-widest text-gray-400 mb-2">SHIPPING ADDRESS</p>
            <p className="text-gray-300 text-sm">
              {order.shippingAddress.line1}, {order.shippingAddress.line2 ? `${order.shippingAddress.line2}, ` : ""}
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>

          <div className="bg-[#14151a] p-4 rounded-lg">
            <p className="text-xs tracking-widest text-gray-400 mb-2">PAYMENT SUMMARY</p>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Items</span><span>₹{order.itemsPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Shipping</span><span>{order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}</span>
            </div>
            <div className="flex justify-between text-sm text-white font-medium border-t border-white/10 pt-2">
              <span>Total</span><span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Payment: <span className={order.paymentInfo.status === "paid" ? "text-green-400" : "text-yellow-400"}>
                {order.paymentInfo.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}