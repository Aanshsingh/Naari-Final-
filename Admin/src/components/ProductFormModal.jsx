// admin/src/components/ProductFormModal.jsx

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Upload, ImagePlus } from "lucide-react";

import { createProductApi, updateProductApi } from "../api/adminProductApi";

import { getCategoriesApi } from "../api/adminCategoryApi";
import { uploadImageToCloudinary } from "../utils/uploadImage";

export default function ProductFormModal({ product, onClose }) {
  const isEditing = !!product;

  const queryClient = useQueryClient();

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Existing Cloudinary images when editing
  const [images, setImages] = useState(product?.images || []);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi().then((res) => res.data.data),
  });

  // ==========================================
  // MULTIPLE IMAGE UPLOAD
  // ==========================================

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    // Reset input so same file can be selected again
    e.target.value = "";

    if (!files.length) return;

    setError("");

    // Maximum 6 images
    if (images.length + files.length > 6) {
      setError(
        `You can upload maximum 6 images. You currently have ${images.length}.`,
      );
      return;
    }

    setUploading(true);

    try {
      // Upload all images simultaneously
      const uploadedImages = await Promise.all(
        files.map((file) => uploadImageToCloudinary(file)),
      );

      setImages((prev) => [...prev, ...uploadedImages]);
    } catch (err) {
      console.error("Multiple image upload error:", err);

      setError("One or more images failed to upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ==========================================
  // SUBMIT PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (images.length === 0) {
      setError("Add at least one image");
      return;
    }

    const name = e.target.name.value;

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const payload = {
      name,

      slug,

      description: e.target.description.value,

      price: Number(e.target.price.value),

      discountPrice: e.target.discountPrice.value
        ? Number(e.target.discountPrice.value)
        : undefined,

      category: e.target.category.value,

      stock: Number(e.target.stock.value),

      // All product images
      images,

      fabricCare: e.target.fabricCare.value,  

      sizes: e.target.sizes.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((label) => ({
          label,
          stock: Number(e.target.stock.value),
        })),
    };

    setSaving(true);

    try {
      if (isEditing) {
        await updateProductApi(product._id, payload);
      } else {
        await createProductApi(payload);
      }

      await queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });

      onClose();
    } catch (err) {
      console.error("Save product error:", err);

      setError(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0e12] border border-white/10 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ================================= */}
          {/* MULTIPLE IMAGE UPLOAD */}
          {/* ================================= */}

          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs tracking-widest text-gray-400">
                PRODUCT IMAGES
              </label>

              <span className="text-[10px] text-gray-500">
                {images.length}/6
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              {/* EXISTING / UPLOADED IMAGES */}

              {images.map((img, i) => (
                <div
                  key={`${img.publicId || img.url}-${i}`}
                  className="relative aspect-square"
                >
                  <img
                    src={img.url}
                    alt={`Product ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-white/10"
                  />

                  {/* IMAGE NUMBER */}

                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                    {i + 1}
                  </span>

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                  >
                    <X size={11} className="text-white" />
                  </button>
                </div>
              ))}

              {/* ADD IMAGE BUTTON */}

              {images.length < 6 && (
                <label className="aspect-square border border-dashed border-white/20 hover:border-[#D4A34E]/60 rounded-lg flex flex-col items-center justify-center cursor-pointer transition">
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#D4A34E] border-t-transparent rounded-full animate-spin" />

                      <span className="text-[9px] text-gray-500 mt-2">
                        UPLOADING
                      </span>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={20} className="text-gray-500" />

                      <span className="text-[9px] text-gray-500 mt-2">
                        ADD IMAGES
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            <p className="text-[10px] text-gray-600 mt-2">
              Select up to 6 images at once.
            </p>
          </div>

          {/* NAME */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              NAME
            </label>

            <input
              name="name"
              defaultValue={product?.name}
              required
              className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              DESCRIPTION
            </label>

            <textarea
              name="description"
              defaultValue={product?.description}
              rows={3}
              className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
            />
          </div>

          {/* PRICE */}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs tracking-widest text-gray-400">
                PRICE
              </label>

              <input
                name="price"
                type="number"
                defaultValue={product?.price}
                required
                className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest text-gray-400">
                DISCOUNT PRICE
              </label>

              <input
                name="discountPrice"
                type="number"
                defaultValue={product?.discountPrice}
                className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
              />
            </div>
          </div>

          {/* CATEGORY */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              CATEGORY
            </label>

            <select
              name="category"
              defaultValue={product?.category?._id}
              required
              className="w-full mt-1 bg-[#0d0e12] border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
            >
              <option value="">Select category</option>

              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* STOCK */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              STOCK
            </label>

            <input
              name="stock"
              type="number"
              defaultValue={product?.stock}
              required
              className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
            />
          </div>

          {/* SIZES */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              SIZES (comma-separated, e.g. S, M, L)
            </label>

            <input
              name="sizes"
              defaultValue={product?.sizes?.map((s) => s.label).join(", ")}
              className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
            />
          </div>

          {/* FABRIC CARE  */}

          <div>
            <label className="text-xs tracking-widest text-gray-400">
              FABRIC &amp; CRAFTSMANSHIP
            </label>
            <textarea
              name="fabricCare"
              defaultValue={product?.fabricCare}
              rows={3}
              placeholder="e.g. Pure mulberry silk with hand-woven zari border. Dry clean only."
              className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
            />
          </div>

          {/* ERROR */}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest disabled:opacity-60"
          >
            {saving
              ? "SAVING..."
              : isEditing
                ? "UPDATE PRODUCT"
                : "CREATE PRODUCT"}
          </button>
        </form>
      </div>
    </div>
  );
}
