import { FirstImportantPaintOptions, onMeasure } from "./types";

const MARK_NAME = "first-important-paint";
const TIMEOUT = 60000;
const SELECTOR = "[important]";

let handle: number;
let element: Element | null;
let hasUserInteractedWithPage = false;

// stop measuring if the user has interacted with the page
const events = ["mousedown", "keypress", "scroll", "touchstart"];

const handleUserInteraction = () => {
  events.forEach((n) => {
    document.removeEventListener(n, handleUserInteraction);
  });
  hasUserInteractedWithPage = true;
};

events.forEach((n) => {
  document.addEventListener(n, handleUserInteraction, {
    passive: true,
    once: true,
  });
});

const measure =
  (cb: onMeasure, opts: FirstImportantPaintOptions = {}) =>
  () => {
    const {
      selector = SELECTOR,
      markName = MARK_NAME,
      timeout = TIMEOUT,
    } = opts;

    document.querySelectorAll(selector).forEach((n) => {
      // if we haven't already measured the element
      if (!element && element !== n && !hasUserInteractedWithPage) {
        // if the element is an image, wait until it has has completely loaded
        if (n.tagName !== "IMG" || (n as HTMLImageElement).complete) {
          element = n;

          // create a new performance.mark entry
          if (performance.mark) {
            performance.mark(markName, {
              detail: { element: (element.cloneNode() as Element).outerHTML },
            });

            const [entry] = performance.getEntriesByName(markName);

            cb(entry);
          }
        }
      }
    });

    // stop searching after TIMEOUT
    if (performance.now() > timeout || hasUserInteractedWithPage || element) {
      cancelAnimationFrame(handle);
    } else {
      handle = requestAnimationFrame(measure(cb, opts));
    }
  };

export const getFirstImportantPaint = (
  cb: onMeasure,
  opts: FirstImportantPaintOptions
) => {
  handle = requestAnimationFrame(measure(cb, opts));
};
