// src/pages/SearchBar/AuthScreen.jsx
import { useIsMobile } from "../../../hook/useIsMobile.js";
import SearchBarMobile from "./SearchBarMobile.jsx";
import SearchBarDesktop from "./SearchBarDesktop.jsx";

export default function SearchBar() {
  const isMobile = useIsMobile(1024);
  return isMobile ? <SearchBarMobile /> : <SearchBarDesktop />;
}