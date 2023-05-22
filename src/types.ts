export type FirstImportantPaintOptions = {
  /** The name to be used when creating the performance.mark (Default: `first-important-paint`) */
  markName?: string;

  /** The CSS selector to identify important elements. (Default: `[important]`) */
  selector?: string;

  /** The maximum time, in milliseconds, to search for the element. (Default: `60000`) */
  timeout?: number;
};
