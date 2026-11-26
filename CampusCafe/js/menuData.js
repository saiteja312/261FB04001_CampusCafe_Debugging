/* ===== Menu data (js/menuData.js) — must load BEFORE js/app.js ===== */
/* FIX: prices are NUMBERS (not strings), so totals add instead of concatenating. */
/* FIX: icon paths point to the real images/ folder, relative to index.html. */
const MENU_ITEMS = [
  { id: 1, name: "Masala Chai",    category: "drinks", price: 20, icon: "images/chai.svg" },
  { id: 2, name: "Filter Coffee",  category: "drinks", price: 30, icon: "images/coffee.svg" },
  { id: 3, name: "Cold Coffee",    category: "drinks", price: 60, icon: "images/cold-coffee.svg" },
  { id: 4, name: "Lemon Soda",     category: "drinks", price: 40, icon: "images/soda.svg" },
  { id: 5, name: "Samosa",         category: "snacks", price: 20, icon: "images/samosa.svg" },
  { id: 6, name: "Veg Sandwich",   category: "snacks", price: 50, icon: "images/sandwich.svg" },
  { id: 7, name: "Veg Burger",     category: "snacks", price: 80, icon: "images/burger.svg" },
  { id: 8, name: "Choco Brownie",  category: "snacks", price: 70, icon: "images/brownie.svg" }
];
