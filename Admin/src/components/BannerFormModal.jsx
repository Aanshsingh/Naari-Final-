// admin/src/components/BannerFormModal.jsx
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Upload } from "lucide-react";
import { createBannerApi } from "../api/adminBannerApi";
import { uploadImageToCloudinary } from "../utils/uploadImage";

export default function BannerFormModal({ onClose }) {
  const queryClient = useQueryClient();
  const [image, setImage] = useState(null);
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
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!image) {
      setError("Upload a banner image first");
      return;
    }

    setSaving(true);
    try {
      await createBannerApi({
        title: e.target.title.value,
        image,
        link: e.target.link.value,
        position: e.target.position.value,
        order: Number(e.target.order.value) || 0,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save banner");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d0e12] border border-white/10 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg">Add Banner</h2>
          <button onClick={onClose} className="text-gray-400"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs tracking-widest text-gray-400">IMAGE</label>
            <div className="mt-2">
              {image ? (
                <div className="relative w-full h-32">
                  <img src={image} alt="" className="w-full h-full object-cover rounded" />
                  <button type="button" onClick={() => setImage(null)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-32 border border-dashed border-white/20 rounded flex items-center justify-center cursor-pointer">
                  {uploading ? <span className="text-xs text-gray-500">Uploading...</span> : <Upload size={20} className="text-gray-500" />}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs tracking-widest text-gray-400">TITLE</label>
            <input name="title" className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]" />
          </div>

          <div>
            <label className="text-xs tracking-widest text-gray-400">LINK (optional, e.g. /shop?category=sarees)</label>
            <input name="link" className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs tracking-widest text-gray-400">POSITION</label>
              <select name="position" className="w-full mt-1 bg-[#0d0e12] border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]">
                <option value="hero">Hero</option>
                <option value="mid-page">Mid-page</option>
                <option value="footer">Footer</option>
              </select>
            </div>
            <div>
              <label className="text-xs tracking-widest text-gray-400">ORDER</label>
              <input name="order" type="number" defaultValue={0} className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]" />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={saving || uploading} className="w-full py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest disabled:opacity-60">
            {saving ? "SAVING..." : "CREATE BANNER"}
          </button>
        </form>
      </div>
    </div>
  );
}