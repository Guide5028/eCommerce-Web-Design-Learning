// Price, Rupiah, and color-name formatting helpers.

// price/priceOld come from pos-api as numeric strings, coerced here and shown as ฿
export function formatPrice(product) {
  return '฿' + Number(product.price).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function formatPriceOld(product) {
  return product.priceOld ? '฿' + Number(product.priceOld).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '';
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
