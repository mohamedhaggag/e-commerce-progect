import { getWishlist, removeFromWishlist, addToCart, isLoggedIn } from "../shared/store.js";

const grid = document.getElementById("wishlistGrid");
const empty = document.getElementById("emptyState");
const clearBtn = document.getElementById("clearAllBtn");

function fmt(n){ return `$${Number(n).toFixed(2)}`; }

function render(){
  const items = getWishlist();
  if (!items.length){
    grid.innerHTML = "";
    empty?.classList.remove("d-none");
    return;
  }
  empty?.classList.add("d-none");
  grid.innerHTML = items.map(it => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="p-3 card-wish h-100 d-flex flex-column">
        <div class="img-wrap mb-3"><img src="${it.image}" alt="${it.title}"/></div>
        <div class="title mb-1">${it.title}</div>
        <div class="price mb-3">${fmt(it.price)}</div>
        <div class="mt-auto d-flex gap-2">
          <button class="btn btn-dark btn-add" data-id="${it.id}">Add to Cart</button>
          <button class="btn btn-outline-secondary btn-remove" data-id="${it.id}">Remove</button>
        </div>
      </div>
    </div>
  `).join("");
}

grid?.addEventListener("click", (e)=>{
  const add = e.target.closest('.btn-add');
  const rem = e.target.closest('.btn-remove');
  if (add){
    const id = add.getAttribute('data-id');
    const items = getWishlist();
    const it = items.find(x=>x.id===id);
    if (!it) return;
    if (!isLoggedIn()){ window.location.href = '../login/login.html'; return; }
    addToCart({ id: it.id, title: it.title, price: it.price, image: it.image }, 1);
    removeFromWishlist(id); render();
  }
  if (rem){
    const id = rem.getAttribute('data-id');
    removeFromWishlist(id); render();
  }
});

clearBtn?.addEventListener('click', ()=>{
  localStorage.setItem('wishlist_v1', JSON.stringify([]));
  render();
});

render();
