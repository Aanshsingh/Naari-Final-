// admin/src/pages/AdminInstagram.jsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { getAllPostsAdminApi, createInstagramPostApi, deleteInstagramPostApi } from "../api/adminInstagramApi";
import { uploadImageToCloudinary } from "../utils/uploadImage";

export default function AdminInstagram() {
  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-instagram-posts"],
    queryFn: () => getAllPostsAdminApi().then((res) => res.data.data),
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadImageToCloudinary(file);
      setImage(uploaded.url);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Upload an image first");
    setSaving(true);
    try {
      await createInstagramPostApi({ reelUrl: e.target.reelUrl.value, image, order: Number(e.target.order.value) || 0 });
      queryClient.invalidateQueries({ queryKey: ["admin-instagram-posts"] });
      queryClient.invalidateQueries({ queryKey: ["instagram-posts"] }); // client homepage cache
      setShowForm(false);
      setImage(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this post?")) return;
    await deleteInstagramPostApi(id);
    queryClient.invalidateQueries({ queryKey: ["admin-instagram-posts"] });
    queryClient.invalidateQueries({ queryKey: ["instagram-posts"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-xl font-light">Instagram Highlights</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm">
          <Plus size={16} /> Add Post
        </button>
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {posts?.map((post) => (
          <div key={post._id} className="relative">
            <img src={post.image} alt="" className="w-full aspect-square object-cover rounded" />
            <button onClick={() => handleDelete(post._id)} className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center">
              <Trash2 size={12} className="text-white" />
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0e12] border border-white/10 rounded-lg w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-lg">Add Instagram Post</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs tracking-widest text-gray-400">IMAGE</label>
                <div className="mt-2">
                  {image ? (
                    <img src={image} alt="" className="w-24 h-24 object-cover rounded" />
                  ) : (
                    <label className="w-24 h-24 border border-dashed border-white/20 rounded flex items-center justify-center cursor-pointer">
                      {uploading ? <span className="text-[9px] text-gray-500">...</span> : <Upload size={18} className="text-gray-500" />}
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs tracking-widest text-gray-400">REEL / POST LINK</label>
                <input name="reelUrl" required placeholder="https://instagram.com/reel/..." className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]" />
              </div>
              <div>
                <label className="text-xs tracking-widest text-gray-400">ORDER</label>
                <input name="order" type="number" defaultValue={0} className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]" />
              </div>
              <button type="submit" disabled={saving || uploading} className="w-full py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest disabled:opacity-60">
                {saving ? "SAVING..." : "ADD POST"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}