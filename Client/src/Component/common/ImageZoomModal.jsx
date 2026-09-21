// client/src/components/ImageZoomModal.jsx
import { useState, useRef } from "react";
import { X } from "lucide-react";

export default function ImageZoomModal({ src, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");
  const lastTapRef = useRef(0);

  const handleDoubleTapZoom = (e) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // double-tap detected
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.changedTouches?.[0]?.clientX ?? e.clientX) - rect.left) / rect.width * 100;
      const y = ((e.changedTouches?.[0]?.clientY ?? e.clientY) - rect.top) / rect.height * 100;
      setOrigin(`${x}% ${y}%`);
      setScale((s) => (s === 1 ? 2.5 : 1));
    }
    lastTapRef.current = now;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white"
      >
        <X size={20} />
      </button>

      <div
        className="w-full h-full overflow-hidden flex items-center justify-center"
        onTouchEnd={handleDoubleTapZoom}
        onDoubleClick={handleDoubleTapZoom}
      >
        <img
          src={src}
          alt={alt}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: origin,
            transition: "transform 0.2s ease-out",
          }}
          className="max-w-full max-h-full object-contain select-none"
          draggable="false"
        />
      </div>

      <p className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-xs">
        Double-tap to zoom
      </p>
    </div>
  );
}