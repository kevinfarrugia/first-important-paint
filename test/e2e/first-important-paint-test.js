const assert = require("assert");
const {
  clearBeacons,
  getBeacons,
  beaconCountIs,
} = require("../utils/beacons.js");
const { browserSupportsEntry } = require("../utils/browserSupportsEntry.js");
const { imagesPainted } = require("../utils/imagesPainted.js");

const DELAY = 500;

describe("getFirstImportantPaint()", async function () {
  // Retry all tests in this suite up to 2 times.
  this.retries(2);

  let isPerformanceMarkSupportedOnBrowser;
  let isLCPSupportedOnBrowser;

  before(async function () {
    isPerformanceMarkSupportedOnBrowser = await browserSupportsEntry("mark");
    isLCPSupportedOnBrowser = await browserSupportsEntry(
      "largest-contentful-paint"
    );
  });

  beforeEach(async function () {
    await clearBeacons();

    // https://bugs.chromium.org/p/chromium/issues/detail?id=1034080
    await browser.url("about:blank");
  });

  it("reports the correct value when the important element is a block-element", async function () {
    if (!isPerformanceMarkSupportedOnBrowser) this.skip();

    await browser.url(`/test/div?delay=${DELAY}`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();

    await beaconCountIs(1);
    const beacons = await getBeacons();
    assert.strictEqual(beacons.length, 1);

    const [fip] = beacons;

    assert(fip.startTime > DELAY); // Greater than the document load delay.
    assert.strictEqual(fip.name, "first-important-paint");
    assert.strictEqual(fip.entryType, "mark");
  });

  it("reports the correct value when the important element is an image", async function () {
    if (!isPerformanceMarkSupportedOnBrowser) this.skip();

    await browser.url(`/test/image?delay=${DELAY}`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();

    await beaconCountIs(1);
    const beacons = await getBeacons();
    assert.strictEqual(beacons.length, 1);

    const [fip] = beacons;

    assert(fip.startTime > DELAY); // Greater than the document load delay.
    assert.strictEqual(fip.name, "first-important-paint");
    assert.strictEqual(fip.entryType, "mark");
  });

  it("does not report if the user interacts with the page before the important element is rendered", async function () {
    if (!isPerformanceMarkSupportedOnBrowser) this.skip();

    await browser.url(`/test/image?delay=${DELAY}&scroll=true`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();

    // Wait a bit to ensure no beacons were sent.
    await driver.pause(1000);

    const beacons = await getBeacons();
    assert.strictEqual(beacons.length, 0);
  });

  it("does not report if the browser does not support performance.mark", async function () {
    if (isPerformanceMarkSupportedOnBrowser) this.skip();

    await browser.url(`/test/image?delay=${DELAY}`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();

    // Wait a bit to ensure no beacons were sent.
    await browser.pause(1000);

    const beacons = await getBeacons();
    assert.strictEqual(beacons.length, 0);
  });

  it("the margin of error doesn't exceed 50ms when marking the LCP element as important", async function () {
    if (!isPerformanceMarkSupportedOnBrowser || !isLCPSupportedOnBrowser)
      this.skip();

    await browser.url(`/test/lcp?delay=${DELAY}`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();

    await beaconCountIs(2);
    const beacons = await getBeacons();

    const [fip, lcp] = beacons;

    assert(Math.abs(fip.startTime - lcp.startTime) < 50); // Greater than the document load delay.
  });

  it("the margin of error doesn't exceed 50ms when marking the LCP image as important", async function () {
    if (!isPerformanceMarkSupportedOnBrowser || !isLCPSupportedOnBrowser)
      this.skip();

    await browser.url(`/test/lcp-image?delay=${DELAY}`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();

    await beaconCountIs(3);
    const beacons = await getBeacons();

    const [, fip, lcp] = beacons;

    assert(Math.abs(fip.startTime - lcp.startTime) < 50); // Greater than the document load delay.
  });

  it("reports the correct value when multiple elements are marked as important", async function () {
    if (!isPerformanceMarkSupportedOnBrowser) this.skip();

    await browser.url(`/test/multiple?delay=${DELAY}`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();

    await beaconCountIs(1);
    const beacons = await getBeacons();
    assert.strictEqual(beacons.length, 1);

    const [fip] = beacons;

    assert(fip.startTime > DELAY); // Greater than the document load delay.
    assert.strictEqual(fip.name, "first-important-paint");
    assert.strictEqual(fip.entryType, "mark");
  });

  it("reports the correct value when overriding the default values", async function () {
    if (!isPerformanceMarkSupportedOnBrowser) this.skip();

    await browser.url(`/test/override?delay=${DELAY}`);

    // Wait until all images are loaded and fully rendered.
    await imagesPainted();

    await beaconCountIs(1);
    const beacons = await getBeacons();
    assert.strictEqual(beacons.length, 1);

    const [fip] = beacons;

    assert(fip.startTime > DELAY); // Greater than the document load delay.
    assert.strictEqual(fip.name, "first-critical-paint");
    assert.strictEqual(fip.entryType, "mark");
  });
});
