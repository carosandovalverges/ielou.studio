/*
  ielou.studio — comportamiento compartido del sitio.
  Cada bloque se auto-verifica (if (!el) return) para poder incluir
  este mismo archivo en las 6 páginas sin importar qué componentes
  tenga cada una.
*/

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initProductGallery();
  initCheckoutForm();
  initProjectCarousel();
  initTiendaFilters();
  initAutoCarousels();
  initHeroCarousel();
  initBackToTop();
  initCartBadge();
});

/* ---------- Menú mobile (header) ---------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
}

/* ---------- Galería de imágenes en Detalle de Producto ---------- */
function initProductGallery() {
  const mainImage = document.getElementById('main-product-image');
  const thumbs = document.querySelectorAll('.gallery-thumb-btn');
  if (!mainImage || !thumbs.length) return;

  function selectThumb(btn) {
    const img = btn.querySelector('img');
    if (!img) return;
    mainImage.src = img.src;
    thumbs.forEach((b) => b.classList.remove('border-black'));
    thumbs.forEach((b) => b.classList.add('border-transparent'));
    btn.classList.remove('border-transparent');
    btn.classList.add('border-black');
  }

  thumbs.forEach((btn) => btn.addEventListener('click', () => selectThumb(btn)));

  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  function currentIndex() {
    return Array.from(thumbs).findIndex((t) => t.querySelector('img').src === mainImage.src);
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const i = currentIndex();
      const prev = i <= 0 ? thumbs.length - 1 : i - 1;
      selectThumb(thumbs[prev]);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const i = currentIndex();
      const next = i >= thumbs.length - 1 || i === -1 ? 0 : i + 1;
      selectThumb(thumbs[next]);
    });
  }
}

/* ---------- Checkout: actualiza el resumen según el método de envío elegido ---------- */
const STUDIO_EMAIL = 'carola.sandoval@hotmail.com';

const SHIPPING_LABELS = {
  domicilio: 'Se confirma según destino',
  sucursal: 'Por pagar en sucursal',
  retiro: 'Coordinado por correo (sin costo)',
};

const SHIPPING_FULL_NAMES = {
  domicilio: 'Envío a domicilio (Starken o Chilexpress)',
  sucursal: 'Retiro en sucursal (Starken o Chilexpress)',
  retiro: 'Retiro presencial en Plaza Ñuñoa, Santiago',
};

function buildCheckoutTemplateParams() {
  const val = (id) => (document.getElementById(id)?.value || '').trim();
  const checked = document.querySelector('input[name="shipping_method"]:checked');
  const shippingName = checked ? (SHIPPING_FULL_NAMES[checked.value] || checked.value) : '(no seleccionado)';
  return {
    product_name: document.getElementById('summary-product-name')?.textContent.trim() || '',
    product_price: document.getElementById('summary-product-price')?.textContent.trim() || '',
    buyer_name: val('buyer-name'),
    buyer_email: val('buyer-email'),
    buyer_phone: val('buyer-phone'),
    buyer_rut: val('buyer-rut'),
    shipping_address: val('shipping-address'),
    shipping_comuna: val('shipping-comuna'),
    shipping_city: val('shipping-city'),
    shipping_region: val('shipping-region'),
    shipping_method: shippingName,
    order_notes: val('order-notes') || '(sin notas)',
  };
}

