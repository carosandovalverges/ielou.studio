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

/* ---------- Checkout: método de envío + cascada región/comuna Starken ---------- */
const STARKEN_DATA = {
  'Región de Arica y Parinacota': ['Arica'],
  'Región de Tarapacá': ['Alto Hospicio', 'Iquique'],
  'Región de Antofagasta': ['Antofagasta', 'Calama', 'Tocopilla'],
  'Región de Atacama': ['Caldera', 'Chañaral', 'Copiapó', 'Vallenar'],
  'Región de Coquimbo': ['Coquimbo', 'Illapel', 'La Serena', 'Los Vilos', 'Ovalle', 'Vicuña'],
  'Región de Valparaíso': [
    'Casablanca', 'Concón', 'El Quisco', 'La Calera', 'La Ligua', 'Limache',
    'Los Andes', 'Quilpué', 'San Antonio', 'San Felipe', 'Valparaíso', 'Villa Alemana', 'Viña del Mar',
  ],
  'Región Metropolitana de Santiago': [
    'Buin', 'Cerrillos', 'Colina', 'Conchalí', 'Curacaví', 'El Bosque',
    'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida',
    'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Prado', 'Macul', 'Maipú',
    'Melipilla', 'Ñuñoa', 'Padre Hurtado', 'Peñaflor', 'Peñalolén', 'Providencia',
    'Pudahuel', 'Puente Alto', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca',
    'San Bernardo', 'San Joaquín', 'San Miguel', 'Santiago', 'Talagante', 'Vitacura',
  ],
  'Región de O’Higgins': ['Graneros', 'Machalí', 'Rancagua', 'Rengo', 'San Fernando', 'San Vicente', 'Santa Cruz'],
  'Región del Maule': ['Curicó', 'Linares', 'Parral', 'Talca'],
  'Región de Ñuble': ['Bulnes', 'Chillán', 'Quillón', 'San Carlos'],
  'Región del Biobío': [
    'Arauco', 'Cabrero', 'Cañete', 'Chiguayante', 'Concepción', 'Coronel',
    'Curanilahue', 'Hualpén', 'Laja', 'Lebu', 'Los Ángeles', 'Lota', 'Mulchén',
    'Penco', 'Talcahuano', 'Tomé', 'Yumbel',
  ],
  'Región de La Araucanía': [
    'Angol', 'Carahue', 'Collipulli', 'Curacautín', 'Freire', 'Lautaro',
    'Loncoche', 'Nueva Imperial', 'Pitrufquén', 'Pucón', 'Temuco', 'Victoria', 'Villarrica',
  ],
  'Región de Los Ríos': ['La Unión', 'Panguipulli', 'Río Bueno', 'Valdivia'],
  'Región de Los Lagos': ['Ancud', 'Calbuco', 'Castro', 'Frutillar', 'Osorno', 'Puerto Montt', 'Purranque', 'Quellón'],
  'Región de Aysén': ['Coyhaique'],
  'Región de Magallanes y de la Antártica Chilena': ['Puerto Natales', 'Punta Arenas'],
};

function initCheckoutForm() {
  const form = document.getElementById('purchase-order-form');
  const regionSelect = document.getElementById('starken-region');
  const citySelect = document.getElementById('starken-city');
  if (!form || !regionSelect || !citySelect) return;

  Object.keys(STARKEN_DATA).forEach((region) => {
    const opt = document.createElement('option');
    opt.value = region;
    opt.textContent = region;
    regionSelect.appendChild(opt);
  });

  regionSelect.addEventListener('change', () => {
    const cities = STARKEN_DATA[regionSelect.value];
    citySelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    if (cities) {
      citySelect.disabled = false;
      placeholder.textContent = '-- Selecciona Ciudad / Comuna --';
      citySelect.appendChild(placeholder);
      cities.forEach((city) => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city;
        citySelect.appendChild(opt);
      });
    } else {
      citySelect.disabled = true;
      placeholder.textContent = '-- Primero selecciona una región --';
      citySelect.appendChild(placeholder);
    }
  });

  const starkenPanel = document.getElementById('starken-cascading-panel');
  const deliveryPanel = document.getElementById('home-delivery-panel');
  const shippingLabel = document.getElementById('shipping-cost-label');
  const shippingRadios = document.querySelectorAll('input[name="shipping_method"]');

  function handleShippingChange() {
    const checked = document.querySelector('input[name="shipping_method"]:checked');
    if (!checked) return;
    starkenPanel.classList.add('hidden');
    deliveryPanel.classList.add('hidden');

    if (checked.value === 'pickup') {
      shippingLabel.textContent = 'Retiro gratis (Ñuñoa)';
      shippingLabel.className = 'text-emerald-700 font-semibold';
    } else if (checked.value === 'starken') {
      starkenPanel.classList.remove('hidden');
      shippingLabel.textContent = 'Por pagar (en sucursal Starken)';
      shippingLabel.className = 'text-neutral-900 font-medium';
    } else if (checked.value === 'delivery') {
      deliveryPanel.classList.remove('hidden');
      shippingLabel.textContent = 'Por pagar (contra entrega)';
      shippingLabel.className = 'text-neutral-900 font-medium';
    }
  }
  shippingRadios.forEach((r) => r.addEventListener('change', handleShippingChange));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const successMsg = document.getElementById('success-message');
    if (successMsg) {
      successMsg.classList.remove('hidden');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
  if (!searchInput || !filterPills.length) return;

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

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterCatalog();
  });

  const hashCategory = window.location.hash.replace('#', '');
  const hashPill = document.querySelector(`.filter-pill[data-category="${hashCategory}"]`);
  if (hashPill) {
    hashPill.click();
  }
}
