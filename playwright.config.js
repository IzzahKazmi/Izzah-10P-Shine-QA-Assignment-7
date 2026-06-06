// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,         // 2 minutes per test (Daraz is slow)
  expect: {
    timeout: 15000,
  },
  use: {
    headless: false,
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
    slowMo: 300,
    ignoreHTTPSErrors: true,
  },
  workers: 1,              // run tests one at a time
});