// admin/src/pages/AdminDashboard.jsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { IndianRupee, ShoppingBag, Star, Image, ChevronRight } from "lucide-react";
import { getOrderStatsApi, getAllOrdersAdminApi } from "../api/OrderApi";

const statusColors = {
  placed: "text-yellow-400 border-yellow-400/40",
  processing: "text-blue-400 border-blue-400/40",
  shipped: "text-[#D4A34E] border-[#D4A34E]/40",
  delivered: "text-green-400 border-green-400/40",
  cancelled: "text-red-400 border-red-400/40",
};

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["order-stats"],
    queryFn: () => getOrderStatsApi().then((res) => res.data.data),
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders-recent"],
    queryFn: () => getAllOrdersAdminApi().then((res) => res.data.data.slice(0, 5)),
  });

  const statCards = [
    {
      label: "Total Revenue",
      value: statsLoading ? "..." : `₹${stats?.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },
    {
      label: "Total Orders",
      value: statsLoading ? "..." : stats?.totalOrders,
      icon: ShoppingBag,
    },
    {
      label: "Pending Reviews",
      value: "—",
      icon: Star,
      note: "Reviews module — Day 19",
    },
    {
      label: "Active Banners",
      value: "—",
      icon: Image,
      note: "Banners module — Day 17",
    },
  ];

  return (
    <div>
      <h1 className="text-white text-xl font-light mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-[#14151a] p-5 rounded-lg">
              <div className="flex justify-between items-start">
                <p className="text-gray-500 text-xs">{card.label}</p>
                <Icon size={16} className="text-[#D4A34E]" />
              </div>
              <p className="text-white text-2xl font-light mt-3">{card.value}</p>
              {card.note && <p className="text-gray-600 text-[10px] mt-1">{card.note}</p>}
            </div>
          );
        })}
      </div>

      {/* Pending orders callout — since order count alone doesn't tell you what needs action */}
      {!statsLoading && stats?.pendingOrders > 0 && (
        <div className="bg-[#14151a] border border-yellow-400/20 rounded-lg px-5 py-3 mb-8 flex justify-between items-center">
          <p className="text-yellow-400 text-sm">
            {stats.pendingOrders} order{stats.pendingOrders > 1 ? "s" : ""} awaiting processing
          </p>
          <Link to="/orders?status=placed" className="text-xs text-[#D4A34E] underline">Review now</Link>
        </div>
      )}

      {/* Recent orders */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm tracking-widest text-[#D4A34E]">RECENT ORDERS</h2>
        <Link to="/orders" className="text-xs text-gray-400 flex items-center gap-1">
          View All <ChevronRight size={12} />
        </Link>
      </div>

      <div className="bg-[#14151a] rounded-lg overflow-hidden">
        {ordersLoading && <p className="text-gray-500 text-sm p-4">Loading...</p>}
        {!ordersLoading && recentOrders?.length === 0 && (
          <p className="text-gray-500 text-sm p-4">No orders yet.</p>
        )}
        {recentOrders?.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs border-b border-white/5">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link to={`/orders/${order._id}`} className="text-gray-300 hover:text-[#D4A34E]">
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{order.user?.name}</td>
                  <td className="px-4 py-3 text-[#D4A34E]">₹{order.totalPrice.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded border ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}