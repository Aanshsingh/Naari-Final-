// admin/src/pages/AdminTestimonials.jsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X, Star, Trash2 } from "lucide-react";
import {
  getAllTestimonialsAdminApi,
  approveTestimonialApi,
  rejectTestimonialApi,
} from "../api/adminTestimonialApi";

export default function AdminTestimonials() {
  const [filter, setFilter] = useState("pending");
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["admin-testimonials", filter],
    queryFn: () =>
      getAllTestimonialsAdminApi(filter).then((res) => res.data.data),
  });

  const handleApprove = async (id) => {
    await approveTestimonialApi(id);
    queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    queryClient.invalidateQueries({ queryKey: ["testimonials"] }); // client homepage cache
  };

const handleReject = async (id, isLive) => {
  const message = isLive
    ? "Remove this testimonial from the live site? This can't be undone."
    : "Reject and permanently remove this comment?";
  if (!confirm(message)) return;
  await rejectTestimonialApi(id);
  queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
  queryClient.invalidateQueries({ queryKey: ["testimonials"] }); // clears it from Homepage cache too
};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-xl font-light">Testimonials</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#14151a] border border-white/20 text-gray-300 text-xs px-3 py-2 rounded outline-none"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="">All</option>
        </select>
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}
      {!isLoading && testimonials?.length === 0 && (
        <p className="text-gray-500 text-sm">Nothing here.</p>
      )}

      <div className="space-y-3">
        {testimonials?.map((t) => (
          <div
            key={t._id}
            className={`bg-[#14151a] p-4 rounded-lg ${!t.isApproved ? "border-l-2 border-yellow-400/60" : ""}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.email}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < t.rating
                        ? "text-[#D4A34E] fill-[#D4A34E]"
                        : "text-gray-700"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-2">{t.message}</p>

            {!t.isApproved ? (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleApprove(t._id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-green-500/10 text-green-400 text-xs border border-green-400/30"
                >
                  <Check size={12} /> Approve
                </button>
                <button
                  onClick={() => handleReject(t._id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-500/10 text-red-400 text-xs border border-red-400/30"
                >
                  <X size={12} /> Reject
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] text-green-400">
                  ✓ Live on site
                </span>
                <button
                 onClick={() => handleReject(t._id, t.isApproved)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-500/10 text-red-400 text-xs border border-red-400/30"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
