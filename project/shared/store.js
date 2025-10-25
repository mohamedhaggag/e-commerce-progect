// shared/store.js
// Centralized data and helpers for products, cart, orders, and auth.

// ---- Product catalog ----
export const PRODUCTS = [
  { id: 'p-iph-17',  title: 'iPhone 17',             price: 150,  image: '../imgs/IP.png',                 category: 'iphone' },
  { id: 'p-iph-17p', title: 'iPhone 17 Pro',        price: 220,  image: '../imgs/IP2.png',                category: 'iphone' },
  { id: 'p-lap-m1',  title: 'MacBook Air M1',       price: 999,  image: '../imgs/mac air m1.jpg',         category: 'laptop' },
  { id: 'p-lap-m3',  title: 'MacBook Pro M3',       price: 1899, image: '../imgs/mac air.png',            category: 'laptop' },
  { id: 'p-air-3',   title: 'AirPods 3rd Gen',      price: 199,  image: '../imgs/Airpodes.webp',          category: 'airpods' },
  { id: 'p-air-pro', title: 'AirPods Pro 2',        price: 249,  image: '../imgs/Airpodes.webp',          category: 'airpods' },
  { id: 'p-watch-9', title: 'Apple Watch Series 9', price: 399,  image: '../imgs/applewatch series9.png', category: 'watch' },
  { id: 'p-ultra',   title: 'Apple Watch Ultra',    price: 799,  image: '../imgs/apple watch ultra.png',  category: 'watch' },
  { id: 'p-vision',  title: 'Apple Vision Pro',     price: 3499, image: '../imgs/apple vision.jpg',       category: 'vision' },
  { id: 'p-tv-55',   title: 'Apple TV',             price: 899,  image: '../imgs/apple tv.jpg',           category: 'tv' }
];

export const findProductById = (id) => PRODUCTS.find(p => p.id === id);

// ---- Cart helpers (localStorage) ----
const CART_KEY = 'cart_v1';
export const getCart = () => {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
};
export const setCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
export function addToCart(item, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex(x => x.id === item.id);
  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ ...item, qty });
  setCart(cart);
}
export function removeFromCart(id) {
  const cart = getCart().filter(x => x.id !== id);
  setCart(cart);
}
export function updateQty(id, qty) {
  const cart = getCart().map(x => x.id === id ? { ...x, qty: Math.max(1, qty) } : x);
  setCart(cart);
}
export function cartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  return { items: cart, count: cart.reduce((s, x) => s + x.qty, 0), subtotal };
}

// ---- Order (checkout) helpers ----
const ORDER_KEY = 'order_v1';
export const getOrder = () => {
  try { return JSON.parse(localStorage.getItem(ORDER_KEY)) || null; } catch { return null; }
};
export const setOrder = (order) => localStorage.setItem(ORDER_KEY, JSON.stringify(order));
export const clearOrder = () => localStorage.removeItem(ORDER_KEY);

export function seedOrderFromCart() {
  const { items, subtotal } = cartTotals();
  const tax = Math.round(subtotal * 0.02 * 100) / 100;
  const shipping = items.length > 0 ? 10 : 0;
  const order = {
    items,
    pricing: { subtotal, tax, shipping, total: subtotal + tax + shipping },
    shippingInfo: null,
    deliveryMethod: null,
    payment: null,
    createdAt: Date.now()
  };
  setOrder(order);
  return order;
}

// ---- Users / Auth helpers ----
const USERS_KEY = 'users';
export const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
export const saveUsers = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr));

export const isLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true';
export const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem('currentUser')) || null; } catch { return null; }
};
export const setCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user));
export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
};

// ---- Wishlist helpers ----
const WISHLIST_KEY = 'wishlist_v1';
export const getWishlist = () => {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; } catch { return []; }
};
export const setWishlist = (arr) => localStorage.setItem(WISHLIST_KEY, JSON.stringify(arr));
export function addToWishlist(item){
  const list = getWishlist();
  if (!list.find(x => x.id === item.id)) list.push(item);
  setWishlist(list);
}
export function removeFromWishlist(id){
  setWishlist(getWishlist().filter(x => x.id !== id));
}

// Update user helper (by email)
export function updateUser(email, updater) {
  const users = getUsers();
  const idx = users.findIndex(u => (u.email || '').toLowerCase() === (email||'').toLowerCase());
  if (idx === -1) return;
  const updated = typeof updater === 'function' ? updater(users[idx]) : { ...users[idx], ...updater };
  users[idx] = updated;
  saveUsers(users);
  const cur = getCurrentUser();
  if (cur && (cur.email||'').toLowerCase() === (email||'').toLowerCase()) setCurrentUser({ ...cur, ...updated });
}

