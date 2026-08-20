// src/pages/Home.jsx
import { useIsMobile } from "../../../hook/useIsMobile";
import HomeDesktop from "./HomeScreenDesktop"; // rename your current Home.jsx content to this
import HomeMobile from "./HomeScreenMobile";

export default function Home() {
  const isMobile = useIsMobile(1024);
  return isMobile ? <HomeMobile /> : <HomeDesktop />;
}