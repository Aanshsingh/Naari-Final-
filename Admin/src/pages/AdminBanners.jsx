// admin/src/pages/AdminBanners.jsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { getAllBannersAdminApi, updateBannerApi, deleteBannerApi } from "../api/adminBannerApi";
import BannerFormModal from "../components/BannerFormModal";

export default function AdminBanners() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: banners, isLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: () => getAllBannersAdminApi().then((res) => res.data.data),
  });

  const toggleActive = async (banner) => {
    await updateBannerApi(banner._id, { isActive: !banner.isActive });
    queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    await deleteBannerApi(id);
    queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-xl font-light">Homepage Banner</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {banners?.map((banner) => (
          <div key={banner._id} className="bg-[#14151a] rounded-lg overflow-hidden">
            {banner.mediaType === "video" ? (
              <video src={banner.video} className="w-full h-32 object-cover" muted loop autoPlay playsInline />
            ) : (
              <img src={banner.image} alt={banner.title} className="w-full h-32 object-cover" />
            )}
            <div className="p-3">
              <p className="text-white text-sm truncate">{banner.title || "Untitled"}</p>
              <p className="text-gray-500 text-xs mt-1">Position: {banner.position}</p>
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => toggleActive(banner)}
                  className={`text-[10px] px-2 py-1 rounded border ${banner.isActive ? "text-green-400 border-green-400/40" : "text-gray-500 border-gray-500/40"}`}
                >
                  {banner.isActive ? "LIVE ON SITE" : "INACTIVE"}
                </button>
                <button onClick={() => handleDelete(banner._id)} className="text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <BannerFormModal onClose={() => setShowModal(false)} />}
    </div>
  );
}