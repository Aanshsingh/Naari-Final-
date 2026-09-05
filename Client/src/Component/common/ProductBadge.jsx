// Client/src/components/ProductBadge.jsx

const badgeStyles = {
  new: "bg-[#D4A34E] text-black",

  sale: "bg-red-500 text-white",

  bestseller: "bg-purple-500 text-white",

  limited:
    "bg-blue-500 text-white",

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
        top-3
        left-3
        z-30
        rounded
        px-2.5
        py-1
        text-[10px]
        font-medium
        tracking-widest
        shadow-lg
        ${badgeStyles[badge]}
      `}
    >
      {badgeLabels[badge]}
    </span>
  );
}