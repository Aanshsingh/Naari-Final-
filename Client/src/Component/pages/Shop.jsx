// src/pages/Shop.jsx
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, SlidersHorizontal } from "lucide-react";
import { getProductsApi } from "../../api/productApi";
import { getCategoriesApi, getCategoryBySlugApi } from "../../api/catogries";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const search = searchParams.get("search");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  // all categories, for the tab strip
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi().then((res) => res.data.data),
  });

  // resolve the slug in the URL to a real category document (for its _id)
  const { data: activeCategory } = useQuery({
    queryKey: ["category-slug", categorySlug],
    queryFn: () => getCategoryBySlugApi(categorySlug).then((res) => res.data.data),
    enabled: !!categorySlug,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["shop-products", { categoryId: activeCategory?._id, search, sort, page }],
    queryFn: () =>
      getProductsApi({
        category: activeCategory?._id,
        search,
        sort,
        page,
        limit: 12,
      }).then((res) => res.data.data),
    enabled: categorySlug ? !!activeCategory : true, // wait for category resolution if a slug is in the URL
  });

  // reset to page 1 and clear accumulated products whenever filters change
  useEffect(() => {
    setPage(1);
    setProducts([]);
  }, [categorySlug, search, sort]);

  // append new page results (for "Load More") instead of replacing
  useEffect(() => {
    if (!data?.products) return;
    setProducts((prev) => (page === 1 ? data.products : [...prev, ...data.products]));
  }, [data, page]);

  const handleCategoryClick = (slug) => {
    setSearchParams(slug ? { category: slug } : {});
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] px-5 lg:px-16 py-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg lg:text-2xl text-white font-light">
          {search ? `Results for "${search}"` : activeCategory?.name || "Shop All"}
        </h1>
      </div>

      {/* Category tabs */}
      <div className="flex gap-3 overflow-x-auto py-4 border-b border-white/10">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-xs tracking-widest ${
            !categorySlug ? "bg-[#D4A34E] text-black" : "border border-white/20 text-gray-300"
          }`}
        >
          ALL
        </button>
        {categories?.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs tracking-widest uppercase ${
              categorySlug === cat.slug ? "bg-[#D4A34E] text-black" : "border border-white/20 text-gray-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex justify-end py-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-[#14151a] border border-white/20 text-gray-300 text-xs px-3 py-2 rounded outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {isLoading && products.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-10">Loading products...</p>
      )}

      {!isLoading && products.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-10">No products found.</p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product.slug}`}
            className="group block bg-[#14151a] rounded-lg overflow-hidden relative"
          >
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center"
            >
              <Heart size={14} className="text-white" />
            </button>
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform"
            />
            <div className="p-3">
              <h3 className="text-white text-xs lg:text-sm truncate">{product.name}</h3>
              <p className="text-[#D4A34E] text-sm mt-1">
                ₹{(product.discountPrice || product.price).toLocaleString("en-IN")}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {data && page < data.totalPages && (
        <div className="text-center mt-10">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
            className="px-8 py-3 border border-[#D4A34E] text-[#D4A34E] text-xs tracking-widest rounded disabled:opacity-50"
          >
            {isFetching ? "LOADING..." : "LOAD MORE"}
          </button>
        </div>
      )}
    </div>
  );
}