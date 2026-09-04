// src/hooks/useProductDetail.js
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getProductBySlugApi,
  getRelatedProductsApi,
} from "../../src/api/productApi";
import { useCartStore } from "../STORE/CartStore";

export function useProductDetail() {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlugApi(slug).then((res) => res.data.data),
  });

  const { data: related } = useQuery({
    queryKey: ["related-products", product?.category?._id, slug],
    queryFn: () => getRelatedProductsApi(product.category._id, slug),
    enabled: !!product?.category?._id, // only fetch once we know the category
  });

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToBag = () => {
    if (product?.effectiveBadge === "sold-out") {
      alert("This item is currently out of stock");
      return;
    }

    if (product?.sizes?.length && !selectedSize) {
      alert("Please select a size");
      return;
    }
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      price: product.discountPrice || product.price,
      qty: 1,
      size: selectedSize,
    });
  };

  return {
    product,
    isLoading,
    isError,
    related,
    activeImage,
    setActiveImage,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    handleAddToBag,
  };
}
