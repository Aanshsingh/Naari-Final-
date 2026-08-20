// admin/src/components/CategoryFormModal.jsx
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Upload } from "lucide-react";
import { createCategoryApi, updateCategoryApi } from "../api/adminCategoryApi";
import { uploadImageToCloudinary } from "../utils/uploadImage";

export default function CategoryFormModal({ category, onClose }) {
  const isEditing = !!category;
  const queryClient = useQueryClient();
  const [image, setImage] = useState(category?.image || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadImageToCloudinary(file);
      setImage(uploaded.url);
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = e.target.name.value;
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    setSaving(true);
    try {
      if (isEditing) {
        await updateCategoryApi(category._id, { name, slug, image });
      } else {
        await createCategoryApi({ name, slug, image });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // also used by client storefront + product form dropdown
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0e12] border border-white/10 rounded-lg w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg">{isEditing ? "Edit Category" : "Add Category"}</h2>
          <button onClick={onClose} className="text-gray-400"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs tracking-widest text-gray-400">IMAGE (optional)</label>
            <div className="mt-2">
              {image ? (
                <div className="relative w-24 h-24">
                  <img src={image} alt="" className="w-full h-full object-cover rounded" />
                  <button type="button" onClick={() => setImage(null)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ) : (
                <label className="w-24 h-24 border border-dashed border-white/20 rounded flex items-center justify-center cursor-pointer">
                  {uploading ? <span className="text-[9px] text-gray-500">...</span> : <Upload size={18} className="text-gray-500" />}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs tracking-widest text-gray-400">NAME</label>
            <input
              name="name" defaultValue={category?.name} required
              className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
            />
            <p className="text-gray-600 text-[10px] mt-1">
              URL slug will be generated automatically (e.g. "Quad Sets" → "quad-sets")
            </p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit" disabled={saving || uploading}
            className="w-full py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest disabled:opacity-60"
          >
            {saving ? "SAVING..." : isEditing ? "UPDATE CATEGORY" : "CREATE CATEGORY"}
          </button>
        </form>
      </div>
    </div>
  );
}