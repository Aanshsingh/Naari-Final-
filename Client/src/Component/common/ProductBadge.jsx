// client/src/components/ProductBadge.jsx
const badgeStyles = {
  new: "bg-[#D4A34E] text-black",
  sale: "bg-red-500 text-white",
  bestseller: "bg-purple-500 text-white",
  limited: "bg-blue-500 text-white",
  "sold-out": "bg-gray-600 text-gray-200",
};

const badgeLabels = {
  new: "NEW",
  sale: "SALE",
  bestseller: "BESTSELLER",
  limited: "LIMITED",
  "sold-out": "SOLD OUT",
};

export default function ProductBadge({ badge }) {
  if (!badge) return null;
  return (
    <span className={`absolute top-2 left-2 z-10 text-[10px] px-2 py-0.5 rounded tracking-widest ${badgeStyles[badge]}`}>
      {badgeLabels[badge]}
    </span>
  );
}