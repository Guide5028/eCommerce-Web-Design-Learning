// Ported from legacy/js/app.js:686-707

export function matchesFilters(product, filters) {
  const f = filters;
  if (f.search) {
    const haystack = (product.name + ' ' + product.category + ' ' + product.tags.join(' ')).toLowerCase();
    if (haystack.indexOf(f.search.toLowerCase()) === -1) return false;
  }
  if (f.tags.length && !f.tags.some((tag) => product.tags.indexOf(tag) !== -1)) {
    return false;
  }
  if (f.minPrice != null && product.price < f.minPrice) return false;
  if (f.maxPrice != null && product.price > f.maxPrice) return false;
  return true;
}

export function sortProducts(products, mode) {
  const sorted = products.slice();
  if (mode === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (mode === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  else if (mode === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
  else if (mode === 'name-desc') sorted.sort((a, b) => b.name.localeCompare(a.name));
  return sorted;
}

// tags that appear on more than one product, most-common first
export function buildFilterTags(products) {
  const counts = {};
  products.forEach((p) => {
    p.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  return Object.keys(counts)
    .filter((tag) => counts[tag] > 1)
    .sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
}
