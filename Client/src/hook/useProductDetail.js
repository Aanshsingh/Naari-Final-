// Client/src/hooks/

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  getProductBySlugApi,
  getRelatedProductsApi,
} from "../api/productApi";

import { useCartStore } from "../STORE/CartStore";


// =====================================================
// HELPER
// =====================================================

function getFrontendBadge(product) {
  if (!product) {
    return null;
  }

  // Admin explicitly selected no badge
  if (product.badge === "none") {
    return null;
  }

  // Backend already calculated the effective badge
  if (
    product.effectiveBadge &&
    product.effectiveBadge !== "auto"
  ) {
    return product.effectiveBadge;
  }

  // Calculate basic fallback

  const totalStock =
    Array.isArray(product.sizes) &&
    product.sizes.length > 0
      ? product.sizes.reduce(
          (total, size) =>
            total + (Number(size.stock) || 0),
          0,
        )
      : Number(product.stock) || 0;


  // SOLD OUT

  if (totalStock <= 0) {
    return "sold-out";
  }


  // SALE

  const price = Number(product.price) || 0;

  const discountPrice =
    Number(product.discountPrice) || 0;

  const now = new Date();

  let saleActive =
    discountPrice > 0 &&
    discountPrice < price;


  if (
    saleActive &&
    product.saleStartDate
  ) {
    saleActive =
      now >= new Date(product.saleStartDate);
  }


  if (
    saleActive &&
    product.saleEndDate
  ) {
    saleActive =
      now <= new Date(product.saleEndDate);
  }


  if (saleActive) {
    return "sale";
  }


  return null;
}


// =====================================================
// HOOK
// =====================================================

export function useProductDetail() {

  const { slug } = useParams();

  const [
    activeImage,
    setActiveImage,
  ] = useState(0);

  const [
    selectedColor,
    setSelectedColor,
  ] = useState(null);

  const [
    selectedSize,
    setSelectedSize,
  ] = useState(null);


  // ===================================================
  // PRODUCT
  // ===================================================

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({

    queryKey: [
      "product",
      slug,
    ],

    queryFn: async () => {

      const res =
        await getProductBySlugApi(slug);

      const data =
        res?.data?.data;

      if (!data) {
        throw new Error(
          "Product data not found",
        );
      }

      /*
       * Make sure frontend always has
       * effectiveBadge.
       */

      return {
        ...data,

        effectiveBadge:
          getFrontendBadge(data),

        effectivePrice:
          Number(
            data.effectivePrice ??
              data.discountPrice ??
              data.price ??
              0,
          ),

        isOnSale:
          data.isOnSale === true ||
          (
            Number(data.discountPrice) > 0 &&
            Number(data.discountPrice) <
              Number(data.price)
          ),
      };
    },

    enabled: Boolean(slug),

  });


  // ===================================================
  // RELATED PRODUCTS
  // ===================================================

  const {
    data: related = [],
  } = useQuery({

    queryKey: [
      "related-products",
      product?.category?._id,
      slug,
    ],

    queryFn: async () => {

      const res =
        await getRelatedProductsApi(
          product.category._id,
          slug,
        );

      return Array.isArray(
        res?.data?.data,
      )
        ? res.data.data
        : [];

    },

    enabled:
      Boolean(
        product?.category?._id,
      ),

  });


  // ===================================================
  // CART
  // ===================================================

  const addItem =
    useCartStore(
      (state) => state.addItem,
    );


  // ===================================================
  // ADD TO BAG
  // ===================================================

  const handleAddToBag = () => {

    if (!product) {
      return;
    }


    // -----------------------------------------------
    // CHECK STOCK
    // -----------------------------------------------

    if (
      product.effectiveBadge ===
      "sold-out"
    ) {

      alert(
        "This item is currently out of stock.",
      );

      return;
    }


    // -----------------------------------------------
    // CHECK SIZE
    // -----------------------------------------------

    if (
      product.sizes?.length &&
      !selectedSize
    ) {

      alert(
        "Please select a size.",
      );

      return;
    }


    // -----------------------------------------------
    // CHECK SELECTED SIZE STOCK
    // -----------------------------------------------

    if (
      selectedSize &&
      product.sizes?.length
    ) {

      const selectedSizeData =
        product.sizes.find(
          (size) =>
            size.label ===
            selectedSize,
        );


      if (
        !selectedSizeData ||
        Number(
          selectedSizeData.stock,
        ) <= 0
      ) {

        alert(
          "This size is currently out of stock.",
        );

        return;
      }
    }


    // -----------------------------------------------
    // PRICE
    // -----------------------------------------------

    const price =
      Number(
        product.effectivePrice ??
          product.discountPrice ??
          product.price ??
          0,
      );


    if (!price || price <= 0) {

      alert(
        "This product currently has an invalid price.",
      );

      return;
    }


    // -----------------------------------------------
    // ADD ITEM
    // -----------------------------------------------

    addItem({

      productId:
        product._id,

      name:
        product.name,

      image:
        product.images?.[0]?.url,

      price,

      qty: 1,

      size:
        selectedSize,

    });

  };


  // ===================================================
  // RETURN
  // ===================================================

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