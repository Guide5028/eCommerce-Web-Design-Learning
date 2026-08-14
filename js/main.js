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

    var originalText = button.textContent;
    button.textContent = 'Added!';

    window.setTimeout(function () {
      button.textContent = originalText;
      button.dataset.busy = 'false';
    }, 1200);
  });

  // click link เเต่ยังไม่ได้ตั้งปลายทาง
  document.addEventListener('click', function (event) {
    var link = event.target.closest('.action-link');
    if (!link) return;
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

    //infinite loop slide
    var currentIndex = 0;

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      var slide = slides[currentIndex];
      var trackStyle = getComputedStyle(track);
      var gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
      var offset = slide.offsetLeft - track.offsetLeft;
      if (isNaN(offset)) offset = currentIndex * (slide.offsetWidth + gap);

      track.style.transform = 'translateX(-' + offset + 'px)';

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        goToSlide(currentIndex + 1);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
    });

    window.addEventListener('resize', function () {
      goToSlide(currentIndex);
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

/* cart totals */

(function () {
  var table = document.querySelector('.cart-table');
  if (!table) return;

  var totalsWrap = document.querySelector('.cart-totals');
  var subtotalEl = totalsWrap ? totalsWrap.querySelector('.cart-totals-row:not(.cart-totals-row--total) .cart-totals-value') : null;
  var totalEl = totalsWrap ? totalsWrap.querySelector('.cart-totals-row--total .cart-totals-value') : null;

  function parseCurrency(text) {
    // คิดเลขหลัก ปกติ เเยก กับ ทศนิยม เเล้วรวมกันทีหลัง
    var match = text.match(/[\d,]+\.\d+/);
    if (!match) return 0;
    var num = parseFloat(match[0].replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  }

  function formatCurrency(num) {
    return 'Rs. ' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function updateRow(row) {
    var priceCell = row.querySelector('.cart-price');
    var qtyInput = row.querySelector('.cart-qty-input');
    var subtotalCell = row.querySelector('.cart-subtotal');
    if (!priceCell || !qtyInput || !subtotalCell) return;

    var price = parseCurrency(priceCell.textContent);
    var qty = parseInt(qtyInput.value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    qtyInput.value = qty;

    subtotalCell.textContent = formatCurrency(price * qty);
  }

  function updateTotals() {
    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
    var subtotal = rows.reduce(function (sum, row) {
      var subtotalCell = row.querySelector('.cart-subtotal');
      return sum + (subtotalCell ? parseCurrency(subtotalCell.textContent) : 0);
    }, 0);

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (totalEl) totalEl.textContent = formatCurrency(subtotal);
  }

  table.addEventListener('input', function (event) {
    if (!event.target.classList.contains('cart-qty-input')) return;
    var row = event.target.closest('tr');
    if (!row) return;
    updateRow(row);
    updateTotals();
  });

  table.addEventListener('click', function (event) {
    var removeBtn = event.target.closest('.cart-remove-btn');
    if (!removeBtn) return;
    var row = removeBtn.closest('tr');
    if (!row) return;
    row.remove();
    updateTotals();
  });
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

    // checkvalid and reportvalid for check if there correct format such as no "@"
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
