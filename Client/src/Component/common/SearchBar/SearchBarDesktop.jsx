// src/pages/SearchBar/SearchBarDesktop.jsx
import { ArrowLeft, Search, TrendingUp } from "lucide-react";
import { useSearchPage } from "../../../hook/useSearchPage.js";
import SearchProductCard from "../SearchBar/SearchProductCard.jsx";

export default function SearchBarDesktop() {
  const { query, setQuery, recent, data, isLoading, handleSubmit, goToTerm, clearRecent, trending, navigate } =
    useSearchPage();

  return (
    <div className="min-h-screen bg-[#0d0e12] px-8 py-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="pt-14 pb-10">
          <h1 className="text-center text-5xl xl:text-6xl font-light tracking-[0.18em] text-[#E7B84B]">
            What are You Looking For?
          </h1>
        </div>

        <div className="flex items-center gap-5 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="shrink-0 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-[#E7B84B] transition-colors"
          >
            <ArrowLeft size={23} strokeWidth={1.4} />
          </button>

          <form
            onSubmit={handleSubmit}
            className="flex items-center flex-1 h-16 px-7 border-2 border-[#E7B84B] bg-[#0F0F0F] shadow-[0_0_0_2px_#303030]"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH COLLECTIONS, FABRICS, OR OCCASIONS..."
              className="flex-1 min-w-0 bg-transparent outline-none text-base text-[#E7B84B] font-light tracking-[0.12em] uppercase placeholder:text-[#55565c]"
            />
            <button type="submit" className="ml-5 text-[#E7B84B] hover:text-white transition-colors">
              <Search size={30} strokeWidth={1.5} />
            </button>
          </form>
        </div>

        {recent.length > 0 && (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] tracking-[0.2em] text-gray-400">RECENT SEARCHES</p>
              <button onClick={clearRecent} className="text-[10px] tracking-[0.15em] text-[#D4A34E] hover:text-[#E7B84B]">
                CLEAR ALL
              </button>
            </div>
            <div className="flex gap-3">
              {recent.map((term) => (
                <button
                  key={term}
                  onClick={() => goToTerm(term)}
                  className="px-4 py-2 border border-[#292a30] bg-[#14151a] text-xs text-gray-300 hover:border-[#D4A34E] hover:text-[#E7B84B] transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

     

        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-[#D4A34E] mb-1">COLLECTIONS</p>
            <h2 className="text-lg text-white font-light tracking-wide">Handpicked For You</h2>
          </div>
          <button onClick={() => navigate("/shop")} className="text-xs tracking-[0.15em] text-[#D4A34E] hover:text-[#E7B84B]">
            VIEW ALL
          </button>
        </div>

        <div className="grid grid-cols-4 gap-x-5 gap-y-12">
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-[#14151a] animate-pulse" />
                <div className="mt-3 h-2 w-1/3 bg-[#1b1c21]" />
                <div className="mt-2 h-3 w-4/5 bg-[#1b1c21]" />
              </div>
            ))}

          {!isLoading && data?.products?.map((p) => <SearchProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </div>
  );
}