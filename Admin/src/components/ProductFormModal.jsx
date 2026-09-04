// Admin/src/components/ProductFormModal.jsx

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X, ImagePlus } from "lucide-react";

import {
  createProductApi,
  updateProductApi,
} from "../api/adminProductApi";

import { getCategoriesApi } from "../api/adminCategoryApi";
import { uploadImageToCloudinary } from "../utils/uploadImage";

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export default function ProductFormModal({ product, onClose }) {
  const isEditing = Boolean(product);

  const queryClient = useQueryClient();

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Existing / uploaded images
  const [images, setImages] = useState(
    Array.isArray(product?.images) ? product.images : [],
  );

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategoriesApi();

      return Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
    },
  });

  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    // Allow selecting same file again
    e.target.value = "";

    if (!files.length) return;

    setError("");

    // Check image count
    if (images.length + files.length > MAX_IMAGES) {
      setError(
        `You can upload maximum ${MAX_IMAGES} images. You currently have ${images.length}.`,
      );
      return;
    }

    // Validate all files BEFORE uploading anything
    const invalidFile = files.find(
      (file) =>
        !ALLOWED_IMAGE_TYPES.includes(file.type) ||
        file.size > MAX_IMAGE_SIZE,
    );

    if (invalidFile) {
      setError(
        `"${invalidFile.name}" is invalid. Only JPG, PNG, WEBP and AVIF images up to 5MB are allowed.`,
      );
      return;
    }

    setUploading(true);

    try {
      const uploadedImages = [];
      const failedImages = [];

      for (const file of files) {
        try {
          const uploaded = await uploadImageToCloudinary(file);

          if (!uploaded?.url) {
            throw new Error(
              "Cloudinary did not return an image URL.",
            );
          }

          uploadedImages.push({
            url: uploaded.url,
            publicId:
              uploaded.publicId ||
              uploaded.public_id ||
              "",
          });
        } catch (uploadError) {
          console.error(
            `Failed to upload ${file.name}:`,
            uploadError,
          );

          failedImages.push(file.name);
        }
      }

      if (uploadedImages.length === 0) {
        setError(
          "Images failed to upload. Please check Cloudinary configuration and try again.",
        );
        return;
      }

      setImages((prev) => [
        ...prev,
        ...uploadedImages,
      ]);

      if (failedImages.length > 0) {
        setError(
          `Some images failed to upload: ${failedImages.join(", ")}`,
        );
      }
    } catch (err) {
      console.error("Image upload error:", err);

      setError(
        err?.message ||
          "Image upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving || uploading) return;

    setError("");

    const form = e.target;

    // ==========================================
    // READ FORM VALUES
    // ==========================================

    const name = form.name.value.trim();

    const description =
      form.description.value.trim();

    const price = Number(form.price.value);

    const discountPrice =
      form.discountPrice.value.trim() !== ""
        ? Number(form.discountPrice.value)
        : undefined;

    const stock = Number(form.stock.value);

    const category = form.category.value;

    const badge = form.badge.value;

    const saleStartDate =
      form.saleStartDate.value || undefined;

    const saleEndDate =
      form.saleEndDate.value || undefined;

    const fabricCare =
      form.fabricCare.value.trim();

    const sizesText =
      form.sizes.value.trim();

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!name) {
      setError("Product name is required.");
      return;
    }

    if (name.length < 2) {
      setError(
        "Product name must contain at least 2 characters.",
      );
      return;
    }

    if (name.length > 120) {
      setError(
        "Product name cannot exceed 120 characters.",
      );
      return;
    }

    // ==========================================
    // PRICE VALIDATION
    // ==========================================

    if (!Number.isFinite(price) || price <= 0) {
      setError(
        "Price must be a valid number greater than 0.",
      );
      return;
    }

    if (
      discountPrice !== undefined &&
      (!Number.isFinite(discountPrice) ||
        discountPrice <= 0)
    ) {
      setError(
        "Sale price must be greater than 0.",
      );
      return;
    }

    if (
      discountPrice !== undefined &&
      discountPrice >= price
    ) {
      setError(
        "Sale price must be lower than the original price.",
      );
      return;
    }

    // ==========================================
    // STOCK VALIDATION
    // ==========================================

    if (
      !Number.isFinite(stock) ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        "Total stock must be a valid non-negative whole number.",
      );
      return;
    }

    // ==========================================
    // CATEGORY VALIDATION
    // ==========================================

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (categoriesError) {
      setError(
        "Categories could not be loaded. Please refresh and try again.",
      );
      return;
    }

    // ==========================================
    // IMAGE VALIDATION
    // ==========================================

    if (images.length === 0) {
      setError(
        "Add at least one product image.",
      );
      return;
    }

    if (images.length > MAX_IMAGES) {
      setError(
        `Maximum ${MAX_IMAGES} images are allowed.`,
      );
      return;
    }

    // ==========================================
    // SALE DATE VALIDATION
    // ==========================================

    if (saleStartDate && saleEndDate) {
      const start = new Date(
        `${saleStartDate}T00:00:00`,
      );

      const end = new Date(
        `${saleEndDate}T23:59:59`,
      );

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
      ) {
        setError(
          "Please enter valid sale dates.",
        );
        return;
      }

      if (end < start) {
        setError(
          "Sale end date cannot be before sale start date.",
        );
        return;
      }
    }

    // ==========================================
    // SALE DATE WITHOUT SALE PRICE
    // ==========================================

    if (
      (saleStartDate || saleEndDate) &&
      discountPrice === undefined
    ) {
      setError(
        "Add a sale price when using sale dates.",
      );
      return;
    }

    // ==========================================
    // SIZES
    // ==========================================

    const sizeLabels = sizesText
      ? sizesText
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean)
          .filter(
            (size, index, array) =>
              array.indexOf(size) === index,
          )
      : [];

    /*
      IMPORTANT:

      We keep TOTAL STOCK separate from size stock.

      Example:

      Total stock = 10
      Sizes = S, M, L

      We DO NOT create:

      S = 10
      M = 10
      L = 10

      because that would actually represent 30 pieces.

      Instead, size stock starts at 0 and can be
      managed separately later.

      If you want size-level inventory now,
      the form should have separate stock inputs
      for every size.
    */

    const sizes = sizeLabels.map((label) => ({
      label,
      stock: 0,
    }));

    // ==========================================
    // SLUG
    // ==========================================

    /*
      IMPORTANT:

      Existing product keeps its old slug.

      This prevents existing product URLs from
      breaking when the product name is edited.
    */

    const slug =
      isEditing && product?.slug
        ? product.slug
        : generateSlug(name);

    if (!slug) {
      setError(
        "Could not generate a valid product URL slug.",
      );
      return;
    }

    // ==========================================
    // PAYLOAD
    // ==========================================

    const payload = {
      name,
      slug,
      description,

      price,

      ...(discountPrice !== undefined
        ? { discountPrice }
        : { discountPrice: undefined }),

      category,

      stock,

      sizes,

      badge: badge || "auto",

      saleStartDate,

      saleEndDate,

      images,

      fabricCare,
    };

    // ==========================================
    // SAVE
    // ==========================================

    setSaving(true);

    try {
      if (isEditing) {
        await updateProductApi(
          product._id,
          payload,
        );
      } else {
        await createProductApi(payload);
      }

      // Refresh admin product list
      await queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });

      // Also refresh any product queries
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      onClose();
    } catch (err) {
      console.error(
        "Save product error:",
        err,
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Could not save product.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0d0e12] p-6">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg text-white">
              {isEditing
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <p className="mt-1 text-[10px] text-gray-500">
              {isEditing
                ? "Update product information"
                : "Add a new product to your store"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving || uploading}
            className="text-gray-400 transition hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* ==========================================
              IMAGES
          ========================================== */}

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs tracking-widest text-gray-400">
                PRODUCT IMAGES
              </label>

              <span className="text-[10px] text-gray-500">
                {images.length}/{MAX_IMAGES}
              </span>
            </div>

            <p className="mt-1 text-[10px] text-gray-600">
              First image will be used as the primary
              product image.
            </p>

            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">

              {images.map((img, index) => (
                <div
                  key={`${img.publicId || img.url}-${index}`}
                  className="group relative aspect-square"
                >

                  <img
                    src={img.url}
                    alt={`Product image ${index + 1}`}
                    className="h-full w-full rounded-lg border border-white/10 object-cover"
                  />

                  {/* IMAGE NUMBER */}

                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-white">
                    {index === 0
                      ? "PRIMARY"
                      : index + 1}
                  </span>

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    disabled={saving || uploading}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600 disabled:opacity-50"
                  >
                    <X size={12} />
                  </button>

                </div>
              ))}

              {/* ADD IMAGE */}

              {images.length < MAX_IMAGES && (
                <label
                  className={`aspect-square cursor-pointer rounded-lg border border-dashed border-white/20 transition hover:border-[#D4A34E]/70 ${
                    uploading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >

                  <div className="flex h-full flex-col items-center justify-center">

                    {uploading ? (
                      <>
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4A34E] border-t-transparent" />

                        <span className="mt-2 text-[9px] text-gray-500">
                          UPLOADING
                        </span>
                      </>
                    ) : (
                      <>
                        <ImagePlus
                          size={22}
                          className="text-gray-500"
                        />

                        <span className="mt-2 text-[9px] text-gray-500">
                          ADD IMAGES
                        </span>
                      </>
                    )}

                  </div>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    onChange={handleImageUpload}
                    disabled={
                      uploading || saving
                    }
                    className="hidden"
                  />

                </label>
              )}

            </div>

            <p className="mt-2 text-[10px] text-gray-600">
              JPG, PNG, WEBP or AVIF · Maximum 5MB
              each · Maximum 6 images
            </p>
          </div>

          {/* ==========================================
              NAME
          ========================================== */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              PRODUCT NAME
            </label>

            <input
              name="name"
              defaultValue={
                product?.name || ""
              }
              required
              maxLength={120}
              placeholder="e.g. Handwoven Banarasi Silk Saree"
              className="mt-1 w-full rounded border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#D4A34E]"
            />
          </div>

          {/* ==========================================
              DESCRIPTION
          ========================================== */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              DESCRIPTION
            </label>

            <textarea
              name="description"
              defaultValue={
                product?.description || ""
              }
              rows={4}
              maxLength={2000}
              placeholder="Describe the product..."
              className="mt-1 w-full resize-none rounded border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#D4A34E]"
            />
          </div>

          {/* ==========================================
              PRICE + DISCOUNT
          ========================================== */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <div>
              <label className="text-xs tracking-widest text-gray-400">
                PRICE
              </label>

              <input
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                defaultValue={
                  product?.price ?? ""
                }
                required
                placeholder="0.00"
                className="mt-1 w-full rounded border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#D4A34E]"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest text-gray-400">
                SALE PRICE
              </label>

              <input
                name="discountPrice"
                type="number"
                min="0.01"
                step="0.01"
                defaultValue={
                  product?.discountPrice ?? ""
                }
                placeholder="Optional"
                className="mt-1 w-full rounded border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#D4A34E]"
              />

              <p className="mt-1 text-[10px] text-gray-600">
                Must be lower than the original price.
              </p>
            </div>

          </div>

          {/* ==========================================
              BADGE
          ========================================== */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              PRODUCT BADGE
            </label>

            <select
              name="badge"
              defaultValue={
                product?.badge || "auto"
              }
              className="mt-1 w-full rounded border border-white/20 bg-[#0d0e12] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#D4A34E]"
            >

              <option value="auto">
                Auto — based on product data
              </option>

              <option value="bestseller">
                Bestseller
              </option>

              <option value="limited">
                Limited Edition
              </option>

              <option value="new">
                New
              </option>

              <option value="sale">
                Sale
              </option>

              <option value="none">
                No Badge
              </option>

            </select>

            <p className="mt-1 text-[10px] text-gray-600">
              Auto shows Sold Out, Sale or New based
              on the product state.
            </p>
          </div>

          {/* ==========================================
              SALE DATES
          ========================================== */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* SALE START */}

            <div>
              <label className="text-xs tracking-widest text-gray-400">
                SALE STARTS
              </label>

              <input
                name="saleStartDate"
                type="date"
                defaultValue={
                  product?.saleStartDate
                    ? product.saleStartDate.slice(
                        0,
                        10,
                      )
                    : ""
                }
                onClick={(e) => {
                  e.currentTarget.showPicker?.();
                }}
                className="mt-1 w-full cursor-pointer rounded border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#D4A34E]"
              />
            </div>

            {/* SALE END */}

            <div>
              <label className="text-xs tracking-widest text-gray-400">
                SALE ENDS
              </label>

              <input
                name="saleEndDate"
                type="date"
                defaultValue={
                  product?.saleEndDate
                    ? product.saleEndDate.slice(
                        0,
                        10,
                      )
                    : ""
                }
                onClick={(e) => {
                  e.currentTarget.showPicker?.();
                }}
                className="mt-1 w-full cursor-pointer rounded border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#D4A34E]"
              />
            </div>

          </div>

          <p className="text-[10px] text-gray-600">
            Leave both blank if you don't want a
            scheduled sale.
          </p>

          {/* ==========================================
              CATEGORY
          ========================================== */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              CATEGORY
            </label>

            <select
              name="category"
              defaultValue={
                product?.category?._id || ""
              }
              required
              disabled={categoriesLoading}
              className="mt-1 w-full rounded border border-white/20 bg-[#0d0e12] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#D4A34E]"
            >

              <option value="">
                {categoriesLoading
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categories.map((cat) => (
                <option
                  key={cat._id}
                  value={cat._id}
                >
                  {cat.name}
                </option>
              ))}

            </select>

            {categoriesError && (
              <p className="mt-1 text-[10px] text-red-400">
                Failed to load categories.
              </p>
            )}
          </div>

          {/* ==========================================
              STOCK
          ========================================== */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              TOTAL STOCK
            </label>

            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              defaultValue={
                product?.stock ?? 0
              }
              required
              className="mt-1 w-full rounded border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#D4A34E]"
            />

            <p className="mt-1 text-[10px] text-gray-600">
              Total quantity available for this product.
            </p>
          </div>

          {/* ==========================================
              SIZES
          ========================================== */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              SIZES
            </label>

            <input
              name="sizes"
              defaultValue={
                product?.sizes
                  ?.map((s) => s.label)
                  .join(", ") || ""
              }
              placeholder="S, M, L, XL"
              className="mt-1 w-full rounded border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#D4A34E]"
            />

            <p className="mt-1 text-[10px] text-gray-600">
              Separate sizes using commas. Size-level
              stock is currently kept separate from
              total stock.
            </p>
          </div>

          {/* ==========================================
              FABRIC & CARE
          ========================================== */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              FABRIC & CRAFTSMANSHIP
            </label>

            <textarea
              name="fabricCare"
              defaultValue={
                product?.fabricCare || ""
              }
              rows={4}
              maxLength={1000}
              placeholder="e.g. Pure mulberry silk with hand-woven zari border. Dry clean only."
              className="mt-1 w-full resize-none rounded border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#D4A34E]"
            />
          </div>

          {/* ==========================================
              ERROR
          ========================================== */}

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* ==========================================
              SUBMIT
          ========================================== */}

          <button
            type="submit"
            disabled={
              saving ||
              uploading ||
              categoriesLoading ||
              categoriesError
            }
            className="w-full rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] py-3 text-sm tracking-widest text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? isEditing
                ? "UPDATING..."
                : "CREATING..."
              : uploading
                ? "UPLOADING IMAGES..."
                : isEditing
                  ? "UPDATE PRODUCT"
                  : "CREATE PRODUCT"}
          </button>

        </form>
      </div>
    </div>
  );
}