/* ===== CampusCafe main page logic (js/app.js) ===== */
const CART_KEY = "campusCafeCart";
const CHECKOUT_URL = "pages/checkout.html";

let cart = loadCart();
let activeCategory = "all";
let searchTerm = "";

const menuGrid = document.getElementById("menu-grid");
const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cart-count");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartMsg = document.getElementById("cart-msg");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const checkoutBtn = document.getElementById("checkout-btn");

/* ---------- storage ---------- */
function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ---------- menu ---------- */
function renderMenu() {
  const term = searchTerm.trim().toLowerCase();
  const items = MENU_ITEMS.filter(item =>
    (activeCategory === "all" || item.category === activeCategory) &&
    item.name.toLowerCase().includes(term)
  );

  if (items.length === 0) {
    menuGrid.innerHTML = '<p class="empty-state">No items match your search.</p>';
    return;
  }

  menuGrid.innerHTML = items.map(item => `
    <article class="menu-card">
      <img src="${item.icon}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p class="price">₹${item.price}</p>
      <button class="btn btn-primary add-btn" data-id="${item.id}">Add to Cart</button>
    </article>
  `).join("");
}

/* ---------- cart ---------- */
function addToCart(id) {
  const item = MENU_ITEMS.find(i => i.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;                       // same item -> increase qty, no duplicate row
  } else {
    cart.push({ id: item.id, name: item.name, price: Number(item.price), qty: 1 });
  }
  cartMsg.textContent = "";
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const entry = cart.find(c => c.id === id);
  if (!entry) return;
  entry.qty += delta;
  if (entry.qty <= 0) {
    cart = cart.filter(c => c.id !== id);    // remove at 0
  }
  saveCart();
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartList.innerHTML = '<li class="cart-empty">Your cart is empty.</li>';
  } else {
    cartList.innerHTML = cart.map(c => `
      <li>
        <span class="cart-item-name">${c.name}</span>
        <span class="qty-controls">
          <button class="qty-btn" data-action="dec" data-id="${c.id}" aria-label="Decrease ${c.name}">−</button>
          <span>${c.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${c.id}" aria-label="Increase ${c.name}">+</button>
        </span>
        <span>₹${Number(c.price) * Number(c.qty)}</span>
      </li>
    `).join("");
  }

  // FIX: numeric reduce with initial value 0 (no string concatenation)
  const subtotal = cart.reduce((sum, c) => sum + Number(c.price) * Number(c.qty), 0);
  const totalQty = cart.reduce((sum, c) => sum + Number(c.qty), 0);
  cartSubtotal.textContent = subtotal;
  cartCount.textContent = totalQty;
}

/* ---------- events ---------- */
menuGrid.addEventListener("click", e => {
  const btn = e.target.closest(".add-btn");
  if (btn) addToCart(Number(btn.dataset.id));
});

cartList.addEventListener("click", e => {
  const btn = e.target.closest(".qty-btn");
  if (!btn) return;
  changeQty(Number(btn.dataset.id), btn.dataset.action === "inc" ? 1 : -1);
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    activeCategory = btn.dataset.category;
    filterButtons.forEach(b => b.classList.toggle("active", b === btn));
    renderMenu();
  });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  renderMenu();
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    cartMsg.textContent = "Your cart is empty. Please add at least one item before checkout.";
    return;
  }
  window.location.href = CHECKOUT_URL;
});

/* ---------- init ---------- */
renderMenu();
renderCart();
