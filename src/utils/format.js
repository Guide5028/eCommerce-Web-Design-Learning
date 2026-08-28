// Ported from legacy/js/app.js:164-189

export function formatPrice(product) {
  return product.currency + ' ' + product.price.toLocaleString('id-ID');
}

export function formatPriceOld(product) {
  return product.priceOld ? product.currency + ' ' + product.priceOld.toLocaleString('id-ID') : '';
}

export function formatRp(amount) {
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

// json only has hex codes, so map them to names
const COLOR_NAMES = {
  '#2A2A2A': 'Black',
  '#333333': 'Charcoal',
  '#5A5A5A': 'Slate Grey',
  '#6C7BC2': 'Periwinkle Blue',
  '#8C7A63': 'Taupe',
  '#9F9F9F': 'Grey',
  '#B88E2F': 'Gold',
  '#D8CFC2': 'Sand',
  '#E4DED3': 'Ivory',
  '#F3B6C4': 'Blush Pink',
  '#FFFFFF': 'White',
};

export function colorName(hex) {
  return COLOR_NAMES[(hex || '').toUpperCase()] || hex;
}
