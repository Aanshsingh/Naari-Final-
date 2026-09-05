// Server/utils/productDisplay.js

const NEW_THRESHOLD_DAYS = 14;

// ============================================================
// SALE STATUS
// ============================================================

export function isSaleActive(product) {
  if (!product) return false;

  const price = Number(product.price);
  const discountPrice = Number(product.discountPrice);

  // No valid discount
  if (
    product.discountPrice === undefined ||
    product.discountPrice === null ||
    product.discountPrice === "" ||
    !Number.isFinite(discountPrice)
  ) {
    return false;
  }

  // Discount must actually be cheaper
  if (
    !Number.isFinite(price) ||
    discountPrice <= 0 ||
    discountPrice >= price
  ) {
    return false;
  }

  const now = new Date();

  // Sale has not started yet
  if (
    product.saleStartDate &&
    now < new Date(product.saleStartDate)
  ) {
    return false;
  }

  // Sale has ended
  if (
    product.saleEndDate &&
    now > new Date(product.saleEndDate)
  ) {
    return false;
  }

  return true;
}


// ============================================================
// EFFECTIVE PRICE
// ============================================================

export function getEffectivePrice(product) {
  if (!product) return 0;

  const price = Number(product.price) || 0;

  if (isSaleActive(product)) {
    return Number(product.discountPrice);
  }

  return price;
}


// ============================================================
// TOTAL STOCK
// ============================================================

// function getTotalStock(product) {
//   if (!product) return 0;

//   // If sizes exist, use size-level inventory
//   if (
//     Array.isArray(product.sizes) &&
//     product.sizes.length > 0
//   ) {
//     return product.sizes.reduce(
//       (sum, size) =>
//         sum + (Number(size.stock) || 0),
//       0
//     );
//   }

//   return Number(product.stock) || 0;
// }

function getTotalStock(product) {
  if (!product) return 0;
  return Number(product.stock) || 0; // single source of truth for now
}


// ============================================================
// EFFECTIVE BADGE
// ============================================================

export function getEffectiveBadge(product) {
  if (!product) return null;


  // ----------------------------------------------------------
  // Manual "NO BADGE"
  // ----------------------------------------------------------

  if (product.badge === "none") {
    return null;
  }


  // ----------------------------------------------------------
  // Manual badge override
  // ----------------------------------------------------------

  if (
    product.badge &&
    product.badge !== "auto"
  ) {
    return product.badge;
  }


  // ----------------------------------------------------------
  // AUTO BADGE
  // ----------------------------------------------------------

  const totalStock =
    getTotalStock(product);


  // SOLD OUT has highest priority
  if (totalStock <= 0) {
    return "sold-out";
  }


  // SALE comes next
  if (isSaleActive(product)) {
    return "sale";
  }


  // NEW product
  if (product.createdAt) {

    const createdAt =
      new Date(product.createdAt);

    if (!Number.isNaN(createdAt.getTime())) {

      const daysSinceCreated =
        (Date.now() - createdAt.getTime()) /
        (1000 * 60 * 60 * 24);

      if (
        daysSinceCreated >= 0 &&
        daysSinceCreated <= NEW_THRESHOLD_DAYS
      ) {
        return "new";
      }
    }
  }


  // No badge
  return null;
}