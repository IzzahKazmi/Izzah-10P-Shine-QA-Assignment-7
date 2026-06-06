// pages/HomePage.js
const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('https://www.daraz.pk/');
    // Wait for the page to be usable
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000); // Daraz is slow to render
  }

  async search(keyword) {
    // Try multiple possible selectors for the search box
    const searchSelectors = [
      'input#q',
      'input[name="q"]',
      'input[placeholder*="Search"]',
      'input[placeholder*="search"]',
      '.search-box input',
      '[data-qa-locator="search-bar"] input',
    ];

    let searchInput = null;
    for (const selector of searchSelectors) {
      try {
        const el = this.page.locator(selector).first();
        await el.waitFor({ timeout: 5000 });
        searchInput = el;
        console.log(`Found search input with selector: ${selector}`);
        break;
      } catch {
        continue;
      }
    }

    if (!searchInput) {
      throw new Error('Could not find search input on Daraz homepage');
    }

    await searchInput.click();
    await searchInput.fill(keyword);

    // Press Enter instead of clicking submit button — more reliable
    await searchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }
}

module.exports = HomePage;