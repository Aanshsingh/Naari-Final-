// client/src/components/TestimonialModal.jsx
import { useState } from "react";
import { X, Star } from "lucide-react";
import { submitTestimonialApi } from "../../api/TestimonialApi.js";

export default function TestimonialModal({ onClose }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await submitTestimonialApi({
        name: e.target.name.value,
        email: e.target.email.value,
        message: e.target.message.value,
        rating,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit — try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0e12] border border-white/10 rounded-lg w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg">Share Your Experience</h2>
          <button onClick={onClose} className="text-gray-400"><X size={20} /></button>
        </div>

        {success ? (
          <div className="text-center py-6">
            <p className="text-[#D4A34E]  text-sm">
               Thank you for sharing your love for Naari — we'll feature your words soon. 🤍
            </p>
            <button onClick={onClose} className="mt-4 text-[#D4A34E] text-sm underline">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-1 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i + 1)}
                >
                  <Star
                    size={24}
                    className={i < (hoverRating || rating) ? "text-[#D4A34E] fill-[#D4A34E]" : "text-gray-700"}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs tracking-widest text-gray-400">YOUR NAME</label>
              <input
                name="name" required
                className="w-full mt-1 bg-transparent border-b border-white/20 text-white py-2 outline-none focus:border-[#D4A34E]"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest text-gray-400">EMAIL</label>
              <input
                name="email" type="email" required
                className="w-full mt-1 bg-transparent border-b border-white/20 text-white py-2 outline-none focus:border-[#D4A34E]"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest text-gray-400">YOUR COMMENT</label>
              <textarea
                name="message" required rows={3}
                placeholder="Tell us about your experience with Naari..."
                className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit" disabled={submitting}
              className="w-full py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest disabled:opacity-60"
            >
              {submitting ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

