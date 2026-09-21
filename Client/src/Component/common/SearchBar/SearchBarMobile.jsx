// src/pages/SearchBar/SearchBarMobile.jsx
import { ArrowLeft, Search, TrendingUp } from "lucide-react";
import { useSearchPage } from "../../../hook/useSearchPage.js";
import SearchProductCard from "../SearchBar/SearchProductCard.jsx";

export default function SearchBarMobile() {
  const { query, setQuery, recent, data, isLoading, handleSubmit, goToTerm, clearRecent,  navigate } =
    useSearchPage();

  return (
    <div className="min-h-screen bg-[#0d0e12] px-4 py-5 pb-24">
      <div className="pt-8 pb-7 mt-5">
        <h1 className="text-center text-[28px] font-light tracking-[0.12em] leading-tight text-[#E7B84B]">
          What are You
          <br />
          Looking For?
        </h1>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <button onClick={() => navigate(-1)} className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-400">
          <ArrowLeft size={21} strokeWidth={1.5} />
        </button>

        <form onSubmit={handleSubmit} className="flex items-center flex-1 h-11 px-3 border border-[#E7B84B] bg-[#0F0F0F]">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH..."
            className="flex-1 min-w-0 bg-transparent outline-none text-[11px] text-[#E7B84B] tracking-[0.1em] uppercase placeholder:text-[#55565c]"
          />
          <button type="submit" className="text-[#E7B84B] ml-2">
            <Search size={21} strokeWidth={1.5} />
          </button>
        </form>
      </div>

      {recent.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] tracking-[0.18em] text-gray-400">RECENT SEARCHES</p>
            <button onClick={clearRecent} className="text-[9px] tracking-wider text-[#D4A34E]">
              CLEAR ALL
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recent.map((term) => (
              <button
                key={term}
                onClick={() => goToTerm(term)}
                className="shrink-0 px-3 py-2 border border-[#292a30] bg-[#14151a] text-[9px] text-gray-300 tracking-wide"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}



      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[8px] tracking-[0.2em] text-[#D4A34E] mb-1">COLLECTIONS</p>
          <h2 className="text-sm text-white font-light tracking-wide">Handpicked For You</h2>
        </div>
        <button onClick={() => navigate("/shop")} className="text-[9px] tracking-[0.12em] text-[#D4A34E]">
          VIEW ALL
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-8">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] bg-[#14151a] animate-pulse" />
              <div className="h-2 w-1/3 bg-[#1b1c21] mt-3" />
              <div className="h-3 w-4/5 bg-[#1b1c21] mt-2" />
            </div>
          ))}

        {!isLoading && data?.products?.map((p) => <SearchProductCard key={p._id} product={p} compact />)}
      </div>
    </div>
  );
}