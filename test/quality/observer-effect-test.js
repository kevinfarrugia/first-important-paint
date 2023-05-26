const { browserSupportsEntry } = require("../utils/browserSupportsEntry.js");
const { imagesPainted } = require("../utils/imagesPainted.js");

describe("FirstImportantPaint", async function () {
  let isPerformanceMarkSupportedOnBrowser;
  let isLCPSupportedOnBrowser;
  let isElementTimingSupportedOnBrowser;

  before(async function () {
    isPerformanceMarkSupportedOnBrowser = await browserSupportsEntry("mark");
    isLCPSupportedOnBrowser = await browserSupportsEntry(
      "largest-contentful-paint"
    );
    isElementTimingSupportedOnBrowser = await browserSupportsEntry("element");
  });

  beforeEach(async function () {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1034080
    await browser.url("about:blank");
  });

  it("compare LCP without first-important-paint scripts", async function () {
    if (
      !(
        isPerformanceMarkSupportedOnBrowser &&
        isElementTimingSupportedOnBrowser &&
        isLCPSupportedOnBrowser
      )
    ) {
      this.skip();
    }

    await browser.url(`/test/sample-e?category=!A`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();
  });

  it("compare LCP without first-important-paint scripts for client-side rendered content", async function () {
    if (
      !(
        isPerformanceMarkSupportedOnBrowser &&
        isElementTimingSupportedOnBrowser &&
        isLCPSupportedOnBrowser
      )
    ) {
      this.skip();
    }

    await browser.url(`/test/sample-f?category=!C`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();
  });
});
