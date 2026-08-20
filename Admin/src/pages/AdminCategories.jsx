// admin/src/pages/AdminCategories.jsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit } from "lucide-react";
import { getCategoriesApi, deleteCategoryApi } from "../api/adminCategoryApi";
import CategoryFormModal from "../components/CategoryFormModal";

export default function AdminCategories() {
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => getCategoriesApi().then((res) => res.data.data),
  });

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? Products in it will keep their reference, but it won't be selectable going forward.")) return;
    try {
      await deleteCategoryApi(id);
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete category");
    }
  };

  const openCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-xl font-light">Categories</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories?.map((cat) => (
          <div key={cat._id} className="bg-[#14151a] rounded-lg overflow-hidden">
            <div className="w-full h-24 bg-white/5 flex items-center justify-center">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-600 text-xs">No image</span>
              )}
            </div>
            <div className="p-3">
              <p className="text-white text-sm">{cat.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">/{cat.slug}</p>
              <div className="flex justify-between items-center mt-3">
                <button onClick={() => openEdit(cat)} className="text-gray-400 hover:text-[#D4A34E]">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CategoryFormModal category={editingCategory} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}