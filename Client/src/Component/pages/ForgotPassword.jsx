// client/src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../../api/authApi.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordApi(email);
    } finally {
      setSubmitted(true); // always show success — matches backend's deliberate non-disclosure
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl text-[#D4A34E] font-light text-center mb-2">Reset Password</h1>

        {submitted ? (
          <p className="text-gray-300 text-sm text-center mt-6">
            If an account exists with that email, we've sent a password reset link. Check your inbox.
          </p>
        ) : (
          <>
            <p className="text-gray-400 text-sm text-center mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-transparent border-b border-white/20 text-white py-2 outline-none focus:border-[#D4A34E]"
              />
              <button
                type="submit" disabled={loading}
                className="w-full py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest disabled:opacity-60"
              >
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/auth" className="text-[#D4A34E] underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}