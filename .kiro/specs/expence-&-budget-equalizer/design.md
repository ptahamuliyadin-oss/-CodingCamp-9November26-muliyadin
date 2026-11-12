# Design Document

## Overview

The Expense & Budget Visualizer is a single-page, client-side web app. Users add transactions (item name, amount, category), see them in a scrollable list, see the total balance at the top, and see a pie chart of spending by category. All data is kept in the browser's Local Storage. There is no backend, no build step, and no test setup.

The app is written with plain HTML, CSS, and vanilla JavaScript. The only external dependencies are Chart.js (pie chart) and Google Fonts (typography), both loaded from a CDN. If either fails to load, the rest of the app keeps working.

## Architecture

The app follows a simple "state → render" pattern. A single in-memory array of transactions is the source of truth. Every change (add or delete) updates that array, saves it to Local Storage, and then re-renders the balance, the list, and the chart from the array.

```
 User action (submit form / click delete)
            │
            ▼
   Validate input (add only)
            │
            ▼
   Update `transactions` array
            │
     ┌──────┴───────┐
     ▼              ▼
 save() to      render()
 Local Storage    ├─ renderBalance()
                  ├─ renderList()
                  └─ renderChart()
```

On page load, `load()` reads and validates the saved data, then `render()` draws the initial state.

## File Structure

```
expense-visualizer/
├── index.html   # Page structure and element ids
├── style.css    # Layout, colors, typography, responsive rules
└── script.js    # State, validation, storage, rendering, events
```

## Components and Interfaces

### Page layout (index.html)

| Section | Element | Purpose |
| --- | --- | --- |
| Header | `.balance`, `#balance` | Shows the Total Balance at the top of the page |
| Form panel | `#expense-form` | Inputs: `#item-name`, `#item-amount`, `#item-category`, plus one error element per field |
| Chart panel | `#spending-chart`, `#chart-empty` | Canvas for the pie chart and an empty-state message |
| List panel | `#tx-list`, `#list-empty` | Scrollable transaction list and an empty-state message |

Scripts are loaded at the end of `<body>`: Chart.js first (pinned to version 4.4.1 on jsDelivr), then `script.js`.

### Responsive layout (style.css)

- Mobile (default): one column. Order is header, form, chart, list.
- Desktop (≥ 760px): two columns. Form on the left, chart on the right, and the transaction list spans the full width below.
- The list has a fixed `max-height` with `overflow-y: auto`, so it scrolls instead of growing the page.

### JavaScript modules (script.js)

All code lives in one IIFE to avoid global variables.

| Function | Responsibility |
| --- | --- |
| `load()` | Reads Local Storage, parses JSON, and keeps only valid entries. Returns `[]` on any error |
| `save()` | Writes the `transactions` array to Local Storage inside a try/catch |
| `validate()` | Checks the three fields and shows inline error messages. Returns `true` or `false` |
| `setError(field, message)` | Shows or clears the error text and the red border for one field |
| `renderBalance()` | Sums all amounts and shows the formatted total |
| `renderList()` | Rebuilds the list (newest first) and toggles the empty state |
| `totalsByCategory()` | Returns the summed amount for Food, Transport, and Fun |
| `renderChart()` | Creates the pie chart on first use, then updates its data. Toggles the empty state |
| `render()` | Calls the three render functions |

Event handling:

- `submit` on the form: validate, push a new transaction, `save()`, `render()`, reset the form, and focus the name field.
- `input` on each field: clears that field's error as the user types.
- `click` on the list (event delegation): if the target is a delete button, remove the transaction by id, `save()`, and `render()`.

## Data Models

### Transaction

```js
{
  id: "lq3x9k2ab7",     // unique string (timestamp + random)
  name: "Lunch",         // trimmed, non-empty string
  amount: 25000,         // number greater than 0
  category: "Food"       // "Food" | "Transport" | "Fun"
}
```

### Storage

- Key: `expense-visualizer.transactions`
- Value: JSON array of Transaction objects.
- Entries that fail validation on load (wrong type or unknown category) are dropped.

### Configuration constants

| Constant | Value | Purpose |
| --- | --- | --- |
| `STORAGE_KEY` | `expense-visualizer.transactions` | Local Storage key |
| `LOCALE` | `id-ID` | Number formatting locale |
| `CURRENCY` | `IDR` | Currency code used by `Intl.NumberFormat` |
| `CATEGORIES` | Food, Transport, Fun with hex colors | Allowed categories and their chart colors |

## Validation Rules

| Field | Rule | Error message |
| --- | --- | --- |
| Item name | Not empty after trimming | "Enter an item name." |
| Amount | Not empty | "Enter an amount." |
| Amount | Finite number greater than 0 | "Amount must be a number greater than 0." |
| Category | One of the three options selected | "Choose a category." |

If any rule fails, the transaction is not added and all failing fields show their message at the same time. Messages clear when the user edits the field.

## Visual Design

- **Typography:** Sora for the balance and panel headings, DM Sans for body text. Both have system font fallbacks.
- **Hierarchy:** The balance is the largest element on the page, on a dark band at the top. Panels below are white on a light grey-green background.
- **Colors:** ink `#16302a`, background `#eef2f0`, border `#d6dfdb`, danger `#b3382c`. Category colors: Food `#e0a030`, Transport `#2f7a9a`, Fun `#c45a7a`. The same colors are used for the dot in each list item and for the chart slices.
- **Accessibility:** Visible focus outline on all controls, labels tied to inputs, `role="alert"` on error messages, `aria-live` on the balance, and an `aria-label` on each delete button that includes the item name.

## Error Handling

| Situation | Behavior |
| --- | --- |
| Invalid form input | Inline messages, nothing is added |
| Local Storage empty, corrupted, or blocked | App starts with an empty list and keeps working in memory |
| Local Storage write fails (full or blocked) | The error is ignored; data stays in memory for the session |
| Chart.js fails to load | The chart area shows a message to check the connection; the form, list, and balance still work |
| No transactions | Empty-state messages replace the list and the chart |

## Performance

- No framework and no build step; the page is three small files plus two CDN resources.
- The list is rebuilt with DOM APIs on each change, which is fast for the expected number of items.
- The chart instance is created once and updated afterwards with `chart.update()`.
- User-entered text is inserted with `textContent`, never `innerHTML`, so item names cannot inject markup.

## Browser Compatibility

Uses only features available in current Chrome, Firefox, Edge, and Safari: Local Storage, `Intl.NumberFormat`, CSS Grid, CSS custom properties, and `Element.closest`. The same files can be used as a standalone web page or packaged as a browser extension popup.

## Testing Approach

No automated test setup, as required. Verify manually in the browser:

1. Submit the form with empty fields and with an amount of 0 or a negative number; check the messages.
2. Add transactions in all three categories; check the list, balance, and chart.
3. Delete items; check that the balance and chart update, and that the empty states appear when the list is empty.
4. Reload the page; check that the data is restored.
5. Resize the window to phone width; check that the layout stays in one column and nothing overflows.
