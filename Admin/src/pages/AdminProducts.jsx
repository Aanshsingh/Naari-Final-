// admin/src/pages/AdminProducts.jsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit } from "lucide-react";
import { getAllProductsApi, deleteProductApi } from "../api/adminProductApi";
import ProductFormModal from "../components/ProductFormModal";

export default function AdminProducts() {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getAllProductsApi({ limit: 100 }).then((res) => res.data.data),
  });

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProductApi(id);
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  };

  const openCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  // admin/src/pages/AdminProducts.jsx — replace the return statement's table section
return (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-white text-xl font-light">Products</h1>
      <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm">
        <Plus size={16} /> Add Product
      </button>
    </div>

    {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}

    {/* Desktop: table */}
    <div className="hidden lg:block bg-[#14151a] rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 text-xs border-b border-white/5">
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {data?.products?.map((product) => (
            <tr key={product._id} className="border-b border-white/5 last:border-0">
              <td className="px-4 py-3">
                <img src={product.images?.[0]?.url} alt="" className="w-10 h-12 object-cover rounded" />
              </td>
              <td className="px-4 py-3 text-gray-300">{product.name}</td>
              <td className="px-4 py-3 text-[#D4A34E]">₹{product.price.toLocaleString("en-IN")}</td>
              <td className="px-4 py-3 text-gray-400">{product.stock}</td>
              <td className="px-4 py-3">
                <span className={`text-[10px] px-2 py-1 rounded ${product.isActive ? "text-green-400 border border-green-400/40" : "text-gray-500 border border-gray-500/40"}`}>
                  {product.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button onClick={() => openEdit(product)} className="text-gray-400 hover:text-[#D4A34E]"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(product._id)} className="text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile: cards */}
    <div className="lg:hidden space-y-3">
      {data?.products?.map((product) => (
        <div key={product._id} className="flex gap-3 bg-[#14151a] p-3 rounded-lg">
          <img src={product.images?.[0]?.url} alt="" className="w-16 h-20 object-cover rounded shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <p className="text-white text-sm truncate">{product.name}</p>
              <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded ${product.isActive ? "text-green-400 border border-green-400/40" : "text-gray-500 border border-gray-500/40"}`}>
                {product.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
            <p className="text-[#D4A34E] text-sm mt-1">₹{product.price.toLocaleString("en-IN")}</p>
            <p className="text-gray-500 text-xs mt-0.5">Stock: {product.stock}</p>
            <div className="flex gap-4 mt-2">
              <button onClick={() => openEdit(product)} className="flex items-center gap-1 text-gray-400 text-xs">
                <Edit size={12} /> Edit
              </button>
              <button onClick={() => handleDelete(product._id)} className="flex items-center gap-1 text-red-400 text-xs">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {showModal && <ProductFormModal product={editingProduct} onClose={() => setShowModal(false)} />}
  </div>
);
}

