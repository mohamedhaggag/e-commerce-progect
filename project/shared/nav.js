// shared/nav.js
// Initialize navbar links (profile icon goes to login or account depending on auth state)
import { isLoggedIn, logout } from './store.js';

function setProfileLink() {
  const anchors = document.querySelectorAll('a');
  let profileAnchor = null;
  anchors.forEach(a => {
    const i = a.querySelector('i');
    if (i && i.classList.contains('fa') && i.classList.contains('fa-user')) {
      profileAnchor = a;
    }
  });
  if (!profileAnchor) return;

  profileAnchor.setAttribute('href', isLoggedIn() ? '/Account%20Dtails/account.html' : '/login/login.html');
}

function setCartLink() {
  // If any cart icon links are '#', set to cart page
  const anchors = document.querySelectorAll('a');
  anchors.forEach(a => {
    const i = a.querySelector('i');
    if (i && i.classList.contains('fa-cart-shopping')) {
      if (!a.getAttribute('href') || a.getAttribute('href') === '#') {
        a.setAttribute('href', '/cart/cart.html');
      }
    }
    if (i && i.classList.contains('fa-heart')) {
      if (!a.getAttribute('href') || a.getAttribute('href') === '#') {
        a.setAttribute('href', '/wishlist/wish.html');
      }
    }
  });
}

function setBrandLink() {
  const brand = document.querySelector('a.navbar-brand');
  if (brand) brand.setAttribute('href', '/index.html');
}

function ensureStyles() {
  if (document.getElementById('user-dd-styles')) return;
  const style = document.createElement('style');
  style.id = 'user-dd-styles';
  style.textContent = `
    .user-dd{ position:fixed; z-index:1050; background:var(--panel,#fff); color:var(--text,#111); border:1px solid var(--line,#e5e7eb); border-radius:10px; min-width:180px; box-shadow:0 12px 32px rgba(0,0,0,.15); overflow:hidden; }
    .user-dd a, .user-dd button{ display:block; width:100%; text-align:left; padding:10px 12px; color:inherit; background:none; border:0; text-decoration:none; cursor:pointer; font:inherit; }
    .user-dd a:hover, .user-dd button:hover{ background: color-mix(in oklab, var(--accent,#0ea5e9) 10%, transparent); }
    .user-dd .sep{ height:1px; background:var(--line,#e5e7eb); margin:4px 0; }
  `;
  document.head.appendChild(style);
}

function setupUserDropdown() {
  const anchors = document.querySelectorAll('a');
  let userA = null;
  anchors.forEach(a => {
    const i = a.querySelector('i');
    if (i && i.classList.contains('fa') && i.classList.contains('fa-user')) userA = a;
  });
  if (!userA) return;

  ensureStyles();

  function close() { document.getElementById('user-dd')?.remove(); }
  function open() {
    close();
    const rect = userA.getBoundingClientRect();
    const dd = document.createElement('div');
    dd.id = 'user-dd';
    dd.className = 'user-dd';
    dd.style.top = `${rect.bottom + 8}px`;
    const width = 200;
    dd.style.width = width + 'px';
    dd.style.left = Math.max(8, rect.right - width) + 'px';

    if (isLoggedIn()) {
      dd.innerHTML = `
        <a href="/Account%20Dtails/account.html">View Profile</a>
        <div class="sep"></div>
        <button type="button" id="ddLogout">Log out</button>
      `;
    } else {
      dd.innerHTML = `
        <a href="/login/login.html">Login</a>
        <a href="/signup/signup.html">Sign Up</a>
      `;
    }
    document.body.appendChild(dd);

    dd.addEventListener('click', (e) => {
      if (e.target.id === 'ddLogout') {
        e.preventDefault();
        logout();
        window.location.href = '/login/login.html';
      }
    });

    // close on outside click or escape
    const onDoc = (e) => {
      const clickedUser = e.target.closest('a') === userA;
      if (!dd.contains(e.target) && !clickedUser) {
        close();
        document.removeEventListener('click', onDoc);
      }
    };
    setTimeout(() => document.addEventListener('click', onDoc), 0);
    const onKey = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, { once:true });
    window.addEventListener('resize', close, { once:true });
  }

  userA.addEventListener('click', (e) => {
    e.preventDefault();
    const existing = document.getElementById('user-dd');
    if (existing) { existing.remove(); return; }
    open();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  try { setProfileLink(); setCartLink(); setBrandLink(); setupUserDropdown(); } catch {}
});
