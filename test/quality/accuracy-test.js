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

  it("compare FIP with LCP on image elements", async function () {
    if (
      !(
        isPerformanceMarkSupportedOnBrowser &&
        isElementTimingSupportedOnBrowser &&
        isLCPSupportedOnBrowser
      )
    ) {
      this.skip();
    }

    await browser.url(`/test/sample-a`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();
  });

  it("compare FIP with Element Timing API on text elements", async function () {
    if (
      !(
        isPerformanceMarkSupportedOnBrowser &&
        isElementTimingSupportedOnBrowser &&
        isLCPSupportedOnBrowser
      )
    ) {
      this.skip();
    }

    await browser.url(`/test/sample-b`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();
  });

  it("compare FIP with LCP on image elements for client-side rendered content", async function () {
    if (
      !(
        isPerformanceMarkSupportedOnBrowser &&
        isElementTimingSupportedOnBrowser &&
        isLCPSupportedOnBrowser
      )
    ) {
      this.skip();
    }

    await browser.url(`/test/sample-c`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();
  });

  it("compare FIP with Element Timing API on text elements for client-side rendered content", async function () {
    if (
      !(
        isPerformanceMarkSupportedOnBrowser &&
        isElementTimingSupportedOnBrowser &&
        isLCPSupportedOnBrowser
      )
    ) {
      this.skip();
    }

    await browser.url(`/test/sample-d`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();
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

    await browser.url(`/test/sample-e`);

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

    await browser.url(`/test/sample-f`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();
  });
});
