/* cart + favorites store */

(function (global) {
  var CART_KEY = 'furniro-cart';
  var FAVORITES_KEY = 'furniro-favorites';

  function read(key) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      /* ignore - storage might be blocked */
    }
  }

  /* cart: array of { id, qty } */

  function getCart() {
    return read(CART_KEY);
  }

  function saveCart(cart) {
    write(CART_KEY, cart);
    global.dispatchEvent(new CustomEvent('furniro:cart-change', { detail: { cart: cart } }));
  }

  function addToCart(id, qty) {
    id = Number(id);
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var cart = getCart();
    var line = cart.find(function (item) { return item.id === id; });
    if (line) {
      line.qty += qty;
    } else {
      cart.push({ id: id, qty: qty });
    }
    saveCart(cart);
    return cart;
  }

  function removeFromCart(id) {
    id = Number(id);
    var cart = getCart().filter(function (item) { return item.id !== id; });
    saveCart(cart);
    return cart;
  }

  function setCartQty(id, qty) {
    id = Number(id);
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var cart = getCart();
    var line = cart.find(function (item) { return item.id === id; });
    if (line) {
      line.qty = qty;
      saveCart(cart);
    }
    return cart;
  }

  function cartCount() {
    return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  /* favorites: array of ids */

  function getFavorites() {
    return read(FAVORITES_KEY);
  }

  function saveFavorites(favorites) {
    write(FAVORITES_KEY, favorites);
    global.dispatchEvent(new CustomEvent('furniro:favorites-change', { detail: { favorites: favorites } }));
  }

  function isFavorite(id) {
    return getFavorites().indexOf(Number(id)) !== -1;
  }

  function toggleFavorite(id) {
    id = Number(id);
    var favorites = getFavorites();
    var index = favorites.indexOf(id);
    if (index === -1) {
      favorites.push(id);
    } else {
      favorites.splice(index, 1);
    }
    saveFavorites(favorites);
    return index === -1; // true = product is now favorited
  }

  function favoriteCount() {
    return getFavorites().length;
  }

  // keep other tabs in sync
  global.addEventListener('storage', function (event) {
    if (event.key === CART_KEY) {
      global.dispatchEvent(new CustomEvent('furniro:cart-change', { detail: { cart: getCart() } }));
    }
    if (event.key === FAVORITES_KEY) {
      global.dispatchEvent(new CustomEvent('furniro:favorites-change', { detail: { favorites: getFavorites() } }));
    }
  });

  global.FurniroStore = {
    getCart: getCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    setCartQty: setCartQty,
    cartCount: cartCount,
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite,
    favoriteCount: favoriteCount
  };

  /* red badge counts on the header icons */

  function updateBadge(selector, count) {
    document.querySelectorAll(selector).forEach(function (badge) {
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.hidden = count === 0;
    });
  }

  function refreshBadges() {
    updateBadge('[data-cart-count]', cartCount());
    updateBadge('[data-favorite-count]', favoriteCount());
  }

  refreshBadges();
  document.addEventListener('DOMContentLoaded', refreshBadges);
  global.addEventListener('furniro:cart-change', refreshBadges);
  global.addEventListener('furniro:favorites-change', refreshBadges);
})(window);

/* product data + card rendering */

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

  // json only has hex codes, so map them to names
  var COLOR_NAMES = {
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
    '#FFFFFF': 'White'
  };

  function colorName(hex) {
    return COLOR_NAMES[(hex || '').toUpperCase()] || hex;
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
    var liked = global.FurniroStore ? global.FurniroStore.isFavorite(product.id) : false;
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
      '<a href="#" class="action-link btn-like' + (liked ? ' is-active' : '') + '" data-product-id="' + product.id +
      '" aria-pressed="' + (liked ? 'true' : 'false') + '"><img src="images/icon/icon-like.svg" alt="">' +
      (liked ? 'Liked' : 'Like') + '</a>' +
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
    formatPrice: formatPrice,
    colorName: colorName
  };
})(window);

