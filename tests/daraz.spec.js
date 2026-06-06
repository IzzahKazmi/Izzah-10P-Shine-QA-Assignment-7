// tests/daraz.spec.js
const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const ProductPage = require('../pages/ProductPage');

test.describe('Daraz.pk Automation — All Tasks', () => {

  test('Task 2 & 3: Navigate to Daraz and search for electronics', async ({ page }) => {
    const home = new HomePage(page);

    await home.navigate();                         // Task 2
    await expect(page).toHaveURL(/daraz\.pk/);
    console.log('✅ Task 2: Navigated to Daraz.pk');

    await home.search('electronics');              // Task 3
    await expect(page).toHaveURL(/q=electronics/);
    console.log('✅ Task 3: Searched for electronics');
  });

  test('Task 4: Apply brand filter', async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.navigate();
    await home.search('electronics');

    // Try filtering by a common brand on Daraz — adjust if needed
    await results.applyBrandFilter('Samsung');
    const count = await results.getProductCount();
    expect(count).toBeGreaterThan(0);
    console.log(`✅ Task 4: Brand filter applied — ${count} products found`);
  });

  test('Task 5: Apply price filter 500–5000', async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.navigate();
    await home.search('electronics');
    await results.applyPriceFilter(500, 5000);

    const count = await results.getProductCount();
    expect(count).toBeGreaterThan(0);
    console.log(`✅ Task 5: Price filter applied (500–5000) — ${count} products found`);
  });

  test('Task 6: Count products and validate > 0', async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.navigate();
    await home.search('electronics');

    const count = await results.getProductCount();
    console.log(`Product count: ${count}`);
    expect(count).toBeGreaterThan(0);    // core assertion
    console.log(`✅ Task 6: Product count validated — ${count} products`);
  });

  test('Task 7 & 8: Open product details and check free shipping', async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.navigate();
    await home.search('electronics');

    // openFirstProduct now returns the same page
    const productPage = await results.openFirstProduct();   // Task 7

    const pdp = new ProductPage(productPage);

    const title = await pdp.getTitle();
    console.log('Product title:', title);
    expect(title).toBeTruthy();
    console.log('✅ Task 7: Product page opened successfully');

    const hasFreeShipping = await pdp.isFreeShippingAvailable();  // Task 8
    console.log(`✅ Task 8: Free shipping available? ${hasFreeShipping}`);
    // Not asserting true/false — just logging, since not every product has it
  });

});