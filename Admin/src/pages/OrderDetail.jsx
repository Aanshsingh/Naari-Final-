// src/admin/pages/AdminOrderDetail.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { updateOrderStatusApi } from "../api/OrderApi";

const stages = ["placed", "processing", "shipped", "delivered"];

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data.data),
  });

  const handleUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatusApi(orderId, newStatus, note);
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["admin-order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (!order) return <p className="text-red-400 text-sm">Order not found</p>;

  const currentIndex = stages.indexOf(order.orderStatus);

  return (
    <div>
      <h1 className="text-white text-xl font-light mb-1">
        Order #{order._id.slice(-8).toUpperCase()}
      </h1>
      <p className="text-gray-500 text-xs mb-6">
        {order.user?.name} · {order.user?.email}
      </p>
      {/* Manual status control */}
      <div className="bg-[#14151a] p-5 rounded-lg mb-6">
        <p className="text-xs tracking-widest text-gray-400 mb-3">
          UPDATE STATUS
        </p>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note (e.g. courier name, tracking ID)"
          className="w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm mb-3 outline-none focus:border-[#D4A34E]"
        />
        <div className="flex gap-2 flex-wrap">
          {order.orderStatus === "cancelled" ? (
            <p className="text-red-400 text-sm">This order was cancelled.</p>
          ) : (
            stages.map((stage) => (
              <button
                key={stage}
                onClick={() => handleUpdate(stage)}
                disabled={updating || stage === order.orderStatus}
                className={`px-4 py-2 rounded text-xs tracking-widest ${
                  stage === order.orderStatus
                    ? "bg-[#D4A34E] text-black"
                    : "border border-white/20 text-gray-300 hover:border-[#D4A34E]"
                } disabled:opacity-50`}
              >
                {stage.toUpperCase()}
              </button>
            ))
          )}
          {order.orderStatus !== "cancelled" &&
            order.orderStatus !== "delivered" && (
              <button
                onClick={() => handleUpdate("cancelled")}
                disabled={updating}
                className="px-4 py-2 rounded text-xs tracking-widest border border-red-400/40 text-red-400"
              >
                CANCEL ORDER
              </button>
            )}
        </div>
      </div>
      // add this JSX block, right after the status badge at the top:
      {order.orderStatus !== "cancelled" ? (
        <div className="flex items-center justify-between mt-6 mb-8">
          {stages.map((stage, i) => (
            <div
              key={stage}
              className="flex-1 flex flex-col items-center relative"
            >
              {i > 0 && (
                <div
                  className={`absolute top-2.5 right-1/2 w-full h-0.5 ${i <= currentIndex ? "bg-[#D4A34E]" : "bg-white/10"}`}
                />
              )}
              <div
                className={`w-5 h-5 rounded-full z-10 ${i <= currentIndex ? "bg-[#D4A34E]" : "bg-white/10 border border-white/20"}`}
              />
              <p
                className={`text-[10px] mt-2 ${i <= currentIndex ? "text-[#D4A34E]" : "text-gray-600"}`}
              >
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-400 text-sm mt-4">This order was cancelled.</p>
      )}
      {/* History log */}
      <div className="bg-[#14151a] p-5 rounded-lg">
        <p className="text-xs tracking-widest text-gray-400 mb-3">
          STATUS HISTORY
        </p>
        <div className="space-y-3">
          {[...order.statusHistory].reverse().map((entry, i) => (
            <div
              key={i}
              className="flex justify-between text-sm border-b border-white/5 pb-2"
            >
              <div>
                <p className="text-white">
                  {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                </p>
                {entry.note && (
                  <p className="text-gray-500 text-xs mt-0.5">{entry.note}</p>
                )}
              </div>
              <p className="text-gray-500 text-xs">
                {new Date(entry.updatedAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
