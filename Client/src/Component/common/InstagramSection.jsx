// client/src/components/InstagramSection.jsx
import { useQuery } from "@tanstack/react-query";
import { FaInstagram } from "react-icons/fa";

import { getActiveInstagramPostsApi } from "../../api/instagramApi.js";

export default function InstagramSection() {
  const { data: posts } = useQuery({
    queryKey: ["instagram-posts"],
    queryFn: () => getActiveInstagramPostsApi().then((res) => res.data.data),
  });

  return (
    <section className="px-5 lg:px-16 py-10 text-center">
      <a
        href="https://instagram.com/naariofficial"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-gray-300 text-xs tracking-widest mb-6"
      >
        <FaInstagram size={14} className="text-[#D4A34E]" /> @NAARIOFFICIAL
      </a>

      {posts?.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
          {posts.map((post) => (
            <a
              key={post._id}
              href={post.reelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square rounded overflow-hidden relative group"
            >
              <img src={post.image} alt="" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                <Instagram size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      ) : (
        <a
          href="https://www.instagram.com/naariethnicbyprerna"
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