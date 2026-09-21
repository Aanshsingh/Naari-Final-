// client/src/hooks/useSearchPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../api/productApi";

const RECENT_KEY = "naari-recent-searches";


export function useSearchPage() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(() =>
    JSON.parse(localStorage.getItem(RECENT_KEY) || "[]")
  );
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["search-suggestions"],
    queryFn: () => getProductsApi({ sort: "newest", limit: 8 }).then((res) => res.data.data),
  });

  const saveSearch = (term) => {
    const updated = [term, ...recent.filter((item) => item !== term)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveSearch(query.trim());
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const goToTerm = (term) => {
    saveSearch(term);
    navigate(`/shop?search=${encodeURIComponent(term)}`);
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem(RECENT_KEY);
  };

  return {
    query, setQuery, recent, data, isLoading,
    handleSubmit, goToTerm, clearRecent,
   
    navigate,
  };
}