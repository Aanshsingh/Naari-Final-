import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../Component/common/Navbar/Navbar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
}