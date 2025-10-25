// product-details.js
import { findProductById, addToCart, PRODUCT_DETAILS, isLoggedIn, addToWishlist } from '../shared/store.js';

function $(sel, root = document) { return root.querySelector(sel); }

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getParam('id');
  const product = id ? findProductById(id) : null;
  if (!product) {
    // Fallback: redirect back to products
    window.location.href = '../products/products.html';
    return;
  }

  $('#productTitle').textContent = product.title;
  $('#productPrice').textContent = `Starting at $${product.price}`;
  const main = $('#mainImage');
  const details = PRODUCT_DETAILS[product.id] || {};
  const gallery = (details.images && details.images.length ? details.images : [product.image])
    .filter((src, idx, arr) => src && arr.indexOf(src) === idx);
  if (main) main.src = gallery[0] || product.image;

  const thumbs = $('#thumbs');
  if (thumbs) {
    thumbs.innerHTML = '';
    gallery.forEach((src, i) => {
      const t = document.createElement('img');
      t.src = src;
      t.alt = product.title + ' ' + (i+1);
      if (i === 0) t.classList.add('active');
      t.addEventListener('click', () => {
        if (main) main.src = src;
        thumbs.querySelectorAll('img').forEach(el => el.classList.remove('active'));
        t.classList.add('active');
      });
      thumbs.appendChild(t);
    });
  }

  // Specifications and overview
  if (details.overview) $('#overview').textContent = details.overview;
  if (details.storage) $('#specStorage').textContent = details.storage;
  if (details.camera) $('#specCamera').textContent = details.camera;
  if (details.display) $('#specDisplay').textContent = details.display;
  const colorsWrap = $('#colorDots');
  if (colorsWrap && Array.isArray(details.colors)) {
    colorsWrap.innerHTML = '';
    details.colors.forEach(c => {
      const dot = document.createElement('span');
      dot.className = 'color-dot';
      dot.style.backgroundColor = c;
      colorsWrap.appendChild(dot);
    });
  }

  document.querySelector('.add-btn')?.addEventListener('click', () => {
    if (!isLoggedIn()) { window.location.href = '../login/login.html'; return; }
    addToCart({ id: product.id, title: product.title, price: product.price, image: product.image }, 1);
    window.location.href = '../cart/cart.html';
  });

  // Inject a wishlist button next to cart button if not present
  const addBtn = document.querySelector('.add-btn');
  if (addBtn && !document.getElementById('wishBtn')) {
    const wishBtn = document.createElement('button');
    wishBtn.id = 'wishBtn';
    wishBtn.className = 'btn btn-outline-secondary ms-2 mt-2';
    wishBtn.innerHTML = '<i class="fa-regular fa-heart me-1"></i> Add to Wishlist';
    addBtn.parentElement?.insertBefore(wishBtn, addBtn.nextSibling);
    wishBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addToWishlist({ id: product.id, title: product.title, price: product.price, image: product.image });
      wishBtn.innerHTML = '<i class="fa-solid fa-heart text-danger me-1"></i> In Wishlist';
    });
  }

  // Related cards: add current product to cart as a quick add
  document.querySelectorAll('a.related-add').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isLoggedIn()) { window.location.href = '../login/login.html'; return; }
      addToCart({ id: product.id, title: product.title, price: product.price, image: product.image }, 1);
      window.location.href = '../cart/cart.html';
    });
  });

  // See More -> products listing
  document.getElementById('seeMoreRelated')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../products/products.html';
  });
});
