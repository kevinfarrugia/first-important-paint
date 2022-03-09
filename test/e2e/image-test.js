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
  before(async function () {
    isPerformanceMarkSupportedOnBrowser = await browserSupportsEntry("mark");
  });

  beforeEach(async function () {
    await clearBeacons();

    // https://bugs.chromium.org/p/chromium/issues/detail?id=1034080
    await browser.url("about:blank");
  });

  it("reports the correct value", async function () {
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
});
