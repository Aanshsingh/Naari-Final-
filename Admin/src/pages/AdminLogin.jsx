import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(e.target.email.value, e.target.password.value);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="text-[#D4A34E] text-2xl font-light text-center mb-8">Naari Admin</h1>
        <input
          name="email" type="email" required placeholder="Email"
          className="w-full bg-transparent border-b border-white/20 text-white py-2 mb-5 outline-none focus:border-[#D4A34E]"
        />
        <input
          name="password" type="password" required placeholder="Password"
          className="w-full bg-transparent border-b border-white/20 text-white py-2 mb-5 outline-none focus:border-[#D4A34E]"
        />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button
          type="submit" disabled={loading}
          className="w-full py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest disabled:opacity-60"
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}