// ---- Orders helpers ----
const ORDERS_KEY = 'orders_v1';
export const getOrders = () => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
export const saveOrders = (arr) => localStorage.setItem(ORDERS_KEY, JSON.stringify(arr));
export function addOrder(order) {
  const arr = getOrders();
  arr.push(order);
  saveOrders(arr);
}
export function getOrdersForUser(email) {
  const lower = (email||'').toLowerCase();
  return getOrders().filter(o => (o.userEmail||'').toLowerCase() === lower);
}

// ---- Product details (images + specs per product) ----
// Paths are relative to product details page
export const PRODUCT_DETAILS = {
  'p-iph-17': {
    images: ['../imgs/IP.png','../imgs/IP2.png','../imgs/IP3.png','../imgs/IP4.png'],
    overview: 'iPhone 17 delivers blazing performance, great battery life, and a bright OLED display in a sleek design.',
    storage: '128GB, 256GB, 512GB',
    colors: ['#e26b3f','#1f2f5f','#a3a3a3'],
    camera: '48MP Main, 12MP Ultra‑Wide',
    display: '6.1‑inch OLED, 120Hz'
  },
  'p-iph-17p': {
    images: ['../imgs/IP2.png','../imgs/IP3.png','../imgs/IP4.png'],
    overview: 'iPhone 17 Pro adds a Pro‑grade camera system and a high‑refresh ProMotion display for smooth visuals.',
    storage: '256GB, 512GB, 1TB',
    colors: ['#e26b3f','#1f2f5f','#a3a3a3'],
    camera: '48MP Main, 12MP Ultra‑Wide, 12MP Telephoto',
    display: '6.7‑inch ProMotion OLED, 120Hz'
  },
  'p-lap-m1': {
    images: ['../imgs/mac%20air%20m1.jpg','../imgs/mac%20air.png'],
    overview: 'MacBook Air with M1 chip is thin, silent, and fast — perfect for everyday productivity and study.',
    storage: '256GB, 512GB',
    colors: ['#a3a3a3','#4b5563'],
    camera: '720p FaceTime HD camera',
    display: '13.3‑inch Retina display'
  },
  'p-lap-m3': {
    images: ['../imgs/mac.png','../imgs/mac%20air.png'],
    overview: 'MacBook Pro with Apple silicon for creators who need sustained performance and long battery life.',
    storage: '512GB, 1TB, 2TB',
    colors: ['#a3a3a3','#111827'],
    camera: '1080p FaceTime HD camera',
    display: '14‑inch Liquid Retina XDR'
  },
  'p-air-3': {
    images: ['../imgs/Airpodes.webp','../imgs/air.png'],
    overview: 'AirPods (3rd generation) bring Spatial Audio, adaptive EQ, and a comfortable fit.',
    storage: '—',
    colors: ['#ffffff'],
    camera: '—',
    display: '—'
  },
  'p-air-pro': {
    images: ['../imgs/Airpodes.webp'],
    overview: 'AirPods Pro (2nd gen) offer active noise cancellation with Transparency mode and great sound.',
    storage: '—',
    colors: ['#ffffff'],
    camera: '—',
    display: '—'
  },
  'p-watch-9': {
    images: ['../imgs/applewatch%20series9.png'],
    overview: 'Apple Watch Series 9 helps you stay connected, active, and healthy with powerful new gestures.',
    storage: '64GB',
    colors: ['#111827','#a3a3a3'],
    camera: '—',
    display: 'Always‑On Retina display'
  },
  'p-ultra': {
    images: ['../imgs/apple%20watch%20ultra.png'],
    overview: 'Apple Watch Ultra is the most rugged and capable Apple Watch ever for outdoor adventures.',
    storage: '64GB',
    colors: ['#f59e0b','#374151'],
    camera: '—',
    display: 'Always‑On Retina display'
  },
  'p-vision': {
    images: ['../imgs/apple%20vision.jpg','../imgs/apple%20vision1.jpg'],
    overview: 'Apple Vision Pro introduces spatial computing: work, watch, and connect in an infinite canvas.',
    storage: '256GB, 512GB, 1TB',
    colors: ['#1f2937','#9ca3af'],
    camera: '3D camera for spatial photos and videos',
    display: 'micro‑OLED display system'
  },
  'p-tv-55': {
    images: ['../imgs/apple%20tv.jpg'],
    overview: 'Apple TV brings your favorite shows and apps with powerful performance and Siri Remote.',
    storage: '64GB, 128GB',
    colors: ['#111827'],
    camera: '—',
    display: '4K HDR output'
  }
};