/* product card */
(function () {

  // เช็คว่า เป็น ipad iphone รึป่าว ถ้าใช่การกด hover ทำไม่ได้เปลี่ยนเป็นกดครั้งเเรก ขึ้นเเบบ hover

  var isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (isTouchDevice) {
    document.addEventListener('click', function (event) {
      var thumb = event.target.closest('.product-thumb');
      var openCard = document.querySelector('.product-card.is-active');

      if (thumb) {
        var card = thumb.closest('.product-card');
        var overlayAlreadyOpen = card.classList.contains('is-active');

        if (!overlayAlreadyOpen) {
          event.preventDefault();
          if (openCard && openCard !== card) {
            openCard.classList.remove('is-active');
          }
          card.classList.add('is-active');
          return;
        }
        return;
      }

      if (openCard) {
        openCard.classList.remove('is-active');
      }
    });
  }

  // click เพิ่มสินค้า โดยใช้ busy เพื่อ กันไม่ให้เกิดการกด ซ้ำสองครั้ง มี timeout
  document.addEventListener('click', function (event) {
    var button = event.target.closest('.btn-add-cart');
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    if (button.dataset.busy === 'true') return;
    button.dataset.busy = 'true';

    if (window.FurniroStore && button.dataset.productId) {
      window.FurniroStore.addToCart(button.dataset.productId, 1);
    }

    var originalText = button.textContent;
    button.textContent = 'Added!';

    window.setTimeout(function () {
      button.textContent = originalText;
      button.dataset.busy = 'false';
    }, 1200);
  });

  // toggle like + sync every card showing this product
  document.addEventListener('click', function (event) {
    var likeBtn = event.target.closest('.btn-like');
    if (!likeBtn) return;

    event.preventDefault();
    event.stopPropagation();

    if (!window.FurniroStore || !likeBtn.dataset.productId) return;
    var id = likeBtn.dataset.productId;
    window.FurniroStore.toggleFavorite(id);
    var liked = window.FurniroStore.isFavorite(id);

    document.querySelectorAll('.btn-like[data-product-id="' + id + '"]').forEach(function (btn) {
      btn.classList.toggle('is-active', liked);
      btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
      var img = btn.querySelector('img');
      btn.textContent = '';
      if (img) btn.appendChild(img);
      btn.appendChild(document.createTextNode(liked ? 'Liked' : 'Like'));
    });
  });

  // click link เเต่ยังไม่ได้ตั้งปลายทาง
  document.addEventListener('click', function (event) {
    var link = event.target.closest('.action-link');
    if (!link) return;
    if (link.classList.contains('btn-like')) return;
    if (link.getAttribute('href') === '#') {
      event.preventDefault();
    }
  });

  document.addEventListener('click', function (event) {
    var link = event.target.closest('.room-caption-arrow');
    if (!link) return;
    if (link.getAttribute('href') === '#') {
      event.preventDefault();
    }
  });
})();

/* mobile nav toggle */

(function () {
  var header = document.querySelector('header');
  var toggle = header ? header.querySelector('.nav-toggle') : null;
  if (!header || !toggle) return;

  toggle.addEventListener('click', function () {
    var isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  header.querySelectorAll('nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* room carousel */

(function () {
  var carousels = document.querySelectorAll('.room-carousel');

  carousels.forEach(function (carousel) {
    var track = carousel.querySelector('.room-carousel-track');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.room-slide'));
    var nextButton = carousel.querySelector('.room-carousel-next');
    var section = carousel.closest('.room-inspiration') || carousel.parentElement;
    var dotsWrap = section.querySelector('.room-carousel-dots');
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.querySelectorAll('.dot')) : [];

    if (!track || slides.length === 0) return;

    var order = slides.slice();
    var bigIndex = 0;

    function render() {
      order.forEach(function (slide) {
        track.appendChild(slide);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === bigIndex);
      });
    }

    function rotateOnce() {
      order.push(order.shift());
      bigIndex = (bigIndex + 1) % slides.length;
    }

    function goToSlide(index) {
      var target = (index + slides.length) % slides.length;
      var guard = 0;
      while (bigIndex !== target && guard < slides.length) {
        rotateOnce();
        guard++;
      }
      render();
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        goToSlide(bigIndex + 1);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
    });
  });
})();

/* product gallery thumbnails */

(function () {
  var gallery = document.querySelector('.product-gallery');
  if (!gallery) return;

  var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('.product-thumb-item'));
  var mainImage = gallery.querySelector('.product-main-image img');
  if (!mainImage || thumbs.length === 0) return;

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var thumbImg = thumb.querySelector('img');
      if (!thumbImg) return;

      mainImage.src = thumbImg.src;
      mainImage.alt = thumbImg.alt;

      thumbs.forEach(function (t) {
        t.classList.toggle('is-active', t === thumb);
      });
    });
  });
})();

