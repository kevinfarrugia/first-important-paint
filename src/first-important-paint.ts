const MEASURE_NAME = "first-critical-paint";
const MAX_TIMEOUT = 60000;
const template = "[critical]";

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

const measure = () => {
  document.querySelectorAll(template).forEach((n) => {
    // if we haven't already measured the element
    if (!element && element !== n) {
      // if the element is an image, wait until it has has completely loaded
      if (n.tagName !== "IMG" || (n as HTMLImageElement).complete) {
        element = n;

        // create a new performance.mark entry
        if (performance.mark) {
          performance.mark(MEASURE_NAME, {
            detail: { element: (element.cloneNode() as Element).outerHTML },
          });
        }
      }
    }
  });

  // stop searching after MAX_TIMEOUT
  if (performance.now() > MAX_TIMEOUT || hasUserInteractedWithPage || element) {
    cancelAnimationFrame(handle);
  } else {
    handle = requestAnimationFrame(measure);
  }
};

export const profileFirstCriticalPaint = () => {
  handle = requestAnimationFrame(measure);
};
