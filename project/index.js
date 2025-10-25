// index.js
// Lightweight home-page helpers, safe against missing elements

document.addEventListener('DOMContentLoaded', () => {
  // Hook up "View Details" buttons in Home listings
  document.querySelectorAll('a.home-view-details[data-id]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('data-id');
      if (!id) return;
      window.location.href = `product%20details/product-details.html?id=${encodeURIComponent(id)}`;
    });
  });

  // Optional: show user name if available
  try {
    const el = document.getElementById('userNameDisplay');
    const stored = localStorage.getItem('currentUser');
    if (el && stored) {
      const user = JSON.parse(stored);
      if (user?.name) el.textContent = user.name;
    }
  } catch {}

  // Explore section category tiles → open products with preset filter
  try {
    const cards = document.querySelectorAll('.explore .product-card');
    cards.forEach((card) => {
      const label = card.querySelector('.product-info span')?.textContent?.trim().toLowerCase();
      let cat = null;
      if (!label) return;
      if (label.includes('iphone') || label.includes('i phone')) cat = 'iphone';
      else if (label.includes('mac')) cat = 'laptop';
      else if (label.includes('air') && label.includes('pod')) cat = 'airpods';
      else if (label.includes('watch')) cat = 'watch';
      else if (label.includes('vision')) cat = 'vision';
      else if (label === 'tv') cat = 'tv';
      if (!cat) return;
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        window.location.href = `/products/products.html?cat=${encodeURIComponent(cat)}`;
      });
    });
  } catch {}
});

