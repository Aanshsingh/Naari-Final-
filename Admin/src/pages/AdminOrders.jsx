// src/admin/pages/AdminOrders.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllOrdersAdminApi } from "../api/OrderApi";

const statusColors = {
  placed: "text-yellow-400 border-yellow-400/40",
  processing: "text-blue-400 border-blue-400/40",
  shipped: "text-[#D4A34E] border-[#D4A34E]/40",
  delivered: "text-green-400 border-green-400/40",
  cancelled: "text-red-400 border-red-400/40",
};

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: () => getAllOrdersAdminApi(statusFilter || undefined).then((res) => res.data.data),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-xl font-light">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#14151a] border border-white/20 text-gray-300 text-xs px-3 py-2 rounded outline-none"
        >
          <option value="">All Statuses</option>
          <option value="placed">Placed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Loading orders...</p>}

      <div className="bg-[#14151a] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-xs border-b border-white/5">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order._id} className="border-b border-white/5">
                <td className="px-4 py-3 text-gray-300">#{order._id.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-3 text-gray-300">{order.user?.name}</td>
                <td className="px-4 py-3 text-gray-400">{order.items.length}</td>
                <td className="px-4 py-3 text-[#D4A34E]">₹{order.totalPrice.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded border ${statusColors[order.orderStatus]}`}>
                    {order.orderStatus.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/admin/orders/${order._id}`} className="text-[#D4A34E] text-xs underline">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}