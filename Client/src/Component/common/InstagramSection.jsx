// client/src/components/InstagramSection.jsx
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";
import { getActiveInstagramPostsApi } from "../../api/instagramApi";
import { getCloudinaryVideoThumbnail } from "../../utlis/cloudinaryVideoThumbnail.js";

function ReelCard({ post }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    if (post.productLink) {
      navigate(post.productLink);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setMuted((m) => !m);
  };

  return (
    <div
      className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer group bg-[#14151a]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={post.video}
        poster={getCloudinaryVideoThumbnail(post.video)}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />

      <button
        type="button"
        onClick={toggleMute}
        className="absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center"
      >
        {muted ? (
          <VolumeX
            size={12}
            className="text-white"
          />
        ) : (
          <Volume2
            size={12}
            className="text-white"
          />
        )}
      </button>
    </div>
  );
}

export default function InstagramSection() {
  const { data: posts } = useQuery({
    queryKey: ["instagram-posts"],
    queryFn: () => getActiveInstagramPostsApi().then((res) => res.data.data),
  });

  return (
    <section className="px-5 lg:px-16 py-10 text-center">
      {posts?.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {posts.map((post) => (
            <ReelCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <a
          href="https://instagram.com/naariofficial"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-300 text-xs tracking-widest border border-white/20 rounded-full px-5 py-2.5"
        >
          FOLLOW US ON INSTAGRAM
        </a>
      )}
    </section>
  );
}
