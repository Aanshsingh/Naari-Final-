// src/pages/auth/AuthScreenDesktop.jsx
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuthForm } from "../../../hook/useAuthForm";

export default function AuthScreenDesktop() {
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
    <div className="min-h-screen flex bg-[#0d0e12]">
      {/* Left: hero image + brand */}
      <div className="hidden lg:block w-1/2 relative">
        <img
          src="/images/hero-model.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-10 left-10">
          <p className="text-gray-300 text-sm tracking-widest">Naari</p>
        </div>

        <div className="absolute top-32 left-10">
          <h1 className="text-5xl tracking-[0.15em] font-light text-[#F0D68A]">
            NAARI
          </h1>
          <p className="mt-2 text-xs tracking-[0.3em] text-gray-300">
            ESTABLISHED IN ELEGANCE
          </p>
        </div>

        <div className="absolute bottom-16 left-10 right-10">
          <p className="text-2xl italic text-white/90 font-light leading-snug">
            "Every thread tells a story of heritage reimagined."
          </p>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <h2 className="text-3xl text-white font-light">Welcome Back</h2>
          <p className="mt-2 text-gray-400 text-sm">
            Enter your details to access your curated wardrobe.
          </p>

          <div className="flex gap-8 mt-8 border-b border-white/10">
            <button
              onClick={() => setActiveTab("login")}
              className={`pb-3 text-sm tracking-widest ${activeTab === "login" ? "text-[#D4A34E] border-b-2 border-[#D4A34E]" : "text-gray-400"}`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`pb-3 text-sm tracking-widest ${activeTab === "signup" ? "text-[#D4A34E] border-b-2 border-[#D4A34E]" : "text-gray-400"}`}
            >
              SIGN UP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
      <input name="city" type="text" placeholder="City" required className="w-full bg-transparent border border-white/20 rounded px-4 py-3 pr-10 text-white outline-none focus:border-[#D4A34E]"/>
      <input name="state" type="text" placeholder="State" required className="w-full bg-transparent border border-white/20 rounded px-4 py-3 pr-10 text-white outline-none focus:border-[#D4A34E]"/>
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

            

            <div>
              <label className="text-xs tracking-widest text-[#D4A34E]">
                PASSWORD
              </label>
              <div className="relative mt-2">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-transparent border border-white/20 rounded px-4 py-3 pr-10 text-white outline-none focus:border-[#D4A34E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {activeTab === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" className="accent-[#D4A34E]" />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-sm text-[#D4A34E] underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-[0.2em] font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading
                ? "PLEASE WAIT..."
                : activeTab === "login"
                  ? "SIGN IN"
                  : "CREATE ACCOUNT"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs tracking-widest text-gray-500">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="flex gap-4">
            <button className="flex-1 border border-white/20 rounded py-3 flex items-center justify-center gap-2 text-sm text-white">
              GOOGLE
            </button>
            <button className="flex-1 border border-white/20 rounded py-3 flex items-center justify-center gap-2 text-sm text-white">
              APPLE
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-8">
            By continuing, you agree to Naari's{" "}
            <span className="text-[#D4A34E] underline">Terms of Service</span>{" "}
            and <span className="text-[#D4A34E] underline">Privacy Policy</span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
