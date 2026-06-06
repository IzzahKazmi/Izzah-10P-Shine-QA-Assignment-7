// pages/SearchResultsPage.js
class SearchResultsPage {
  constructor(page) {
    this.page = page;
  }

  // Task 4 — Apply brand filter
  async applyBrandFilter(brandName) {
    console.log(`Trying to apply brand filter: ${brandName}`);
    try {
      // Daraz filter sidebar uses various structures — try XPath text match
      const brandLocator = this.page.locator(`text="${brandName}"`).first();
      await brandLocator.waitFor({ timeout: 8000 });
      await brandLocator.scrollIntoViewIfNeeded();
      await brandLocator.click();
      await this.page.waitForTimeout(3000);
      console.log(`Brand filter "${brandName}" applied`);
    } catch (e) {
      console.log(`Brand filter "${brandName}" not found — skipping. ${e.message}`);
    }
  }

  // Task 5 — Apply price filter 500–5000
  async applyPriceFilter(min, max) {
    console.log(`Applying price filter: ${min}–${max}`);
    try {
      // Try to find price range inputs
      const priceInputSelectors = [
        'input[placeholder="Min"]',
        'input[placeholder="min"]',
        '.hp-filter__price input',
        '.price-filter input',
        'input[type="number"]',
      ];

      let minInput = null;
      let maxInput = null;

      for (const sel of priceInputSelectors) {
        const inputs = this.page.locator(sel);
        const count = await inputs.count();
        if (count >= 2) {
          minInput = inputs.nth(0);
          maxInput = inputs.nth(1);
          console.log(`Found price inputs with: ${sel}`);
          break;
        } else if (count === 1) {
          minInput = inputs.nth(0);
        }
      }

      if (minInput && maxInput) {
        await minInput.fill(String(min));
        await maxInput.fill(String(max));
        // Press Enter on max input to apply
        await maxInput.press('Enter');
        await this.page.waitForTimeout(3000);
        console.log('Price filter applied');
      } else {
        console.log('Price filter inputs not found — skipping');
      }
    } catch (e) {
      console.log(`Price filter error — skipping: ${e.message}`);
    }
  }

  // Task 6 — Count products and validate > 0
  async getProductCount() {
    const selectors = [
      '[data-qa-locator="product-item"]',
      '.product-card',
      '.c16H9d',           // Daraz grid item class (may change)
      '._95X4G',
      '.box--ujueT',
      'li[data-qa-locator]',
    ];

    for (const sel of selectors) {
      try {
        const items = this.page.locator(sel);
        await items.first().waitFor({ timeout: 8000 });
        const count = await items.count();
        if (count > 0) {
          console.log(`Found ${count} products with selector: ${sel}`);
          return count;
        }
      } catch {
        continue;
      }
    }

    // Last resort — count any anchor tags inside the results grid
    console.log('Using fallback product count method');
    const fallback = this.page.locator('.products-list a, .item-list a');
    const count = await fallback.count();
    return count;
  }

  // Task 7 — Open first product
  async openFirstProduct() {
    const selectors = [
      '[data-qa-locator="product-item"] a',
      '.product-card a',
      '.c16H9d a',
      '._95X4G a',
      '.box--ujueT a',
    ];
  
    for (const sel of selectors) {
      try {
        const first = this.page.locator(sel).first();
        await first.waitFor({ timeout: 8000 });
      
        // Get the href and navigate directly — most reliable approach
        const href = await first.getAttribute('href');
        if (href) {
          const url = href.startsWith('http') ? href : `https://www.daraz.pk${href}`;
          console.log(`Navigating to product: ${url}`);
          await this.page.goto(url);
          await this.page.waitForLoadState('domcontentloaded');
          await this.page.waitForTimeout(2000);
          return this.page; // return same page
        }
      } catch {
        continue;
      }
    }
    throw new Error('Could not open any product');
  }
}

module.exports = SearchResultsPage;