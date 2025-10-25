// products.js
// Render products, filter, search, and actions using shared store
import { PRODUCTS, addToCart, isLoggedIn, addToWishlist } from '../shared/store.js';

// ---- dom helpers ----
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ---- render a single card ----
function cardTemplate(p) {
  return `
    <div class="card m-2 position-relative" style="width: 18rem;">
      <button class="btn btn-light position-absolute top-0 end-0 m-2 btn-wishlist" title="Add to wishlist" data-id="${p.id}"><i class="fa-regular fa-heart"></i></button>
      <div class="ratio ratio-4x3 p-3 bg-white">
        <img src="${p.image}" class="w-100 h-100 object-fit-contain" alt="${p.title}">
      </div>
      <div class="card-body text-center">
        <h3 class="card-title">${p.title}</h3>
        <p class="card-text">Price ${p.price}$</p>
        <div class="d-grid gap-2">
          <a class="btn btn-outline-dark view-details" data-id="${p.id}">View Details</a>
          <button class="btn btn-dark add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>`;
}

// ---- main render with filters ----
let state = { category: 'all', search: '' };

function initFromQuery() {
  const qs = new URLSearchParams(window.location.search);
  const cat = qs.get('cat');
  const q = qs.get('search') || qs.get('q');
  if (cat) state.category = cat;
  if (q) state.search = q;
}

function render() {
  const grid = $('#productsGrid');
  const term = state.search.trim().toLowerCase();
  const filtered = PRODUCTS.filter(p => {
    const okCat = state.category === 'all' || p.category === state.category;
    const okSearch = !term || p.title.toLowerCase().includes(term);
    return okCat && okSearch;
  });
  grid.innerHTML = filtered.map(cardTemplate).join('') || `
    <p class="text-muted my-5">No products found.</p>
  `;
}

// ---- events ----
function setupCategoryTiles() {
  $$('.cat-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      $$('.cat-tile').forEach(t => t.classList.remove('active'));
      tile.classList.add('active');
      state.category = tile.dataset.cat || 'all';
      render();
    });
  });

  // reflect selected category from query
  const active = document.querySelector(`.cat-tile[data-cat="${state.category}"]`);
  if (active) {
    $$('.cat-tile').forEach(t => t.classList.remove('active'));
    active.classList.add('active');
  }
}

function setupSearch() {
  const input = $('#searchInput');
  const btn = $('#searchBtn');
  const go = () => { state.search = input.value; render(); };
  input && input.addEventListener('input', go);
  btn && btn.addEventListener('click', go);

  if (input && state.search) input.value = state.search;
}

function setupActions() {
  const grid = $('#productsGrid');
  grid.addEventListener('click', (e) => {
    const view = e.target.closest('a.view-details');
    const add = e.target.closest('button.add-to-cart');
    const wish = e.target.closest('button.btn-wishlist');
    if (view) {
      const id = view.dataset.id;
      window.location.href = `/product%20details/product-details.html?id=${encodeURIComponent(id)}`;
      return;
    }
    if (wish) {
      const id = wish.dataset.id;
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return;
      addToWishlist({ id: p.id, title: p.title, price: p.price, image: p.image });
      wish.innerHTML = '<i class="fa-solid fa-heart text-danger"></i>';
      wish.classList.add('active');
      return;
    }
    if (add) {
      const id = add.dataset.id;
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return;
      if (!isLoggedIn()) {
        window.location.href = '/login/login.html';
        return;
      }
      addToCart({ id: p.id, title: p.title, price: p.price, image: p.image }, 1);
      window.location.href = '/cart/cart.html';
    }
  });
}

// ---- init ----
document.addEventListener('DOMContentLoaded', () => {
  initFromQuery();
  setupCategoryTiles();
  setupSearch();
  setupActions();
  render();
});