/* product tabs */

(function () {
  var tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
  if (!tabButtons.length) return;

  document.addEventListener('click', function (event) {
    var btn = event.target.closest('.tab-btn[data-tab]');
    if (!btn) return;

    tabButtons.forEach(function (b) {
      var isActive = b === btn;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('.tab-panel-group').forEach(function (panel) {
      panel.hidden = panel.id !== 'tab-panel-' + btn.dataset.tab;
    });
  });
})();

/* size + color pickers */

(function () {
  document.addEventListener('click', function (event) {
    var sizeBtn = event.target.closest('.size-btn');
    if (sizeBtn) {
      var sizeGroup = sizeBtn.closest('.size-options');
      sizeGroup.querySelectorAll('.size-btn').forEach(function (b) {
        b.classList.toggle('is-active', b === sizeBtn);
      });
      return;
    }

    var swatch = event.target.closest('.color-swatch');
    if (swatch) {
      var colorGroup = swatch.closest('.color-options');
      colorGroup.querySelectorAll('.color-swatch').forEach(function (b) {
        b.classList.toggle('is-active', b === swatch);
      });
    }
  });
})();

/* qty stepper + add to cart */

(function () {
  var actionsRow = document.querySelector('.product-actions-row');
  if (!actionsRow) return;

  var stepper = actionsRow.querySelector('.qty-stepper');
  var qtyValue = stepper ? stepper.querySelector('.qty-value') : null;
  var addToCartBtn = actionsRow.querySelector('.btn-add-to-cart');

  if (stepper && qtyValue) {
    stepper.addEventListener('click', function (event) {
      var btn = event.target.closest('.qty-btn');
      if (!btn) return;

      var qty = parseInt(qtyValue.textContent, 10);
      if (isNaN(qty) || qty < 1) qty = 1;

      var isIncrease = btn.getAttribute('aria-label') === 'Increase quantity';
      qty = isIncrease ? qty + 1 : Math.max(1, qty - 1);

      qtyValue.textContent = qty;
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      if (addToCartBtn.dataset.busy === 'true') return;
      addToCartBtn.dataset.busy = 'true';

      if (window.FurniroStore && addToCartBtn.dataset.productId) {
        var qty = qtyValue ? parseInt(qtyValue.textContent, 10) : 1;
        window.FurniroStore.addToCart(addToCartBtn.dataset.productId, qty);
      }

      var originalText = addToCartBtn.textContent;
      addToCartBtn.textContent = 'Added!';

      window.setTimeout(function () {
        addToCartBtn.textContent = originalText;
        addToCartBtn.dataset.busy = 'false';
      }, 1200);
    });
  }
})();

/* checkout payment method */

(function () {
  var options = document.querySelectorAll('.payment-option input[type="radio"]');
  var activeName = document.getElementById('payment-active-name');
  var activeDesc = document.getElementById('payment-active-desc');
  if (!options.length || !activeName || !activeDesc) return;

  options.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (!radio.checked) return;
      activeName.textContent = radio.value;
      activeDesc.textContent = radio.dataset.desc || '';
    });
  });
})();

/* newsletter */

(function () {
  var form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var input = form.querySelector('input[type="email"]');
    var button = form.querySelector('button');
    if (!input || !input.checkValidity()) {
      if (input) input.reportValidity();
      return;
    }

    var originalText = button.textContent;
    button.textContent = 'SUBSCRIBED!';
    button.disabled = true;

    window.setTimeout(function () {
      button.textContent = originalText;
      button.disabled = false;
      input.value = '';
    }, 1500);
  });
})();

/* contact form */

(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var button = form.querySelector('.contact-submit');
    var originalText = button.textContent;
    button.textContent = 'Message sent!';
    button.disabled = true;

    window.setTimeout(function () {
      button.textContent = originalText;
      button.disabled = false;
      form.reset();
    }, 1500);
  });
})();

/* home page: show more */

