// client/src/components/HeroBanner.jsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getActiveBannersApi } from "../../api/BannerApi";

export default function HeroBanner({ heightClass }) {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: () => getActiveBannersApi().then((res) => res.data.data),
  });

  const hero = banners?.find((b) => b.position === "hero");

  if (isLoading) return <div className={`relative ${heightClass} bg-[#14151a]`} />;

  if (!hero) {
    return (
      <div className={`relative ${heightClass} flex items-center justify-center bg-[#14151a]`}>
        <p className="text-gray-600 text-sm">No banner set yet</p>
      </div>
    );
  }

  return (
    <div className={`relative ${heightClass}`}>
      {hero.mediaType === "video" ? (
        <video src={hero.video} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline />
      ) : (
        <img src={hero.image} alt={hero.title || ""} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-black/30 to-black/10 pointer-events-none" />

      {(hero.title || hero.subtitle || hero.buttonText) && (
        <div className="absolute bottom-25 left-6 lg:left-16 right-6 lg:right-auto lg:max-w-md z-10">
          {hero.title && (
            <h1 className="text-3xl lg:text-4xl tracking-wide text-[#F0D68A] font-light">
              {hero.title}
            </h1>
          )}
          {hero.subtitle && (
            <p className="hidden lg:block mt-3 text-gray-300 text-sm">
              {hero.subtitle}
            </p>
          )}
          {hero.buttonText && (
            <Link
              to={hero.link || "/shop"}
              className="inline-block mt-5 px-8 py-3 bg-gradient-to-r from-[#C9962F] to-[#F0D68A] text-black text-sm tracking-widest rounded"
            >
              {hero.buttonText}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}