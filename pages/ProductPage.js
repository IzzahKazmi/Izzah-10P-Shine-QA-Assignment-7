// pages/ProductPage.js
class ProductPage {
  constructor(page) {
    this.page = page;
  }

  async getTitle() {
    const selectors = [
      '[data-qa-locator="product-title"]',
      '.pdp-product-title',
      'h1',
      '.title--wrap--UUHae_g h1',
    ];
    for (const sel of selectors) {
      try {
        const el = this.page.locator(sel).first();
        await el.waitFor({ timeout: 5000 });
        return await el.textContent();
      } catch { continue; }
    }
    return 'Title not found';
  }

  async getPrice() {
    const selectors = [
      '[data-qa-locator="product-price"]',
      '.pdp-price',
      '.price--currentPriceText--V8_y_b5',
    ];
    for (const sel of selectors) {
      try {
        const el = this.page.locator(sel).first();
        await el.waitFor({ timeout: 5000 });
        return await el.textContent();
      } catch { continue; }
    }
    return 'Price not found';
  }

  // Task 8 — Check free shipping
  async isFreeShippingAvailable() {
    try {
      // Search page text for "free shipping" (case-insensitive)
      const bodyText = await this.page.locator('body').textContent();
      const hasIt = bodyText.toLowerCase().includes('free shipping');
      return hasIt;
    } catch {
      return false;
    }
  }
}

module.exports = ProductPage;