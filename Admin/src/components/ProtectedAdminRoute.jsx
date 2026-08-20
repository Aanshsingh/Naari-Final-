import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AuthContext";

export default function ProtectedAdminRoute({ children }) {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!admin) return <Navigate to="/login" replace />;
  return children;
}
