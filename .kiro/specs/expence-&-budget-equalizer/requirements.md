# Requirements Document

## Introduction

The Expense & Budget Visualizer is a simple, client-side web app that helps users track spending. Users add transactions (item name, amount, category), see them in a scrollable list, view the total balance at the top, and see a pie chart of spending by category. The app is built with HTML, CSS, and vanilla JavaScript, uses the browser Local Storage API for persistence, and needs no backend server.

## Glossary

- **Expense_Visualizer**: The web application described in this document.
- **Transaction**: A single spending record consisting of an item name, an amount, and a category.
- **Category**: One of the fixed values Food, Transport, or Fun.
- **Total_Balance**: The sum of the amounts of all transactions currently in the list.
- **Transaction_List**: The scrollable list that displays all transactions.
- **Spending_Chart**: The pie chart showing spending distribution by category.
- **Local_Storage**: The browser Local Storage API used to persist data on the client.

## Requirements

### Requirement 1: Input Form

**User Story:** As a user, I want to enter an item name, amount, and category in a form, so that I can record my expenses quickly.

#### Acceptance Criteria

1. THE Expense_Visualizer SHALL display an input form with the fields Item Name, Amount, and Category.
2. THE Expense_Visualizer SHALL provide Category options of Food, Transport, and Fun.
3. WHEN the user submits the form with all fields filled, THE Expense_Visualizer SHALL add a new Transaction to the Transaction_List.
4. WHEN a Transaction is added successfully, THE Expense_Visualizer SHALL clear the form fields so the user can enter the next item.
5. IF the user submits the form with any field empty, THEN THE Expense_Visualizer SHALL block the submission and display a validation message identifying the missing field.
6. IF the Amount is not a number greater than zero, THEN THE Expense_Visualizer SHALL block the submission and display a validation message.

### Requirement 2: Transaction List

**User Story:** As a user, I want to see all my transactions in a list and delete the ones I no longer need, so that my records stay accurate.

#### Acceptance Criteria

1. THE Expense_Visualizer SHALL display all added Transactions in a scrollable Transaction_List.
2. THE Expense_Visualizer SHALL show the item name, amount, and category for each Transaction in the list.
3. THE Expense_Visualizer SHALL provide a delete control for each Transaction.
4. WHEN the user activates the delete control of a Transaction, THE Expense_Visualizer SHALL remove that Transaction from the Transaction_List.
5. WHEN the Transaction_List contains no Transactions, THE Expense_Visualizer SHALL display an empty-state message.

### Requirement 3: Total Balance

**User Story:** As a user, I want to see my total spending at the top of the page, so that I know my overall balance at a glance.

#### Acceptance Criteria

1. THE Expense_Visualizer SHALL display the Total_Balance at the top of the page.
2. WHEN a Transaction is added, THE Expense_Visualizer SHALL update the Total_Balance automatically.
3. WHEN a Transaction is deleted, THE Expense_Visualizer SHALL update the Total_Balance automatically.
4. WHEN the Transaction_List is empty, THE Expense_Visualizer SHALL display a Total_Balance of zero.

### Requirement 4: Visual Chart

**User Story:** As a user, I want a pie chart of my spending by category, so that I can see where my money goes.

#### Acceptance Criteria

1. THE Expense_Visualizer SHALL display a Spending_Chart as a pie chart showing the share of spending per Category.
2. THE Expense_Visualizer SHALL render the Spending_Chart using Chart.js or another simple chart library.
3. WHEN a Transaction is added, THE Expense_Visualizer SHALL update the Spending_Chart automatically.
4. WHEN a Transaction is deleted, THE Expense_Visualizer SHALL update the Spending_Chart automatically.
5. WHEN the Transaction_List is empty, THE Expense_Visualizer SHALL display an empty-state message instead of a chart.

### Requirement 5: Data Persistence

**User Story:** As a user, I want my transactions to be saved in my browser, so that my data is still there after I reload or reopen the page.

#### Acceptance Criteria

1. WHEN a Transaction is added or deleted, THE Expense_Visualizer SHALL save the updated list to Local_Storage.
2. WHEN the page loads, THE Expense_Visualizer SHALL read saved Transactions from Local_Storage and restore the Transaction_List, Total_Balance, and Spending_Chart.
3. IF the data in Local_Storage is missing or invalid, THEN THE Expense_Visualizer SHALL start with an empty Transaction_List without showing an error.
4. THE Expense_Visualizer SHALL store all data client-side only and SHALL NOT send data to any server.

## Technical Constraints

### TC-1: Technology Stack

1. THE Expense_Visualizer SHALL use HTML for structure and CSS for styling.
2. THE Expense_Visualizer SHALL use vanilla JavaScript and SHALL NOT use frameworks such as React or Vue.
3. THE Expense_Visualizer SHALL NOT require a backend server.

### TC-2: Data Storage

1. THE Expense_Visualizer SHALL use the browser Local Storage API for persistence.
2. THE Expense_Visualizer SHALL keep all data on the client only.

### TC-3: Browser Compatibility

1. THE Expense_Visualizer SHALL work in modern versions of Chrome, Firefox, Edge, and Safari.
2. THE Expense_Visualizer SHALL be usable as a standalone web app or as a browser extension.

## Non-Functional Requirements

### NFR-1: Simplicity

1. THE Expense_Visualizer SHALL present a clean, minimal interface that is easy to understand and use.
2. THE Expense_Visualizer SHALL require no complex setup, and SHALL NOT require a test setup.

### NFR-2: Performance

1. THE Expense_Visualizer SHALL load quickly.
2. WHEN the user adds or deletes a Transaction, THE Expense_Visualizer SHALL update the list, balance, and chart without noticeable lag.

### NFR-3: Visual Design

1. THE Expense_Visualizer SHALL use a user-friendly aesthetic with a clear visual hierarchy.
2. THE Expense_Visualizer SHALL use readable typography.