// utils/productDisplay.js
const NEW_THRESHOLD_DAYS = 14;

export function getEffectiveBadge(product) {
  if (product.badge === "none") return null;
  if (product.badge && product.badge !== "auto") return product.badge; // manual override wins

  // auto logic, in priority order
  const totalStock = product.sizes?.length
    ? product.sizes.reduce((sum, s) => sum + s.stock, 0)
    : product.stock;
  if (totalStock === 0) return "sold-out";

  if (isSaleActive(product)) return "sale";

  const daysSinceCreated = (Date.now() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated <= NEW_THRESHOLD_DAYS) return "new";

  return null;
}

export function isSaleActive(product) {
  if (!product.discountPrice) return false;
  const now = new Date();
  if (product.saleStartDate && now < new Date(product.saleStartDate)) return false;
  if (product.saleEndDate && now > new Date(product.saleEndDate)) return false;
  return true;
}

export function getEffectivePrice(product) {
  return isSaleActive(product) ? product.discountPrice : product.price;
}