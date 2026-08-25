(function (global) {
  let cache = null;

  function fetchProducts() {
    if (cache) return cache;
    cache = fetch('data/products.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load products.json');
        return res.json();
      })
      .then(function (data) {
        return data.products;
      });
    return cache;
  }

  function formatPrice(product) {
    return product.currency + ' ' + product.price.toLocaleString('id-ID');
  }

  function formatPriceOld(product) {
    return product.priceOld ? product.currency + ' ' + product.priceOld.toLocaleString('id-ID') : '';
  }

  function badgeHTML(product) {
    if (!product.badge) return '';
    return '<span class="badge badge--' + product.badge.type + '">' + product.badge.label + '</span>';
  }

  function priceOldHTML(product) {
    return product.priceOld ? '<span class="price-old">' + formatPriceOld(product) + '</span>' : '';
  }

  function productCardHTML(product) {
    var detailHref = 'single_product_page.html?id=' + product.id;
    return (
      '<div class="product-card" data-product-id="' + product.id + '">' +
      '<div class="product-thumb">' +
      '<a href="' + detailHref + '"><img src="' + product.image + '" alt="' + product.alt + '"></a>' +
      badgeHTML(product) +
      '</div>' +
      '<div class="product-info">' +
      '<h3 class="product-name"><a href="' + detailHref + '">' + product.name + '</a></h3>' +
      '<p class="product-category">' + product.category + '</p>' +
      '<div class="product-price">' +
      '<span class="price">' + formatPrice(product) + '</span>' +
      priceOldHTML(product) +
      '</div>' +
      '</div>' +
      '<div class="product-overlay">' +
      '<button class="btn-add-cart" data-product-id="' + product.id + '">Add to cart</button>' +
      '<div class="product-actions">' +
      '<a href="#" class="action-link"><img src="images/icon/icon-share.svg" alt="">Share</a>' +
      '<a href="#" class="action-link"><img src="images/icon/icon-compare.svg" alt="">Compare</a>' +
      '<a href="#" class="action-link btn-like" data-product-id="' + product.id + '"><img src="images/icon/icon-like.svg" alt="">Like</a>' +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  function renderProducts(container, products) {
    if (!container) return;
    container.innerHTML = products.map(productCardHTML).join('');
  }

  global.FurniroProducts = {
    fetchProducts: fetchProducts,
    renderProducts: renderProducts,
    formatPrice: formatPrice
  };
})(window);
