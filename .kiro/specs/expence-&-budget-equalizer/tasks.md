# Implementation Plan

- [x] 1. Set up project structure
  - Create `index.html`, `style.css`, and `script.js` in one folder
  - Link the stylesheet, load Chart.js from a CDN (pinned version), and load `script.js` at the end of `<body>`
  - _Requirements: TC-1, TC-3, NFR-1_

- [x] 2. Build the page markup
  - [x] 2.1 Add the header with the Total Balance display
    - _Requirements: 3.1_
  - [x] 2.2 Add the input form with Item Name, Amount, and Category (Food, Transport, Fun)
    - Add an error element under each field
    - _Requirements: 1.1, 1.2_
  - [x] 2.3 Add the chart panel with a canvas and an empty-state message
    - _Requirements: 4.1, 4.5_
  - [x] 2.4 Add the transaction list panel with an empty-state message
    - _Requirements: 2.1, 2.5_

- [x] 3. Style the interface
  - [x] 3.1 Define colors, typography, and spacing with CSS variables
    - _Requirements: NFR-3_
  - [x] 3.2 Style the balance header, panels, form controls, and buttons
    - Add a visible focus outline for keyboard users
    - _Requirements: NFR-1, NFR-3_
  - [x] 3.3 Make the transaction list scrollable with a fixed maximum height
    - _Requirements: 2.1_
  - [x] 3.4 Add the responsive layout
    - One column on mobile, two columns from 760px, list spanning full width
    - _Requirements: NFR-2, NFR-3, TC-3_

- [x] 4. Implement data storage
  - [x] 4.1 Write `load()` to read and validate transactions from Local Storage
    - Return an empty list if data is missing, invalid, or storage is blocked
    - _Requirements: 5.2, 5.3_
  - [x] 4.2 Write `save()` to store the transactions array as JSON
    - Wrap in try/catch so the app keeps working if storage fails
    - _Requirements: 5.1, 5.4, TC-2_

- [x] 5. Implement form validation
  - [x] 5.1 Write `validate()` to check name, amount, and category
    - Amount must be a number greater than 0
    - _Requirements: 1.5, 1.6_
  - [x] 5.2 Show inline error messages and a red border on invalid fields
    - Clear a field's error when the user edits it
    - _Requirements: 1.5, 1.6_

- [x] 6. Implement adding transactions
  - Handle form submit: validate, create a transaction with a unique id, save, and re-render
  - Reset the form and move focus back to the name field after adding
  - _Requirements: 1.3, 1.4_

- [x] 7. Implement the transaction list
  - [x] 7.1 Write `renderList()` to show name, amount, and category for each item (newest first)
    - Use `textContent` for user input to avoid markup injection
    - _Requirements: 2.1, 2.2_
  - [x] 7.2 Add a delete button to each item
    - Handle clicks with event delegation, remove by id, save, and re-render
    - _Requirements: 2.3, 2.4_
  - [x] 7.3 Show the empty-state message when there are no transactions
    - _Requirements: 2.5_

- [x] 8. Implement the total balance
  - Write `renderBalance()` to sum all amounts and format them as currency
  - Show zero when the list is empty
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 9. Implement the pie chart
  - [x] 9.1 Write `totalsByCategory()` to sum amounts per category
    - _Requirements: 4.1_
  - [x] 9.2 Write `renderChart()` to create the Chart.js pie chart once and update it afterwards
    - Use the same category colors as the list, and show amount and percentage in tooltips
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 9.3 Show an empty-state message when there is no data, and a fallback message if Chart.js fails to load
    - _Requirements: 4.5_

- [x] 10. Connect everything and load saved data on startup
  - Write `render()` to call the balance, list, and chart renderers
  - Call `render()` once on page load so saved data appears after a refresh
  - _Requirements: 5.2, NFR-2_

- [ ] 11. Check the app manually in the browser
  - Open `index.html` and test: invalid input, adding items in all categories, deleting items, reloading the page, and a narrow phone-width window
  - Try it in at least two browsers (for example Chrome and Firefox)
  - _Requirements: TC-3, NFR-1, NFR-2_

- [ ] 12. Publish the project
  - Commit the files with Git and push to a GitHub repository
  - Optionally enable GitHub Pages to get a public link
  - _Requirements: NFR-1_
