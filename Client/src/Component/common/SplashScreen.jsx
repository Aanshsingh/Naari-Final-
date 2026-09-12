// client/src/components/SplashScreen.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAME = "Naari";

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState("typing"); // typing → glow → shrink → done
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typedCount >= NAME.length) {
      const t = setTimeout(() => setPhase("glow"), 200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTypedCount((c) => c + 1), 120);
    return () => clearTimeout(t);
  }, [phase, typedCount]);

  useEffect(() => {
    if (phase !== "glow") return;
    const t = setTimeout(() => setPhase("shrink"), 700);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "shrink") return;
    const t = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 600);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[999] bg-[#0d0e12] flex items-center justify-center"
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <motion.h1
            className="text-5xl lg:text-6xl font-light tracking-[0.3em]"
            style={{
              color: "#F0D68A",
              textShadow: phase === "glow"
                ? "0 0 24px rgba(240,214,138,0.9), 0 0 48px rgba(212,163,78,0.6)"
                : "none",
            }}
            animate={
              phase === "shrink"
                ? {
                    scale: 0.3,
                    x: "-40vw",
                    y: "-45vh",
                    transition: { duration: 0.6, ease: "easeInOut" },
                  }
                : {}
            }
          >
            {NAME.slice(0, typedCount)}
            {phase === "typing" && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="inline-block w-[2px] h-8 bg-[#F0D68A] ml-1 align-middle"
              />
            )}
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}