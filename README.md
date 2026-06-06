# Daraz.pk Functional Test Automation

Automated functional testing of [Daraz.pk](https://www.daraz.pk) using **Playwright** with the **Page Object Model (POM)** design pattern.

---

## Project Overview

This project automates end-to-end functional testing of Daraz.pk. It covers key user journeys including site navigation, product search, filter application, product count validation, and product detail verification.

The test suite is built with **Playwright (JavaScript)** and structured using the **Page Object Model** pattern for clean, maintainable, and reusable test code.

---

## Tasks Covered

| # | Task |
|---|------|
| 1 | Project setup with Playwright |
| 2 | Navigate to Daraz.pk |
| 3 | Search for "electronics" |
| 4 | Apply brand filter (Samsung) |
| 5 | Apply price filter (500–5000 PKR) |
| 6 | Count products in results and validate > 0 |
| 7 | Open product details page |
| 8 | Verify if free shipping is available |

---

## Project Structure

```
daraz-playwright/
│
├── pages/                        # Page Object Model classes
│   ├── HomePage.js               # Daraz homepage — navigation & search
│   ├── SearchResultsPage.js      # Search results — filters & product count
│   └── ProductPage.js            # Product detail page — title, price, shipping
│
├── tests/
│   └── daraz.spec.js             # Main test suite (all 8 tasks)
│
├── playwright.config.js          # Playwright configuration
├── package.json                  # Project dependencies
└── package-lock.json             # Lockfile
```

---

## Design Pattern — Page Object Model (POM)

This project follows the **Page Object Model** design pattern, where each page of the application is represented by its own class. This approach:

- **Separates test logic from page interaction logic** — tests stay clean and readable
- **Reduces code duplication** — selectors and actions are defined once per page
- **Makes maintenance easy** — if Daraz changes its UI, you only update one file

```
Test File (daraz.spec.js)
        │
        ├── uses ──▶ HomePage.js          (navigate, search)
        ├── uses ──▶ SearchResultsPage.js (filters, product count, open product)
        └── uses ──▶ ProductPage.js       (title, price, free shipping check)
```

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | Browser automation framework |
| JavaScript (Node.js) | Programming language |
| `@playwright/test` | Test runner & assertions |
| Chromium | Browser used for testing |
| Page Object Model | Test architecture pattern |

---

## Setup & Installation

### Prerequisites

Install these before proceeding:

- **Node.js** v18 or higher → [Download](https://nodejs.org/)
- **npm** (comes bundled with Node.js)
- A terminal (Command Prompt, PowerShell, or Git Bash on Windows)

Check your versions:

```bash
node -v   # should print v18.x.x or higher
npm -v    # should print 8.x.x or higher
```

### 1. Clone the Repository

```bash
git clone https://github.com/IzzahKazmi/Izzah-10P-Shine-QA-Assignment-7.git
cd Izzah-10P-Shine-QA-Assignment-7
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install chromium
```

---

## Running the Tests

### Run all tests (browser visible)

```bash
npx playwright test --headed
```

### Run all tests (headless — no browser window)

```bash
npx playwright test
```

### Run a specific test by name

```bash
npx playwright test -g "Task 6"
```

### Run with verbose output

```bash
npx playwright test --headed --reporter=list
```

### View the HTML test report after a run

```bash
npx playwright show-report
```

> **Note:** Tests run one at a time (`workers: 1`) to avoid rate-limiting from Daraz. Each test independently navigates to Daraz, so no manual interaction is required — the browser does everything automatically.

---

## Test Breakdown

### `tests/daraz.spec.js`

All 5 test cases are inside a single `describe` block covering all 8 project tasks.

---

#### Test 1 — Navigate & Search *(Tasks 2 & 3)*

```
✅ Task 2: Navigated to Daraz.pk
✅ Task 3: Searched for electronics
```

- Opens `https://www.daraz.pk`
- Locates the search input (`input#q`) using a multi-selector fallback strategy
- Types "electronics" and presses Enter
- Asserts the resulting URL contains the search query

---

#### Test 2 — Brand Filter *(Task 4)*

```
✅ Task 4: Brand filter applied — 40 products found
```

- Navigates to Daraz and searches "electronics"
- Attempts to click the Samsung brand filter in the sidebar
- Gracefully skips if the filter isn't rendered (Daraz's filter sidebar loads conditionally)
- Validates that product count remains > 0 after the filter step

---

#### Test 3 — Price Filter *(Task 5)*

```
✅ Task 5: Price filter applied (500–5000) — 40 products found
```

- Navigates to Daraz and searches "electronics"
- Finds the min/max price inputs using `input[type="number"]`
- Fills in `500` and `5000`, then presses Enter to apply
- Validates products are still returned after filtering

---

#### Test 4 — Product Count *(Task 6)*

```
Product count: 40
✅ Task 6: Product count validated — 40 products
```

- Navigates to Daraz and searches "electronics"
- Counts all elements matching `[data-qa-locator="product-item"]`
- Uses a multi-selector fallback strategy across 6 possible selectors
- Asserts `count > 0`

---

#### Test 5 — Product Details & Shipping *(Tasks 7 & 8)*

```
✅ Task 7: Product page opened successfully
✅ Task 8: Free shipping available? true/false
```

- Navigates to Daraz and searches "electronics"
- Extracts the `href` of the first product card and navigates directly to it
- Asserts the product title is non-empty
- Searches the page body text for "free shipping" (case-insensitive)
- Logs whether free shipping is offered (result varies by product)

---

## Configuration

`playwright.config.js` settings:

| Setting | Value | Reason |
|---------|-------|--------|
| `timeout` | 120,000ms (2 min) | Daraz is slow to load |
| `headless` | `false` | Shows browser window during test run |
| `slowMo` | 300ms | Slows actions so behaviour is visible |
| `workers` | 1 | Runs tests sequentially to avoid issues |
| `screenshot` | `only-on-failure` | Saves screenshots when a test fails |
| `viewport` | 1280×800 | Standard desktop resolution |

To run tests invisibly (faster), change `headless: false` to `headless: true` in `playwright.config.js`.

---

## Selector Strategy

Daraz's frontend uses dynamically generated class names that change frequently. This project handles that with a **fallback selector chain** — each locator tries multiple CSS selectors in order and uses the first one that works:

```js
// Example from SearchResultsPage.js
const selectors = [
  '[data-qa-locator="product-item"]',  // stable data attribute (preferred)
  '.product-card',                      // semantic class
  '.c16H9d',                            // generated class (may change)
  '._95X4G',                            // fallback
];
```

This makes the tests **resilient to minor UI changes** on Daraz's end.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot find module '@playwright/test'` | Run `npm install` |
| `Executable doesn't exist` browser error | Run `npx playwright install chromium` |
| All tests timing out | Daraz may be slow — increase `timeout` in config |
| Brand filter not clicking | Daraz's sidebar renders conditionally; the test gracefully skips this step |
| `input#q` not found | Daraz may have updated their search bar; inspect the element and update the selector in `HomePage.js` |

---
