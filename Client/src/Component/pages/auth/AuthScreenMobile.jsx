// src/pages/auth/AuthScreenMobile.jsx
import { Eye, EyeOff } from "lucide-react";
import { useAuthForm } from "../../../hook/useAuthForm";
import { Link } from "react-router-dom";

export default function AuthScreenMobile() {
  const {
    activeTab,
    setActiveTab,
    showPassword,
    setShowPassword,
    error,
    loading,
    handleSubmit,
  } = useAuthForm();

  return (
    <div className="min-h-screen bg-[#0d0e12] flex flex-col">
      <div className="relative h-[45vh] min-h-[320px]">
        <img
          src="/homemobile.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0d0e12]" />
        <div className="absolute bottom-6 left-0 right-0 text-center px-6">
          <h1 className="text-4xl tracking-[0.3em] font-light bg-gradient-to-b from-[#F0D68A] to-[#C9962F] bg-clip-text text-transparent">
            NAARI
          </h1>
          <p className="mt-2 italic text-gray-200 text-sm">
            "Grace is the only beauty that never fades."
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-8">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 pb-3 text-sm tracking-widest ${activeTab === "login" ? "text-[#D4A34E] border-b-2 border-[#D4A34E]" : "text-gray-400"}`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 pb-3 text-sm tracking-widest ${activeTab === "signup" ? "text-[#D4A34E] border-b-2 border-[#D4A34E]" : "text-gray-400"}`}
          >
            SIGN UP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {activeTab === "signup" && (
            <div>
              <label className="text-xs tracking-widest text-[#D4A34E]">
                FULL NAME
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full mt-2 bg-transparent border border-white/20 rounded px-4 py-3 text-white outline-none focus:border-[#D4A34E]"
              />
            </div>
          )}

          <div>
            <label className="text-xs tracking-widest text-[#D4A34E]">
              EMAIL ADDRESS
            </label>
            <input
              name="email"
              type="email"
              placeholder="name@vogue.in"
              required
              className="w-full mt-2 bg-transparent border border-white/20 rounded px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-[#D4A34E]"
            />
          </div>

          {activeTab === "signup" && (
            <>
              <div>
                <label className="text-xs tracking-widest text-[#D4A34E]">
                  PHONE NUMBER
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  className="w-full mt-2 bg-transparent border border-white/20 rounded px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-[#D4A34E]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs tracking-widest text-[#D4A34E]">
                  ADDRESS
                </label>
                <input
                  name="line1"
                  type="text"
                  placeholder="Address line 1"
                  required
                  className="w-full bg-transparent border border-white/20 rounded px-4 py-3 pr-10 text-white outline-none focus:border-[#D4A34E]"
                />
                <input
                  name="line2"
                  type="text"
                  placeholder="Address line 2 (optional)"
                  className="w-full bg-transparent border border-white/20 rounded px-4 py-3 pr-10 text-white outline-none focus:border-[#D4A34E]"
                />
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  required
                  className="w-full bg-transparent border border-white/20 rounded px-4 py-3 pr-10 text-white outline-none focus:border-[#D4A34E]"
                />
                <input
                  name="state"
                  type="text"
                  placeholder="State"
                  required
                  className="w-full bg-transparent border border-white/20 rounded px-4 py-3 pr-10 text-white outline-none focus:border-[#D4A34E]"
                />
                <input
                  name="pincode"
                  type="text"
                  placeholder="Pincode"
                  required
                  className="w-full bg-transparent border border-white/20 rounded px-4 py-3 pr-10 text-white outline-none focus:border-[#D4A34E]"
                />
              </div>
            </>
          )}

          <div className="relative">
            <label className="text-xs tracking-widest text-gray-400">
              PASSWORD
            </label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full bg-transparent border-b border-white/20 text-white py-2 pr-8 outline-none focus:border-[#D4A34E]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-0 top-8 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {activeTab === "login" && (
            <div className="text-right -mt-3">
              <button type="button" className="text-xs text-[#D4A34E]">
                Forgot Password?
              </button>
            </div>
          )}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-[0.2em] font-medium disabled:opacity-60"
          >
            {loading
              ? "PLEASE WAIT..."
              : activeTab === "login"
                ? "ENTER BOUTIQUE"
                : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs tracking-widest text-gray-500">
            OR CONTINUE WITH
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <div className="flex gap-3">
          <button className="flex-1 border border-white/20 rounded py-3 text-sm text-white">
            Google
          </button>
          <button className="flex-1 border border-white/20 rounded py-3 text-sm text-white">
            Apple
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-8 pb-6">
          By continuing, you agree to Naari's{" "}
          <Link
            to="/terms"
            className="text-[#D4A34E] underline hover:opacity-80"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="text-[#D4A34E] underline hover:opacity-80"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
