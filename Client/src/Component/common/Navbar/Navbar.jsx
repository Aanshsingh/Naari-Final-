// src/components/Navbar.jsx
import { useIsMobile } from "../../../hook/useIsMobile";
import NavbarDesktop from "./NavBarDesktop";
import NavbarMobile from "./NavbarMobile";

export default function Navbar() {
  const isMobile = useIsMobile(1024);
  return isMobile ? <NavbarMobile /> : <NavbarDesktop />;
}
