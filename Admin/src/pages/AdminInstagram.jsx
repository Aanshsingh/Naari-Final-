// admin/src/pages/AdminInstagram.jsx — replace the form section
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Upload, X, Play } from "lucide-react";
import { getAllPostsAdminApi, createInstagramPostApi, deleteInstagramPostApi } from "../api/adminInstagramApi";
import { getAllProductsApi } from "../api/adminProductApi";
import { uploadVideoToCloudinary } from "../utils/uploadVideo";

export default function AdminInstagram() {
  const [showForm, setShowForm] = useState(false);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-instagram-posts"],
    queryFn: () => getAllPostsAdminApi().then((res) => res.data.data),
  });

  const { data: products } = useQuery({
    queryKey: ["admin-products-list"],
    queryFn: () => getAllProductsApi({ limit: 100 }).then((res) => res.data.data.products),
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const uploaded = await uploadVideoToCloudinary(file);
      setVideo(uploaded.url);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!video) return setError("Upload a video first");
    if (!selectedProduct) return setError("Choose which product this reel links to");

    const product = products.find((p) => p._id === selectedProduct);

    setSaving(true);
    try {
      await createInstagramPostApi({
        mediaType: "video",
        video,
        productLink: `/product/${product.slug}`,
        order: Number(e.target.order.value) || 0,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-instagram-posts"] });
      queryClient.invalidateQueries({ queryKey: ["instagram-posts"] });
      setShowForm(false);
      setVideo(null);
      setSelectedProduct("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save reel");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this reel?")) return;
    await deleteInstagramPostApi(id);
    queryClient.invalidateQueries({ queryKey: ["admin-instagram-posts"] });
    queryClient.invalidateQueries({ queryKey: ["instagram-posts"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-xl font-light">Instagram Reels</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm">
          <Plus size={16} /> Add Reel
        </button>
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {posts?.map((post) => (
          <div key={post._id} className="relative group">
            <video src={post.video} className="w-full aspect-[9/16] object-cover rounded" muted loop playsInline
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => e.target.pause()}
            />
            <Play size={16} className="absolute top-2 left-2 text-white/80" />
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
              <h2 className="text-white text-lg">Add Instagram Reel</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs tracking-widest text-gray-400">VIDEO (9:16 recommended)</label>
                <div className="mt-2">
                  {video ? (
                    <div className="relative w-32 h-56 bg-black rounded overflow-hidden mx-auto">
                      <video src={video} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                      <button type="button" onClick={() => setVideo(null)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-32 h-56 mx-auto border border-dashed border-white/20 rounded flex items-center justify-center cursor-pointer">
                      {uploading ? <span className="text-[10px] text-gray-500">Uploading...</span> : <Upload size={20} className="text-gray-500" />}
                      <input type="file" accept="video/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest text-gray-400">LINKS TO PRODUCT</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                  className="w-full mt-1 bg-[#0d0e12] border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]"
                >
                  <option value="">Choose a product...</option>
                  {products?.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs tracking-widest text-gray-400">ORDER</label>
                <input name="order" type="number" defaultValue={0} className="w-full mt-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm outline-none focus:border-[#D4A34E]" />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button type="submit" disabled={saving || uploading} className="w-full py-3 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest disabled:opacity-60">
                {saving ? "SAVING..." : "ADD REEL"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}