export type onMeasure = (entry: PerformanceEntry) => void;

export type FirstImportantPaintOptions = {
  /** The name to be used when creating the performance.mark (Default: `first-important-paint`) */
  markName?: string;

  /** The CSS selector to use to identify important elemtns. (Default: `[important]`) */
  selector?: string;

  /** The maximum time, in milliseconds, to search for the element. (Default: `60000`) */
  timeout?: number;
};
