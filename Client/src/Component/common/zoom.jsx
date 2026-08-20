// src/components/ZoomImage.jsx
import { useState, useRef } from "react";

export default function ZoomImage({ src, alt }) {
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  return (
    <div
      ref={imgRef}
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
      onMouseMove={handleMouseMove}
      className="overflow-hidden rounded-lg cursor-zoom-in"
    >
      <img
        src={src}
        alt={alt}
        style={zoomStyle}
        className={`w-full h-[600px] object-cover transition-transform duration-200 ${isZooming ? "scale-150" : "scale-100"}`}
      />
    </div>
  );
}