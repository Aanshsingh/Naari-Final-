// src/pages/Search.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, ArrowLeft, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../../api/productApi";
import { Link } from "react-router-dom";

const trending = ["Bridal Lehengas", "Silk Dupattas", "Hand-woven Shawls"];

export default function Search() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem("naari-recent-searches") || "[]"));
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["products", { limit: 4 }],
    queryFn: () => getProductsApi({ limit: 4 }).then((res) => res.data.data),
  });

  const saveSearch = (term) => {
    const updated = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("naari-recent-searches", JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveSearch(query.trim());
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem("naari-recent-searches");
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] px-5 py-4">
        <div><h2 className="text-center text-4xl font-light tracking-[0.18em] text-[#E7B84B] sm:text-5xl md:text-6xl">What are You Looking For ?</h2></div>
    <div className="flex items-center gap-4 mb-5 mt-4">
  {/* Back Button */}
  <button
    onClick={() => navigate(-1)}
    className="text-gray-400 hover:text-white transition-colors"
  >
    <ArrowLeft size={22} />
  </button>

  {/* Search Box */}
  <form
    onSubmit={handleSubmit}
    className="
    w-[90%] max-w-6xl mx-auto
    flex items-center
    h-16
    px-6
    border-2 border-[#E7B84B]
    bg-[#0F0F0F]
    shadow-[0_0_0_2px_#303030]
    "
  >
    <input
      autoFocus
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="SEARCH COLLECTIONS, FABRICS, OR OCCASIONS..."
      className="
        flex-1
        bg-transparent
        text-[#E7B84B]
        text-lg
        font-light
        tracking-[0.12em]
        uppercase
        outline-none
        placeholder:text-[#55565c]
        placeholder:opacity-100
      "
    />

    <button
      type="submit"
      className="text-[#E7B84B] hover:text-white transition-colors ml-4"
    >
      <SearchIcon size={38} strokeWidth={1.8} />
    </button>
  </form>
</div>

      {recent.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs tracking-widest text-gray-400">RECENT SEARCHES</h2>
            <button onClick={clearRecent} className="text-xs text-[#D4A34E]">CLEAR ALL</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/shop?search=${encodeURIComponent(term)}`)}
                className="px-3 py-1.5 bg-[#14151a] rounded-full text-xs text-gray-300"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

     

      <div>
        <p className="text-[10px] tracking-widest text-[#D4A34E] mb-1">COLLECTIONS</p>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm text-white font-medium">Handpicked For You</h2>
           <button onClick={() => navigate("/shop")} className="text-xs text-[#D4A34E]">
            View All
            </button> 
         
        </div>
        <div className="grid grid-cols-2 gap-3">
          {data?.products?.map((p) => (
            <div key={p._id} onClick={() => navigate(`/product/${p.slug}`)} className="cursor-pointer">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-[#14151a]">
                <img src={p.images?.[0]?.url ||  "https://placehold.co/600x800/14151A/F0D68A?text=NAARI"} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-white text-xs mt-1.5">{p.name}</p>
              <p className="text-[#D4A34E] text-xs">₹{(p.discountPrice || p.price).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}