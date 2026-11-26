/* ===== CampusCafe checkout logic (js/checkout.js) ===== */
const CART_KEY = "campusCafeCart";          // same key as js/app.js
const PROMO_CODE = "STUDENT15";
const PROMO_MIN = 150;
const PROMO_RATE = 0.15;

let cart = loadCart();
let discount = 0;

const listEl = document.getElementById("checkout-list");
const subEl = document.getElementById("co-subtotal");
const discEl = document.getElementById("co-discount");
const grandEl = document.getElementById("co-grand");
const promoInput = document.getElementById("promo-input");
const promoBtn = document.getElementById("promo-btn");
const promoMsg = document.getElementById("promo-msg");
const form = document.getElementById("order-form");
const orderMsg = document.getElementById("order-msg");

function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function getSubtotal() {
  return cart.reduce((sum, c) => sum + Number(c.price) * Number(c.qty), 0);
}

function renderSummary() {
  if (cart.length === 0) {
    listEl.innerHTML = '<li class="cart-empty">Your cart is empty.</li>';
  } else {
    listEl.innerHTML = cart.map(c => `
      <li>
        <span class="cart-item-name">${c.name} × ${c.qty}</span>
        <span>₹${Number(c.price) * Number(c.qty)}</span>
      </li>
    `).join("");
  }
  const subtotal = getSubtotal();
  const grand = Math.max(subtotal - discount, 0);
  subEl.textContent = subtotal;
  discEl.textContent = discount.toFixed(2).replace(/\.00$/, "");
  grandEl.textContent = grand.toFixed(2).replace(/\.00$/, "");
}

/* ---------- promo ---------- */
promoBtn.addEventListener("click", () => {
  const code = promoInput.value.trim().toUpperCase();
  const subtotal = getSubtotal();
  promoMsg.className = "msg-error";

  if (code !== PROMO_CODE) {
    discount = 0;
    promoMsg.textContent = "Invalid promo code.";
  } else if (subtotal < PROMO_MIN) {
    discount = 0;
    promoMsg.textContent = `STUDENT15 needs a subtotal of ₹${PROMO_MIN} or more (yours is ₹${subtotal}).`;
  } else {
    discount = subtotal * PROMO_RATE;
    promoMsg.className = "msg-success";
    promoMsg.textContent = "Promo applied: 15% student discount!";
  }
  renderSummary();
});

/* ---------- confirm order ---------- */
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("full-name").value.trim();
  const roll = document.getElementById("roll-no").value.trim();
  orderMsg.className = "msg-error";

  if (cart.length === 0) {
    orderMsg.textContent = "Your cart is empty. Go back and add items first.";
    return;
  }
  if (!name || !roll) {
    orderMsg.textContent = "Please enter both Full Name and Roll Number.";
    return;
  }

  const orderId = "CC-" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 90 + 10);
  const total = Math.max(getSubtotal() - discount, 0).toFixed(2).replace(/\.00$/, "");

  localStorage.removeItem(CART_KEY);        // clear saved cart
  cart = [];
  discount = 0;
  renderSummary();

  orderMsg.className = "msg-success";
  orderMsg.textContent = `Thank you, ${name} (${roll})! Order ${orderId} confirmed. Amount paid: ₹${total}.`;
  form.reset();
});

renderSummary();
