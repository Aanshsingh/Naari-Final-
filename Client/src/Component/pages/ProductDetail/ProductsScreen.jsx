import { useIsMobile } from "../../../hook/useIsMobile";
import ProductDScreenMobile from "./ProductDScreenMobile.jsx";
import ProductDScreenDesktop from "./ProductDScreenDesktop.jsx";

export default function AuthScreen() {
  const isMobile = useIsMobile(1024);
  return isMobile ? <ProductDScreenMobile /> : <ProductDScreenDesktop />;
}