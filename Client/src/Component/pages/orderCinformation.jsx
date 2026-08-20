// src/pages/OrderConfirmation.jsx
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircle } from "lucide-react";
import api from "../../api/axios";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const failed = searchParams.get("status") === "failed";

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data.data),
  });

  if (isLoading) return <div className="min-h-screen bg-[#0d0e12] text-center py-32 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0d0e12] flex flex-col items-center justify-center px-6 text-center">
      {failed ? (
        <>
          <XCircle size={48} className="text-red-400" />
          <h1 className="text-xl text-white mt-4">Payment couldn't be verified</h1>
          <p className="text-gray-400 text-sm mt-2">Your order was placed, but we couldn't confirm payment. Contact support with order ID: {orderId}</p>
        </>
      ) : (
        <>
          <CheckCircle size={48} className="text-[#D4A34E]" />
          <h1 className="text-xl text-white mt-4">Order Confirmed</h1>
          <p className="text-gray-400 text-sm mt-2">Thank you — your order #{orderId.slice(-8).toUpperCase()} has been placed.</p>
          <p className="text-[#D4A34E] text-lg mt-4">₹{order?.totalPrice?.toLocaleString("en-IN")}</p>
        </>
      )}
      <div className="flex gap-4 mt-8">
        <Link to="/orders" className="px-6 py-3 border border-[#D4A34E] text-[#D4A34E] text-sm rounded">View Orders</Link>
        <Link to="/shop" className="px-6 py-3 bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm rounded">Continue Shopping</Link>
      </div>
    </div>
  );
}

