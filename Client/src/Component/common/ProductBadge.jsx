// Client/src/components/ProductBadge.jsx

const badgeStyles = {
  new: "bg-[#D4A34E] text-black text-[14px]",

  sale: "bg-red-500 text-white text-[14px]",

  bestseller: "bg-purple-500 text-white text-[13px] w-26",

  limited:
    "bg-blue-500 text-white text-[14px]",

  "sold-out":
    "bg-gray-600 text-gray-200",
};

const badgeLabels = {
  new: "NEW",

  sale: "SALE",

  bestseller: "BESTSELLER",

  limited: "LIMITED",

  "sold-out": "SOLD OUT",
};

export default function ProductBadge({ badge }) {

  // No badge
  if (!badge || badge === "none" || badge === "auto") {
    return null;
  }

  // Unknown badge protection
  if (!badgeStyles[badge]) {
    console.warn(
      "Unknown product badge:",
      badge,
    );

    return null;
  }

return (
<span
  className={`
    absolute
    top-18
    left-3
    z-30
    flex
    h-10
    w-20
    items-center
    justify-center
    rounded-xl
    px-1
    text-center
    
    font-semibold
    tracking-widest
    shadow-[0_2px_8px_rgba(0,0,0,0.5)]
    ${badgeStyles[badge]}
  `}
>
  {badgeLabels[badge]}
</span>
);
}