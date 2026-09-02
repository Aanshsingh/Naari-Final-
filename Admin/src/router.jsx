import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import AdminLayout from "./layout/AdminLayout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetail from "./pages/OrderDetail";
import AdminProducts from "./pages/AdminProducts";
import AdminBanners from "./pages/AdminBanners";
import AdminReviews from "./pages/AdminReviews";
import AdminSales from "./pages/AdminSales";
import AdminCategories from "./pages/AdminCategories";
import AdminInstagram from "./pages/AdminInstagram.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "login", element: <AdminLogin /> },
      {
        path: "/",
        element: (
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "orders/:orderId", element: <AdminOrderDetail /> },
          { path: "products", element: <AdminProducts /> },
          { path: "banners", element: <AdminBanners /> },
          { path: "reviews", element: <AdminReviews /> },
          { path: "sales", element: <AdminSales /> },
          { path: "categories", element: <AdminCategories /> },
          { path: "instagram", element: <AdminInstagram /> },
        ],
      },
    ],
  },
]);

export default router;