(function () {
  var grid = document.getElementById('home-products-grid');
  var showMoreBtn = document.getElementById('home-show-more');
  if (!grid || !showMoreBtn) return;

  var PAGE_SIZE = 8;
  var visibleCount = PAGE_SIZE;

  FurniroProducts.fetchProducts().then(function (products) {
    function render() {
      FurniroProducts.renderProducts(grid, products.slice(0, visibleCount));
      showMoreBtn.hidden = visibleCount >= products.length;
    }

    showMoreBtn.addEventListener('click', function () {
      visibleCount += PAGE_SIZE;
      render();
    });

    render();
  }).catch(function (err) {
    console.error(err);
  });
})();

/* shop page: toolbar filter / sort / pagination */

(function () {
  var grid = document.getElementById('shop-products-grid');
  if (!grid) return;

  var resultsEl = document.getElementById('toolbar-results');

  FurniroProducts.fetchProducts().then(function (allProducts) {
    var showInput = document.getElementById('toolbar-show-input');
    var sortSelect = document.getElementById('toolbar-sort-select');
    var paginationNav = document.getElementById('shop-pagination');

    var filterBtn = document.getElementById('toolbar-filter-btn');
    var filterCountEl = document.getElementById('filter-count');
    var filterPanel = document.getElementById('filter-panel');
    var filterTagsWrap = document.getElementById('filter-tags');
    var priceMinInput = document.getElementById('filter-price-min');
    var priceMaxInput = document.getElementById('filter-price-max');
    var filterApplyBtn = document.getElementById('filter-apply-btn');
    var filterClearBtn = document.getElementById('filter-clear-btn');

    var searchQuery = new URLSearchParams(window.location.search).get('search') || '';

    var state = {
      page: 1,
      pageSize: 8,
      sort: 'default',
      filters: { tags: [], minPrice: null, maxPrice: null, search: searchQuery }
    };

    (function buildFilterTags() {
      var counts = {};
      allProducts.forEach(function (p) {
        p.tags.forEach(function (tag) { counts[tag] = (counts[tag] || 0) + 1; });
      });
      var tags = Object.keys(counts)
        .filter(function (tag) { return counts[tag] > 1; })
        .sort(function (a, b) { return counts[b] - counts[a] || a.localeCompare(b); });

      filterTagsWrap.innerHTML = tags.map(function (tag) {
        var id = 'filter-tag-' + tag.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          '<label class="filter-tag">' +
          '<input type="checkbox" id="' + id + '" value="' + tag + '">' +
          '<span>' + tag + '</span>' +
          '</label>'
        );
      }).join('');
    })();

    function matchesFilters(product) {
      var f = state.filters;
      if (f.search) {
        var haystack = (product.name + ' ' + product.category + ' ' + product.tags.join(' ')).toLowerCase();
        if (haystack.indexOf(f.search.toLowerCase()) === -1) return false;
      }
      if (f.tags.length && !f.tags.some(function (tag) { return product.tags.indexOf(tag) !== -1; })) {
        return false;
      }
      if (f.minPrice != null && product.price < f.minPrice) return false;
      if (f.maxPrice != null && product.price > f.maxPrice) return false;
      return true;
    }

    function sortProducts(products, mode) {
      var sorted = products.slice();
      if (mode === 'price-asc') sorted.sort(function (a, b) { return a.price - b.price; });
      else if (mode === 'price-desc') sorted.sort(function (a, b) { return b.price - a.price; });
      else if (mode === 'name-asc') sorted.sort(function (a, b) { return a.name.localeCompare(b.name); });
      else if (mode === 'name-desc') sorted.sort(function (a, b) { return b.name.localeCompare(a.name); });
      return sorted;
    }

    function renderPagination(totalPages) {
      var html = '';
      for (var i = 1; i <= totalPages; i++) {
        html += '<button type="button" class="page-btn' + (i === state.page ? ' is-active' : '') +
          '" data-page="' + i + '"' + (i === state.page ? ' aria-current="page"' : '') + '>' + i + '</button>';
      }
      if (state.page < totalPages) {
        html += '<button type="button" class="page-btn page-btn--next" data-page="' + (state.page + 1) + '">Next</button>';
      }
      paginationNav.innerHTML = html;
    }

    function render() {
      var filtered = allProducts.filter(matchesFilters);
      var sorted = sortProducts(filtered, state.sort);
      var totalPages = Math.max(1, Math.ceil(sorted.length / state.pageSize));
      state.page = Math.min(state.page, totalPages);

      var start = (state.page - 1) * state.pageSize;
      var pageItems = sorted.slice(start, start + state.pageSize);

      FurniroProducts.renderProducts(grid, pageItems);

      var shownStart = pageItems.length ? start + 1 : 0;
      var shownEnd = start + pageItems.length;
      var searchNote = state.filters.search ? ' for "' + state.filters.search + '"' : '';
      resultsEl.textContent = sorted.length ?
        ('Showing ' + shownStart + '–' + shownEnd + ' of ' + sorted.length + ' results' + searchNote) :
        ('No products match' + (searchNote || ' this filter'));

      renderPagination(totalPages);
    }

    showInput.addEventListener('change', function () {
      var val = parseInt(showInput.value, 10);
      if (isNaN(val) || val < 1) val = allProducts.length;
      state.pageSize = val;
      state.page = 1;
      render();
    });

    sortSelect.addEventListener('change', function () {
      state.sort = sortSelect.value;
      state.page = 1;
      render();
    });

    paginationNav.addEventListener('click', function (event) {
      var btn = event.target.closest('.page-btn');
      if (!btn) return;
      state.page = parseInt(btn.dataset.page, 10);
      render();
      document.querySelector('.filter').scrollIntoView({ block: 'start' });
    });

    filterBtn.addEventListener('click', function () {
      var isOpen = filterPanel.hidden;
      filterPanel.hidden = !isOpen;
      filterBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    filterApplyBtn.addEventListener('click', function () {
      var checked = Array.prototype.slice.call(filterTagsWrap.querySelectorAll('input:checked'));
      state.filters.tags = checked.map(function (input) { return input.value; });

      var minVal = parseInt(priceMinInput.value, 10);
      var maxVal = parseInt(priceMaxInput.value, 10);
      state.filters.minPrice = isNaN(minVal) ? null : minVal;
      state.filters.maxPrice = isNaN(maxVal) ? null : maxVal;

      var activeCount = state.filters.tags.length +
        (state.filters.minPrice != null || state.filters.maxPrice != null ? 1 : 0);
      filterCountEl.textContent = activeCount;
      filterCountEl.hidden = activeCount === 0;
      filterBtn.classList.toggle('is-active', activeCount > 0);

      state.page = 1;
      render();
      filterPanel.hidden = true;
      filterBtn.setAttribute('aria-expanded', 'false');
    });

    filterClearBtn.addEventListener('click', function () {
      filterTagsWrap.querySelectorAll('input:checked').forEach(function (input) {
        input.checked = false;
      });
      priceMinInput.value = '';
      priceMaxInput.value = '';

      state.filters = { tags: [], minPrice: null, maxPrice: null };
      filterCountEl.textContent = '0';
      filterCountEl.hidden = true;
      filterBtn.classList.remove('is-active');

      state.page = 1;
      render();
    });

    if (searchQuery) {
      var searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = searchQuery;
    }

    render();
  }).catch(function (err) {
    resultsEl.textContent = 'Could not load products.';
    console.error(err);
  });
})();

/* single product page routing */

(function () {
  if (!document.querySelector('.product-detail')) return;

  var id = parseInt(new URLSearchParams(window.location.search).get('id'), 10);

  FurniroProducts.fetchProducts().then(function (products) {
    var RELATED_PAGE_SIZE = 4;
    var related = products.filter(function (p) { return p.id !== id; });
    if (!related.length) related = products;

    var relatedGrid = document.getElementById('related-products-grid');
    var relatedShowMoreBtn = document.getElementById('related-show-more');
    var relatedVisibleCount = RELATED_PAGE_SIZE;

    function renderRelated() {
      FurniroProducts.renderProducts(relatedGrid, related.slice(0, relatedVisibleCount));
      relatedShowMoreBtn.hidden = relatedVisibleCount >= related.length;
    }

    relatedShowMoreBtn.addEventListener('click', function () {
      relatedVisibleCount += RELATED_PAGE_SIZE;
      renderRelated();
    });

    renderRelated();

    var product = products.find(function (p) { return p.id === id; });
    if (!product) return;

    document.title = 'Furniro - ' + product.name;

    var breadcrumbCurrent = document.querySelector('.product-breadcrumb [aria-current="page"]');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;

    var heading = document.querySelector('.single-product-info h1');
    if (heading) heading.textContent = product.name;

    var price = document.querySelector('.single-product-price');
    if (price) price.textContent = FurniroProducts.formatPrice(product);

    var addToCartBtn = document.querySelector('.btn-add-to-cart');
    if (addToCartBtn) addToCartBtn.dataset.productId = product.id;

    var mainImage = document.querySelector('.product-main-image img');
    if (mainImage) {
      mainImage.src = product.image;
      mainImage.alt = product.alt;
    }

    // only one photo per product for now, so thumbs reuse it
    document.querySelectorAll('.product-thumb-item img').forEach(function (img) {
      img.src = product.image;
      img.alt = product.alt;
    });

    function metaRow(label) {
      return Array.prototype.find.call(
        document.querySelectorAll('.product-meta-row'),
        function (row) { return row.querySelector('dt').textContent.trim() === label; }
      );
    }

    var categoryRow = metaRow('Category');
    if (categoryRow) categoryRow.querySelector('dd').textContent = ': ' + product.category;

    var skuRow = metaRow('SKU');
    if (skuRow) skuRow.querySelector('dd').textContent = ': ' + product.sku;

    var tagsRow = metaRow('Tags');
    if (tagsRow) tagsRow.querySelector('dd').textContent = ': ' + product.tags.join(', ');

    var description = document.querySelector('.product-description');
    if (description) description.textContent = product.description;

    var stars = document.querySelector('.stars');
    if (stars) stars.style.setProperty('--rating', product.rating);

    var ratingCount = document.querySelector('.rating-count');
    if (ratingCount) {
      ratingCount.textContent = product.reviewCount + (product.reviewCount === 1 ? ' Customer Review' : ' Customer Reviews');
    }

    var sizeOptions = document.querySelector('.size-options');
    if (sizeOptions) {
      sizeOptions.innerHTML = product.sizes.map(function (size, i) {
        return '<button type="button" class="size-btn' + (i === 0 ? ' is-active' : '') + '">' + size + '</button>';
      }).join('');
    }

    var colorOptions = document.querySelector('.color-options');
    if (colorOptions) {
      colorOptions.innerHTML = product.colors.map(function (hex, i) {
        return '<button type="button" class="color-swatch' + (i === 0 ? ' is-active' : '') +
          '" style="--swatch-color: ' + hex + ';" aria-label="Color ' + FurniroProducts.colorName(hex) + '"></button>';
      }).join('');
    }

    var tabParagraphs = document.querySelectorAll('.tab-panel > p');
    product.descriptionParagraphs.forEach(function (text, i) {
      if (tabParagraphs[i]) tabParagraphs[i].textContent = text;
    });

    var weightCell = document.querySelector('[data-spec="weight"]');
    if (weightCell) weightCell.textContent = product.weight;

    var dimensionsCell = document.querySelector('[data-spec="dimensions"]');
    if (dimensionsCell) dimensionsCell.textContent = product.dimensions;

    var materialCell = document.querySelector('[data-spec="material"]');
    if (materialCell) materialCell.textContent = product.material;

    var colorCell = document.querySelector('[data-spec="color"]');
    if (colorCell) colorCell.textContent = product.colors.map(FurniroProducts.colorName).join(', ');

    var reviewsTabBtn = document.querySelector('.tab-btn[data-tab="reviews"]');
    if (reviewsTabBtn) reviewsTabBtn.textContent = 'Reviews [' + product.reviewCount + ']';

    // base review stars on the product's real rating
    var baseRating = Math.round(product.rating);
    var reviewRatings = [
      Math.min(5, baseRating),
      Math.max(1, baseRating - 1),
      Math.min(5, baseRating)
    ];
    document.querySelectorAll('#tab-panel-reviews .review-item .stars').forEach(function (starEl, i) {
      if (reviewRatings[i] !== undefined) starEl.style.setProperty('--rating', reviewRatings[i]);
    });
  }).catch(function (err) {
    console.error(err);
  });
})();

/* cart page */

(function () {
  var body = document.getElementById('cart-items-body');
  if (!body) return;

  var tableWrap = document.getElementById('cart-table-wrap');
  var totalsWrap = document.getElementById('cart-totals-wrap');
  var emptyMessage = document.getElementById('cart-empty-message');
  var subtotalEl = document.getElementById('cart-subtotal-value');
  var totalEl = document.getElementById('cart-total-value');

  function formatRp(amount) {
    return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
  }

  function render() {
    FurniroProducts.fetchProducts().then(function (products) {
      var cart = FurniroStore.getCart();
      var lines = cart.map(function (item) {
        var product = products.find(function (p) { return p.id === item.id; });
        return product ? { product: product, qty: item.qty } : null;
      }).filter(Boolean);

      if (!lines.length) {
        tableWrap.hidden = true;
        totalsWrap.hidden = true;
        emptyMessage.hidden = false;
        return;
      }

      tableWrap.hidden = false;
      totalsWrap.hidden = false;
      emptyMessage.hidden = true;

      body.innerHTML = lines.map(function (line) {
        var product = line.product;
        var subtotal = product.price * line.qty;
        return (
          '<tr data-product-id="' + product.id + '">' +
          '<td><div class="cart-product">' +
          '<a href="single_product_page.html?id=' + product.id + '"><img src="' + product.image + '" alt="' + product.alt + '"></a>' +
          '<a href="single_product_page.html?id=' + product.id + '"><span>' + product.name + '</span></a>' +
          '</div></td>' +
          '<td class="cart-price">' + FurniroProducts.formatPrice(product) + '</td>' +
          '<td class="cart-qty-cell">' +
          '<label class="sr-only" for="qty-' + product.id + '">Quantity</label>' +
          '<input type="number" id="qty-' + product.id + '" class="cart-qty-input" value="' + line.qty + '" min="1">' +
          '</td>' +
          '<td class="cart-subtotal">' + formatRp(subtotal) + '</td>' +
          '<td class="cart-remove-cell">' +
          '<button type="button" class="cart-remove-btn" aria-label="Remove ' + product.name + ' from cart">' +
          '<img src="images/icon/icon-delete.jpg" alt="" width="20" height="20">' +
          '</button></td>' +
          '</tr>'
        );
      }).join('');

      var subtotal = lines.reduce(function (sum, line) { return sum + line.product.price * line.qty; }, 0);
      subtotalEl.textContent = formatRp(subtotal);
      totalEl.textContent = formatRp(subtotal);
    }).catch(function (err) {
      console.error(err);
    });
  }

  body.addEventListener('change', function (event) {
    if (!event.target.classList.contains('cart-qty-input')) return;
    var row = event.target.closest('tr');
    if (!row) return;
    var qty = parseInt(event.target.value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    FurniroStore.setCartQty(row.dataset.productId, qty);
  });

  body.addEventListener('click', function (event) {
    var removeBtn = event.target.closest('.cart-remove-btn');
    if (!removeBtn) return;
    var row = removeBtn.closest('tr');
    if (!row) return;
    FurniroStore.removeFromCart(row.dataset.productId);
  });

  window.addEventListener('furniro:cart-change', render);
  render();
})();

/* favorite page */

(function () {
  var grid = document.getElementById('favorite-grid');
  if (!grid) return;

  var subtitle = document.getElementById('favorite-subtitle');
  var emptyMessage = document.getElementById('favorite-empty-message');

  function render() {
    FurniroProducts.fetchProducts().then(function (products) {
      var favoriteIds = FurniroStore.getFavorites();
      var favorites = products.filter(function (p) { return favoriteIds.indexOf(p.id) !== -1; });

      subtitle.textContent = favorites.length + (favorites.length === 1 ? ' item saved' : ' items saved');
      emptyMessage.hidden = favorites.length > 0;
      grid.hidden = favorites.length === 0;

      FurniroProducts.renderProducts(grid, favorites);
    }).catch(function (err) {
      console.error(err);
    });
  }

  window.addEventListener('furniro:favorites-change', render);
  render();
})();

/* for calculated cart */

(function () {
  var itemsWrap = document.getElementById('order-summary-items');
  if (!itemsWrap) return;

  var emptyMessage = document.getElementById('order-summary-empty');
  var subtotalEl = document.getElementById('order-summary-subtotal');
  var totalEl = document.getElementById('order-summary-total');
  var placeOrderBtn = document.querySelector('.btn-place-order');

  function formatRp(amount) {
    return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
  }

  function render() {
    FurniroProducts.fetchProducts().then(function (products) {
      var cart = FurniroStore.getCart();
      var lines = cart.map(function (item) {
        var product = products.find(function (p) { return p.id === item.id; });
        return product ? { product: product, qty: item.qty } : null;
      }).filter(Boolean);

      if (!lines.length) {
        itemsWrap.innerHTML = '';
        emptyMessage.hidden = false;
        subtotalEl.textContent = formatRp(0);
        totalEl.textContent = formatRp(0);
        if (placeOrderBtn) placeOrderBtn.disabled = true;
        return;
      }

      emptyMessage.hidden = true;
      if (placeOrderBtn) placeOrderBtn.disabled = false;

      itemsWrap.innerHTML = lines.map(function (line) {
        return (
          '<div class="order-summary-row">' +
          '<span class="order-summary-item">' + line.product.name +
          ' <span class="order-summary-qty">x ' + line.qty + '</span></span>' +
          '<span>' + formatRp(line.product.price * line.qty) + '</span>' +
          '</div>'
        );
      }).join('');

      var subtotal = lines.reduce(function (sum, line) { return sum + line.product.price * line.qty; }, 0);
      subtotalEl.textContent = formatRp(subtotal);
      totalEl.textContent = formatRp(subtotal);
    }).catch(function (err) {
      console.error(err);
    });
  }

  window.addEventListener('furniro:cart-change', render);
  render();
})();

/* header search dropdown */

(function () {
  var toggleBtn = document.getElementById('search-toggle-btn');
  var dropdown = document.getElementById('search-dropdown');
  var form = document.getElementById('search-form');
  if (!toggleBtn || !dropdown) return;

  toggleBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    var isOpen = dropdown.hidden;
    dropdown.hidden = !isOpen;
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) {
      var input = dropdown.querySelector('input');
      if (input) input.focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (dropdown.hidden) return;
    if (dropdown.contains(event.target) || event.target === toggleBtn) return;
    dropdown.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !dropdown.hidden) {
      dropdown.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var query = input ? input.value.trim() : '';
      window.location.href = 'shop_page.html' + (query ? '?search=' + encodeURIComponent(query) : '');
    });
  }
})();

