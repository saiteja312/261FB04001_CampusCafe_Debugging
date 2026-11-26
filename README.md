# CampusCafe — Student Order Portal

A two-page student ordering web app built with plain **HTML, CSS and JavaScript**. Students browse a menu, filter and search items, manage a cart, apply a student promo code and confirm an order. No frameworks, no build step, no dependencies.

> This repository is the **debugged and enhanced** version of an AI-generated project whose layout, images, scripts, checkout page and calculations were broken. See [What was fixed](#what-was-fixed) below.

## Features

- **Menu** with 8 drinks and snacks, each with its own SVG icon
- **Category filter** (`All` / `Drinks` / `Snacks`) with an active-button highlight
- **Live search** by item name, combined with the active category
- **Cart** that increases quantity for repeated items (no duplicate rows)
- **`+` / `−` quantity buttons**; an item is removed when its quantity reaches 0
- **Cart badge** showing the total number of items
- **Empty-cart guard** that blocks checkout with a helpful message
- **Checkout page** showing the saved cart, Subtotal, Discount and Grand Total
- **Promo code `STUDENT15`**: 15% off the subtotal, only when the subtotal is ₹150 or more
- **Order confirmation** that requires Full Name and Roll Number, shows a generated Order ID and clears the saved cart

## Tech stack

HTML5 · CSS3 (variables, grid) · Vanilla JavaScript · `localStorage`

## Project structure

```
CampusCafe/
├── index.html              Menu + cart page
├── pages/
│   └── checkout.html       Checkout page
├── css/
│   ├── main.css            Layout and components
│   └── theme.css           Colour variables
├── js/
│   ├── menuData.js         Menu items (must load before app.js)
│   ├── app.js              Menu, filter, search and cart logic
│   └── checkout.js         Promo, totals and order validation
├── images/                 SVG item icons (chai, coffee, cold-coffee, soda,
│                           samosa, sandwich, burger, brownie)
├── CORRECTION_REPORT.md    Step-by-step list of bugs fixed
├── before_after.docx       Before vs after comparison
└── README.md
```

## Getting started

```bash
git clone https://github.com/<your-username>/campuscafe.git
cd campuscafe
```

**Option A — VS Code (recommended)**

1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.

**Option B — any static server**

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly in a browser also works, but a local server is more reliable for `localStorage`.

## How it works

| Piece | Details |
|-------|---------|
| Menu data | `MENU_ITEMS` array in `js/menuData.js` (prices are numbers) |
| Cart storage | `localStorage` key `campusCafeCart`, shared by both pages |
| Cart item shape | `{ id, name, price, qty }` |
| Promo rule | `STUDENT15` → 15% off if subtotal ≥ ₹150, otherwise an error and discount `0` |
| Order ID | Generated as `CC-` + time-based code on confirmation |

## Testing checklist

1. Click **Proceed to Checkout** with an empty cart → blocked with a message.
2. Add the same item twice → one row, quantity 2.
3. Use `+` / `−`; reduce to 0 → the row disappears and the badge updates.
4. Use the category buttons and the search box → the menu filters in real time.
5. Add ₹150 or more, go to checkout, apply `STUDENT15` → 15% discount and correct Grand Total.
6. Try a wrong code, or `STUDENT15` under ₹150 → error message, discount stays `0`.
7. Confirm with a missing name or roll number → blocked; with both filled → Order ID shown and the cart is cleared.

## What was fixed

### Part 1 — Paths, structure and existing bugs

| Problem | Fix |
|---------|-----|
| CSS linked as `styles/them.css` (wrong folder and typo) | `css/theme.css` |
| Script linked as `scripts/app.js` (folder missing) | `js/app.js` |
| `app.js` loaded before `menuData.js`, so the menu data was undefined | `menuData.js` now loads first |
| Checkout page assets not relative to `pages/` | `../css/…`, `../js/…`, `../index.html` |
| Broken menu icons | 8 SVGs created in `images/` and paths corrected |
| Add to Cart buttons not working | Menu rendered from data with a delegated click handler |
| Totals concatenating as text | Numeric prices, `Number()` and `reduce(..., 0)` |
| Saved cart missing on checkout | Shared `localStorage` key, cart rendered on load |
| Grand Total not shown | Subtotal − Discount calculated and displayed |

### Part 2 — Missing logic added

Menu filtering and search, quantity controls, cart badge, empty-cart check, `STUDENT15` promo logic and order confirmation validation.

Full details are in [`CORRECTION_REPORT.md`](CORRECTION_REPORT.md) and [`before_after.docx`](before_after.docx).

## Why workspace-aware AI tools helped

Pasting one file into a chat can't reveal these bugs, because they span several files: wrong folders in `<link>` and `<script>` tags, a misspelled file name, script load order, `../` paths from a sub-folder, a storage key shared by two pages, and icon paths that must match real files. Tools such as GitHub Copilot or Antigravity can see the whole folder tree, open every referenced file and edit them consistently.

## License

No license has been chosen yet. Add a `LICENSE` file (for example MIT) before publishing.
