// client/src/pages/ContactUs.jsx
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { submitContactFormApi } from "../../api/contactApi.js";

export default function Contact() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    try {
      await submitContactFormApi(payload);
      setSuccess(true);
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send your message — try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] px-5 lg:px-16 py-10 pb-24">
      <h1 className="text-xl lg:text-2xl text-white font-light mb-2">Get in Touch</h1>
      <p className="text-gray-400 text-sm mb-8">
        Questions about an order, fabric, or a custom piece — we'd love to hear from you.
      </p>

      <div className="lg:grid lg:grid-cols-3 lg:gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div>
            <label className="text-xs tracking-widest text-gray-400">NAME</label>
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
            <label className="text-xs tracking-widest text-gray-400">SUBJECT (optional)</label>
            <input
              name="subject"
              className="w-full mt-1 bg-transparent border-b border-white/20 text-white py-2 outline-none focus:border-[#D4A34E]"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest text-gray-400">MESSAGE</label>
            <textarea
              name="message" required rows={5}
              className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && (
            <p className="text-green-400 text-sm">
              Message sent — check your inbox for a confirmation.
            </p>
          )}

          <button
            type="submit" disabled={submitting}
            className="px-8 py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest disabled:opacity-60"
          >
            {submitting ? "SENDING..." : "SEND MESSAGE"}
          </button>
        </form>

        <div className="mt-8 lg:mt-0 space-y-6">
          <div className="flex items-start gap-3">
            <Mail size={16} className="text-[#D4A34E] mt-0.5" />
            <div>
              <p className="text-white text-sm">Email</p>
              <p className="text-gray-400 text-xs mt-1">hello@naari.com</p>
            </div>
          </div>
          
       
        </div>
      </div>
    </div>
  );
}