/* login / register page */

(function () {
  var loginForm = document.getElementById('login-form');
  var registerForm = document.getElementById('register-form');
  if (!loginForm && !registerForm) return;

  document.querySelectorAll('.auth-switch-link').forEach(function (link) {
    link.addEventListener('click', function () {
      var targetTab = document.querySelector('.tab-btn[data-tab="' + link.dataset.tab + '"]');
      if (targetTab) targetTab.click();
    });
  });

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!loginForm.checkValidity()) {
        loginForm.reportValidity();
        return;
      }

      var button = loginForm.querySelector('.auth-submit');
      var originalText = button.textContent;
      button.textContent = 'Logging in...';
      button.disabled = true;

      window.setTimeout(function () {
        button.textContent = 'Logged in!';
        window.setTimeout(function () {
          window.location.href = 'index.html';
        }, 600);
      }, 600);
    });
  }

  if (registerForm) {
    var registerPassword = document.getElementById('register-password');
    var registerConfirmPassword = document.getElementById('register-confirm-password');

    [registerPassword, registerConfirmPassword].forEach(function (field) {
      field.addEventListener('input', function () {
        registerConfirmPassword.setCustomValidity('');
      });
    });

    registerForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!registerForm.checkValidity()) {
        registerForm.reportValidity();
        return;
      }

      if (registerPassword.value !== registerConfirmPassword.value) {
        registerConfirmPassword.setCustomValidity('Passwords do not match');
        registerConfirmPassword.reportValidity();
        return;
      }

      var button = registerForm.querySelector('.auth-submit');
      var originalText = button.textContent;
      button.textContent = 'Creating account...';
      button.disabled = true;

      window.setTimeout(function () {
        button.textContent = originalText;
        button.disabled = false;
        registerForm.reset();

        var loginTab = document.querySelector('.tab-btn[data-tab="login"]');
        if (loginTab) loginTab.click();
      }, 800);
    });
  }
})();
