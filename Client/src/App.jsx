// client/src/App.jsx (or wherever your top-level render happens, above RootLayout)
import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import SplashScreen from "./Component/common/SplashScreen.jsx";

export default function App({ queryClient, router }) {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("naari-splash-shown")
  );

  const handleSplashComplete = () => {
    sessionStorage.setItem("naari-splash-shown", "true");
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}