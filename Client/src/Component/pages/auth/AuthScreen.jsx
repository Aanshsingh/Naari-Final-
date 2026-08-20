// src/pages/auth/AuthScreen.jsx
import { useIsMobile } from "../../../hook/useIsMobile";
import AuthScreenMobile from "./AuthScreenMobile";
import AuthScreenDesktop from "./AuthScreenDesktop";

export default function AuthScreen() {
  const isMobile = useIsMobile(1024);
  return isMobile ? <AuthScreenMobile /> : <AuthScreenDesktop />;
}