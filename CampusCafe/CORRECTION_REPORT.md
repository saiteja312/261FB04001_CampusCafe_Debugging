# CampusCafe — Step-by-Step Correction Report

**Project:** CampusCafe Student Order Portal (HTML + CSS + JavaScript)
**Note:** Only `index.html` and `README.md` were supplied. The other files they reference (CSS, JS, `pages/checkout.html`, SVG icons) were missing, so they were rebuilt to match the structure the HTML expects.

---

## 1. Final folder structure

```
CampusCafe/
├── index.html
├── CORRECTION_REPORT.md
├── README.md
├── pages/
│   └── checkout.html
├── css/
│   ├── main.css
│   └── theme.css
├── js/
│   ├── menuData.js
│   ├── app.js
│   └── checkout.js
└── images/
    ├── chai.svg  coffee.svg  cold-coffee.svg  soda.svg
    └── samosa.svg  sandwich.svg  burger.svg  brownie.svg
```

---

## Part 1 — Paths, structure and existing bugs

| # | Problem found | Where | Fix applied |
|---|---------------|-------|-------------|
| 1 | Stylesheet linked from the wrong folder (`styles/them.css`) and with a typo in the name (`them` instead of `theme`) | `index.html` line 8 | Changed to `css/theme.css`; both stylesheets now live in `css/` |
| 2 | Script path wrong: `scripts/app.js` (folder does not exist) | `index.html` line 57 | Changed to `js/app.js` |
| 3 | **Script loading order wrong:** `app.js` loaded before `menuData.js`, so `MENU_ITEMS` was undefined when `app.js` ran and the menu never rendered | `index.html` lines 57–58 | Load `js/menuData.js` first, then `js/app.js` |
| 4 | Checkout page assets would break because `pages/` is one folder deep | `pages/checkout.html` | Used `../css/…`, `../js/…` and `../index.html` |
| 5 | Navigation to checkout not wired / wrong relative path | `app.js` | Checkout button goes to `pages/checkout.html` (from `index.html`); checkout "Back" link goes to `../index.html` |
| 6 | Broken menu icons (missing files / wrong paths) | `menuData.js` | Created 8 SVG icons in `images/` and pointed each item's `icon` to `images/<name>.svg` (relative to `index.html`) |
| 7 | **Add to Cart buttons did nothing** (menu never rendered + no click handler) | `app.js` | Menu rendered from data; one delegated click listener on `#menu-grid` handles every `.add-btn` |
| 8 | **Totals concatenating** (`"20" + "30"` → `"2030"`) because prices were strings and `reduce` had no numeric start | `menuData.js`, `app.js` | Prices stored as numbers; `Number()` applied; `reduce(..., 0)` |
| 9 | **Saved cart not shown on checkout** (different/no storage key, nothing read on load) | `app.js`, `checkout.js` | Both pages use the same `localStorage` key `campusCafeCart`; checkout reads and renders it on load |
| 10 | **Grand Total missing** on checkout | `checkout.js` | `renderSummary()` computes Subtotal − Discount and writes `#co-grand` |

## Part 2 — Missing logic added

| # | Feature | Implementation |
|---|---------|----------------|
| 11 | Category filter + active highlight | `.filter-btn` click sets `activeCategory` and toggles the `active` class, then `renderMenu()` |
| 12 | Real-time search combined with category | `input` event on `#search-input`; `renderMenu()` applies category **and** name search together; shows "No items match" when empty |
| 13 | Same item increases quantity | `addToCart()` looks for an existing row and does `qty += 1` instead of pushing a duplicate |
| 14 | `+` / `−` buttons; remove at 0 | `changeQty()`; when `qty <= 0` the item is filtered out of the cart |
| 15 | `Cart: X items` badge | Total of all quantities written to `#cart-count` on every render |
| 16 | Block empty-cart checkout | Checkout button shows "Your cart is empty…" in `#cart-msg` and does not navigate |
| 17 | `STUDENT15` promo | 15 % off subtotal only if subtotal ≥ ₹150 |
| 18 | Promo errors | Invalid code → "Invalid promo code."; subtotal < ₹150 → explains the ₹150 minimum. Both reset `discount` to `0` |
| 19 | Order validation | Blocks empty cart; requires **Full Name** and **Roll Number** |
| 20 | Order confirmation | Shows confirmation with generated Order ID (`CC-…`) and amount paid, then removes the saved cart from `localStorage` |

---

## Verification performed

Tested in a simulated browser (jsdom, served over HTTP):

- 8 menu cards render with icons; no missing image files.
- Empty-cart checkout blocked with message.
- 3 × Veg Burger + 2 × Filter Coffee → badge `5`, subtotal `300` (numeric), only 2 rows.
- Pressing `−` twice on coffee removes the row.
- Snacks filter → 4 cards; search "bro" → 1 card.
- Checkout loaded saved cart; grand total `240`.
- Invalid code → error; `STUDENT15` on ₹240 → discount ₹36, grand total ₹204.
- Empty name/roll → blocked; valid details → confirmation with Order ID and cart cleared.

Not tested: the under-₹150 promo error and visual appearance in a real browser; please check them when you run it.

---

## Reflection answer

A single file pasted into a chat only shows that one file. The bugs here were **cross-file**: a wrong folder in a `<link>`, a typo'd filename, scripts loading in the wrong order, `../` paths needed on a page in a sub-folder, a shared storage key between two pages, and icon paths that must match actual files in `images/`. None of that is visible from `index.html` alone, so a chat tool can only guess at what the other files contain. Workspace-aware tools such as GitHub Copilot or Antigravity can see the whole folder tree, open every referenced file, check that each path really exists, trace how data flows from `menuData.js` through `app.js` to `checkout.js`, and apply edits across several files consistently. That is how they locate and fix this kind of bug accurately.
