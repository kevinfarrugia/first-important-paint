# first-important-paint

First Important Paint (FIP) measures the time taken to paint the first important element to screen.

[Largest Contentful Paint](https://web.dev/lcp/) (LCP) measures the time it takes to paint the largest element—`<img>`, `<image>`, `<video>`, CSS's `background-image` and text elements—to screen. However, the largest element is not always the most important one. If the most important element is a `<table>` consisting of multiple smaller elements; then the LCP metric may not be representative of the user experience.

First Important Paint aims to solve that limitation by allowing you to measure the timing for any element using `requestAnimationFrame` and checking when an element is visible on the page. It can be used in combination with LCP and the [Element Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Element_timing_API).

FIP works on all modern browsers, including Safari.

## Installation:

```sh
npm -i -s first-important-paint
```

## Usage

To begin measuring First Important Paint you are required to import the `first-important-paint` as early as possible in your application's JavaScript file.

**main.js**

```js
import {start} from "first-important-paint";
start();
```

You can then mark _important_ elements using the `important` attribute.

**index.html**

```html
<div important>
  <ul>
    <li>Item #1</li>
    <li>Item #2</li>
  </ul>
</div>
```

When the first `important` element is rendered on screen, the browser will create a `performance.mark` entry with the name `first-important-paint`. This is visible on DevTools and can be retrieved later using the `PerformanceObserver`.

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (entry.name === "first-important-paint") {
      console.log(entry);

      const { name, startTime, detail } = entry;
      const { id, nodeName, src } = detail;

      // Test sending the metric to an analytics endpoint.
      navigator.sendBeacon(
        `/collect`,
        JSON.stringify({entryType: "first-important-paint", renderTime: startTime, id, nodeName, url: src})
      );
    }
  }
}).observe({ type: "mark", buffered: true });
```

## Options

You can override the default configurations by passing parameters to the `start` method. Below are the supported options:

| Option     | Type   | Description                                                                               |
| ---------- | ------ | ----------------------------------------------------------------------------------------- |
| `markName` | string | The name to be used when creating the performance.mark (Default: `first-important-paint`) |
| `selector` | string | The CSS selector to use to identify important elements. (Default: `[important]`)          |
| `timeout`  | number | The maximum time, in milliseconds, to search for the element. (Default: `60000`)          |

## Quality

To check the quality of the metric, I ran more than [1000 tests](https://docs.google.com/spreadsheets/d/1s38Dnoqzpq3e0LLUPK-q5HPThxXrJznnQzmsxZ_ePuo/edit?usp=sharing) that measured the FIP, LCP and Element Timing on a page.

The tests indicate that FIP correlates or strongly correlates with LCP and Element Timing. This means that the metric is predictable and reasonably accurate. When tested on a 4G or 3G connection for an image element, the median FIP was within 10ms from the median LCP or Element Timing. On native connections, this increased to 50ms.

Pages that included a text-element FIP experienced increased variance on native connections as the browser would combine several tasks into a single paint. As a result, the FIP reported would be quicker than the time it is painted to screen.

## FAQ

### Can I use it with ReactJS?

Yes, it is supported on any JavaScript framework, including ReactJS.

### Is there a performance overhead when using FIP?

FIP was developed with minimal overhead. It uses `requestAnimationFrame`, does not block the main thread, and is less than 1KB minified. I have run [tests](https://docs.google.com/spreadsheets/d/1s38Dnoqzpq3e0LLUPK-q5HPThxXrJznnQzmsxZ_ePuo/edit?usp=sharing) that confirm it has no impact on user-centric metrics such as LCP.

### Which browsers are supported?

Supported on all major browsers, including Chrome, Firefox and Safari. [CanIUse data](https://caniuse.com/?search=user-timing).

## Contributing

Anyone and everyone is welcome to contribute to this project and leave feedback. Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md).

## License and Copyright

This software is released under the terms of the [MIT license](https://github.com/kevinfarrugia/first-important-paint/blob/main/LICENSE).

- Photo by [Ferenc Horvath](https://unsplash.com/@designhorf?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/9cYiqVDeXDc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText).
- Video by [Michal Marek](https://www.pexels.com/video/waves-rushing-and-splashing-to-the-shore-1409899/)