function buildCheckoutMailto(params) {
  const lines = [
    `Pieza: ${params.product_name}`,
    `Precio: ${params.product_price}`,
    '',
    'DATOS DEL COMPRADOR',
    `Nombre y apellido: ${params.buyer_name}`,
    `Correo electrónico: ${params.buyer_email}`,
    `Teléfono: ${params.buyer_phone}`,
    `RUT: ${params.buyer_rut}`,
    '',
    'DIRECCIÓN DE ENVÍO',
    `Dirección: ${params.shipping_address}`,
    `Comuna: ${params.shipping_comuna}`,
    `Ciudad: ${params.shipping_city}`,
    `Región: ${params.shipping_region}`,
    '',
    `Método de entrega elegido: ${params.shipping_method}`,
    '',
    `Notas: ${params.order_notes}`,
  ];

  const subject = `Solicitud de compra — ${params.product_name}`;
  const body = lines.join('\n');
  return `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function isEmailJsReady() {
  return typeof EMAILJS_CONFIG !== 'undefined'
    && typeof emailjs !== 'undefined'
    && !/^TU_/.test(EMAILJS_CONFIG.publicKey)
    && !/^TU_/.test(EMAILJS_CONFIG.serviceId)
    && !/^TU_/.test(EMAILJS_CONFIG.templateOwnerId)
    && !/^TU_/.test(EMAILJS_CONFIG.templateCustomerId);
}

function sendCheckoutViaEmailJs(params) {
  emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  return Promise.all([
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateOwnerId, params),
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateCustomerId, params),
  ]);
}

function populateSelect(select, options, placeholder) {
  select.innerHTML = '';
  const opt = document.createElement('option');
  opt.value = '';
  opt.textContent = placeholder;
  select.appendChild(opt);
  options.forEach((value) => {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = value;
    select.appendChild(o);
  });
}

function applyCheckoutProductFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get('nombre');
  if (!nombre) return;

  const precio = params.get('precio') || '';
  const img = params.get('img') || '';
  const categoria = params.get('categoria') || '';

  const nameEl = document.getElementById('summary-product-name');
  const priceEl = document.getElementById('summary-product-price');
  const subtotalEl = document.getElementById('summary-subtotal');
  const totalEl = document.getElementById('total-amount-display');
  const imgEl = document.getElementById('summary-product-img');
  const badgeEl = document.getElementById('summary-product-badge');

  if (nameEl) nameEl.textContent = nombre;
  if (priceEl && precio) priceEl.textContent = precio;
  if (subtotalEl && precio) subtotalEl.textContent = precio;
  if (totalEl && precio) totalEl.textContent = precio;
  if (imgEl && img) { imgEl.src = img; imgEl.alt = nombre; }
  if (badgeEl && categoria) badgeEl.textContent = categoria;
}

function initCheckoutForm() {
  const form = document.getElementById('purchase-order-form');
  const shippingLabel = document.getElementById('shipping-cost-label');
  const shippingRadios = document.querySelectorAll('input[name="shipping_method"]');
  const regionSelect = document.getElementById('shipping-region');
  const citySelect = document.getElementById('shipping-city');
  const comunaSelect = document.getElementById('shipping-comuna');
  if (!form || !shippingLabel || !shippingRadios.length) return;

  applyCheckoutProductFromUrl();

  if (regionSelect && citySelect && comunaSelect && typeof CHILE_REGIONES !== 'undefined') {
    populateSelect(regionSelect, Object.keys(CHILE_REGIONES), '-- Elige una región --');

    regionSelect.addEventListener('change', () => {
      const cities = CHILE_REGIONES[regionSelect.value];
      if (cities) {
        populateSelect(citySelect, Object.keys(cities), '-- Elige una ciudad --');
        citySelect.disabled = false;
      } else {
        populateSelect(citySelect, [], '-- Primero elige una región --');
        citySelect.disabled = true;
      }
      populateSelect(comunaSelect, [], '-- Primero elige una ciudad --');
      comunaSelect.disabled = true;
    });

    citySelect.addEventListener('change', () => {
      const comunas = CHILE_REGIONES[regionSelect.value]?.[citySelect.value];
      if (comunas) {
        populateSelect(comunaSelect, comunas, '-- Elige una comuna --');
        comunaSelect.disabled = false;
      } else {
        populateSelect(comunaSelect, [], '-- Primero elige una ciudad --');
        comunaSelect.disabled = true;
      }
    });
  }

  function handleShippingChange() {
    const checked = document.querySelector('input[name="shipping_method"]:checked');
    if (!checked) return;
    shippingLabel.textContent = SHIPPING_LABELS[checked.value] || '';
  }
  shippingRadios.forEach((r) => r.addEventListener('change', handleShippingChange));

  function showCheckoutSuccess() {
    const successMsg = document.getElementById('success-message');
    if (successMsg) {
      successMsg.classList.remove('hidden');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const params = buildCheckoutTemplateParams();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (isEmailJsReady()) {
      if (submitBtn) submitBtn.disabled = true;
      sendCheckoutViaEmailJs(params)
        .then(() => showCheckoutSuccess())
        .catch((err) => {
          console.error('EmailJS falló, se usa mailto de respaldo:', err);
          window.location.href = buildCheckoutMailto(params);
          showCheckoutSuccess();
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
    } else {
      window.location.href = buildCheckoutMailto(params);
      showCheckoutSuccess();
    }
  });
}

/* ---------- Carrusel de imágenes en Detalle de Proyecto ---------- */
function initProjectCarousel() {
  const mainImg = document.getElementById('carousel-main-img');
  if (!mainImg) return;

  const thumbButtons = Array.from(document.querySelectorAll('.carousel-thumbnail'));
  const projectImages = thumbButtons.map((btn) => btn.querySelector('img').src);
  const indicator = document.getElementById('slide-indicator');
  let currentSlide = 0;

  function updateCarousel() {
    mainImg.src = projectImages[currentSlide];
    if (indicator) indicator.textContent = `${currentSlide + 1} / ${projectImages.length}`;
    thumbButtons.forEach((thumb, idx) => {
      thumb.classList.toggle('border-black', idx === currentSlide);
      thumb.classList.toggle('border-neutral-200', idx !== currentSlide);
    });
  }

  thumbButtons.forEach((btn, idx) => btn.addEventListener('click', () => {
    currentSlide = idx;
    updateCarousel();
  }));

  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (prevBtn) prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentSlide = (currentSlide - 1 + projectImages.length) % projectImages.length;
    updateCarousel();
  });
  if (nextBtn) nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentSlide = (currentSlide + 1) % projectImages.length;
    updateCarousel();
  });

  document.querySelectorAll('.gallery-detail-link').forEach((el) => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.slide || 0);
      currentSlide = idx;
      updateCarousel();
      mainImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const openModal = () => {
    if (!modal || !modalImg) return;
    modalImg.src = mainImg.src;
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
    modalImg.classList.remove('scale-95');
    modalImg.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    if (!modal || !modalImg) return;
    modal.classList.add('opacity-0');
    modalImg.classList.remove('scale-100');
    modalImg.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 300);
  };
  const zoomTrigger = document.getElementById('carousel-zoom-trigger');
  if (zoomTrigger) zoomTrigger.addEventListener('click', openModal);
  if (modal) modal.addEventListener('click', closeModal);
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeModal(); });
}

/* ---------- Tienda: búsqueda + filtro por categoría ---------- */
function initTiendaFilters() {
  const searchInput = document.getElementById('search-input');
  const filterPills = document.querySelectorAll('.filter-pill');
  const categoryBlocks = document.querySelectorAll('.category-block');
  const seeMoreButtons = document.querySelectorAll('.category-see-more');
  const noResultsBox = document.getElementById('no-results');
  const itemCounter = document.getElementById('item-counter');
  if (!filterPills.length) return;

  let currentCategory = 'todas';
  let searchQuery = '';

  function setActivePill(pill) {
    filterPills.forEach((p) => {
      p.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
      p.classList.add('bg-neutral-100', 'text-on-surface-variant', 'hover:bg-neutral-200');
    });
    pill.classList.remove('bg-neutral-100', 'text-on-surface-variant', 'hover:bg-neutral-200');
    pill.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
  }

  function filterCatalog() {
    let totalVisible = 0;

    categoryBlocks.forEach((block) => {
      const blockCategory = block.getAttribute('data-category-type');
      const products = block.querySelectorAll('.product-item');
      let blockMatches = 0;
      const categoryMatch = currentCategory === 'todas' || currentCategory === blockCategory;

      if (!categoryMatch) {
        block.style.display = 'none';
        return;
      }

      products.forEach((product) => {
        const title = product.getAttribute('data-title') || '';
        const tags = product.getAttribute('data-tags') || '';
        const textContent = (title + ' ' + tags).toLowerCase();
        const matchesSearch = searchQuery === '' || textContent.includes(searchQuery.toLowerCase().trim());

        if (matchesSearch) {
          product.style.display = 'flex';
          blockMatches++;
          totalVisible++;
        } else {
          product.style.display = 'none';
        }
      });

      block.style.display = blockMatches > 0 ? 'block' : 'none';
    });

    if (noResultsBox) noResultsBox.classList.toggle('hidden', totalVisible !== 0);
    if (itemCounter) {
      itemCounter.textContent = `${totalVisible} ${totalVisible === 1 ? 'pieza disponible' : 'piezas disponibles'} en el taller`;
    }
  }

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      setActivePill(pill);
      currentCategory = pill.getAttribute('data-category');
      filterCatalog();
    });
  });

  seeMoreButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target-category');
      const targetPill = document.querySelector(`.filter-pill[data-category="${target}"]`);
      if (targetPill) {
        targetPill.click();
        const toolbar = document.getElementById('filter-pills');
        if (toolbar) window.scrollTo({ top: toolbar.offsetTop - 100, behavior: 'smooth' });
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterCatalog();
    });
  }

  function applyHashCategory() {
    const hashCategory = window.location.hash.replace('#', '');
    const hashPill = document.querySelector(`.filter-pill[data-category="${hashCategory}"]`);
    if (hashPill) hashPill.click();
  }

  applyHashCategory();
  window.addEventListener('hashchange', applyHashCategory);
}

/* ---------- Carruseles automáticos mobile (envíos/categorías) ---------- */
function initAutoCarousels() {
  const AUTOPLAY_MS = 4500;

  document.querySelectorAll('.auto-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.auto-carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.auto-carousel-slide'));
    const dotsBox = carousel.querySelector('.auto-carousel-dots');
    if (!track || slides.length < 2 || !dotsBox) return;

    let index = 0;
    let timer = null;

    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
      dot.className = 'w-2 h-2 rounded-full transition-colors ' + (i === 0 ? 'bg-primary' : 'bg-neutral-300');
      dot.addEventListener('click', () => goTo(i, true));
      dotsBox.appendChild(dot);
      return dot;
    });

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('bg-primary', i === index);
        dot.classList.toggle('bg-neutral-300', i !== index);
      });
    }

    function goTo(i, userTriggered) {
      index = (i + slides.length) % slides.length;
      update();
      if (userTriggered) restart();
    }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    }

    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) goTo(index + (delta < 0 ? 1 : -1), true);
    });

    update();
    restart();
  });
}

/* ---------- Botón flotante "volver arriba" (todo el sitio) ---------- */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.className = 'fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center opacity-0 pointer-events-none translate-y-2 transition-all duration-300 hover:bg-accent hover:text-primary';
  btn.innerHTML = '<span class="material-symbols-outlined text-[22px]">arrow_upward</span>';
  document.body.appendChild(btn);

  function toggle() {
    const show = window.scrollY > 480;
    btn.classList.toggle('opacity-0', !show);
    btn.classList.toggle('pointer-events-none', !show);
    btn.classList.toggle('translate-y-2', !show);
  }

  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  toggle();
}

/* ---------- Contador de carrito (localStorage, sin backend) ---------- */
const CART_COUNT_KEY = 'ielou_cart_count';

function getCartCount() {
  return parseInt(localStorage.getItem(CART_COUNT_KEY) || '0', 10) || 0;
}

function setCartCount(n) {
  localStorage.setItem(CART_COUNT_KEY, String(n));
  document.querySelectorAll('.cart-count-badge').forEach((el) => {
    el.textContent = String(n);
  });
}

function initCartBadge() {
  setCartCount(getCartCount());

  document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setCartCount(getCartCount() + 1);
      const original = btn.textContent;
      btn.textContent = 'Agregado ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1200);
    });
  });
}

/* ---------- Hero de la home: fondo con fundido entre imágenes ---------- */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let index = 0;
  setInterval(() => {
    slides[index].classList.replace('opacity-100', 'opacity-0');
    index = (index + 1) % slides.length;
    slides[index].classList.replace('opacity-0', 'opacity-100');
  }, 6000);
}
