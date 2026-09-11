// Client-side mirror of pos-api's promotion.service.ts (getBestPromotionForProduct +
// computeDiscountAmount) -- lets checkout/cart PREVIEW the discount a purchase will get
// before the sale is actually placed. The real charge is still always computed server-side
// at POST /sales; this is display-only and must never be trusted as the final price.

// promo.discountValue/product.price arrive as numeric strings from pos-api in some
// responses -- Number() coerces either shape safely.
export function computeDiscountAmount(promo, lineSubtotal) {
  const value = Number(promo.discountValue);
  if (promo.discountType === 'percentage') {
    return Math.round(lineSubtotal * (value / 100) * 100) / 100;
  }
  return Math.min(value, lineSubtotal);
}

// `promotions` should already be the activeOnly=true list (isActive + within date range
// filtered server-side) -- this only decides which one wins for a given product.
export function pickBestPromotion(promotions, product, categoryIdByName) {
  const categoryId = categoryIdByName?.get(product.category) ?? null;

  const candidates = promotions.filter((promo) => {
    if (promo.scope === 'all') return true;
    if (promo.scope === 'product') return promo.productId === (product.productId ?? product.id);
    if (promo.scope === 'category') return categoryId != null && promo.categoryId === categoryId;
    return false;
  });

  if (candidates.length === 0) return null;

  const specificity = { product: 3, category: 2, all: 1 };
  candidates.sort((a, b) => {
    const specDiff = specificity[b.scope] - specificity[a.scope];
    if (specDiff !== 0) return specDiff;
    return Number(b.discountValue) - Number(a.discountValue);
  });

  return candidates[0];
}
