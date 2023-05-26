import { FirstImportantPaintOptions } from "./types";

type Options = {
  markName: string;
  selector: string;
  timeout: number;
};

const DEFAULT_OPTIONS: Options = {
  markName: "first-important-paint",
  timeout: 60000,
  selector: "[important]",
};

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

const measure = (options: Options) => () => {
  const { markName, selector, timeout } = options;

  // iterate through all elements matching the selector
  document.querySelectorAll(selector).forEach((n) => {
    // if the user hasn't interacted with the page
    if (!hasUserInteractedWithPage) {
      // if we haven't already measured FIP
      if (!element && element !== n) {
        // if the element is an image, wait until it has has completely loaded
        if (n.tagName !== "IMG" || (n as HTMLImageElement).complete) {
          // set the element to the current element
          element = n;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // queue a high priority task using onmessage
              const messageChannel = new MessageChannel();
              messageChannel.port1.onmessage = () => {
                // create a new performance.mark entry
                performance.mark(markName, {
                  detail: {
                    nodeName: n.nodeName,
                    src:
                      n.nodeName === "IMG" ? (n as HTMLImageElement).src : "",
                    id: n.id,
                  },
                });
              };
              // Queue the Task on the Task Queue
              messageChannel.port2.postMessage(undefined);
            });
          });
        }
      }
    }
  });

  // stop searching after TIMEOUT or user has interacted with page or element has been found
  if (performance.now() > timeout || hasUserInteractedWithPage || element) {
    cancelAnimationFrame(handle);
  } else {
    handle = requestAnimationFrame(measure(options));
  }
};

// start measuring on the next frame
export function start(options: FirstImportantPaintOptions = {}) {
  const opts = Object.assign(DEFAULT_OPTIONS, options);
  handle = requestAnimationFrame(measure(opts));
}
