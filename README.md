# first-important-paint

First Important Paint (FIP) measure the time taken to paint the first important element to screen.

## Installation:

```sh
npm -i -s first-important-paint
```

## Usage

**main.js**

```
import { getFirstImportantPaint } from 'first-important-paint';

getFirstImportantPaint((fip) => {
  // Log for easier manual testing.
  console.log(fip);

  // Sending the metric to an analytics endpoint.
  navigator.sendBeacon(`/collect`, JSON.stringify(fip));
});
```

**index.html**

```
  <div important>
    <ul>
      <li>Item #1</li>
      <li>Item #2</li>
    </ul>
  </div>
```

## Accuracy

// TODO: Data is currently being collected

## FAQ

### How does this vary from `largest-contenful-paint`?

[Largest Contentful Paint](https://web.dev/lcp/) (LCP) works on `<img>`, `<image>`, `<video>`, CSS's `background-image` and text elements, such as `<p>` or `<h1>`. However if your most important element is neither of these, for example a list of data; then the LCP metric is not as relevant. First Important Paint aims to solve that limitation that by allowing you to measure the timing for any element. It can be used together with LCP. There is also the [Element Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Element_timing_API) which may be used to measuring the timing, but is limited to Chromium-based browsers.

### Can I use it with ReactJS?

Yes, it is supported on any JavaScript framework, including ReactJS.

### Is there a performance overhead by using FIP?

FIP was developed with minimal overhead. It makes use of `requestAnimationFrame`, does not block the main thread and is less than 1KB minified.

### Which browsers are supported?

Supported on all major browsers, including Chrome, Firefox and Safari. [CanIUse data](https://caniuse.com/?search=user-timing).

## Contributing

Anyone and everyone is welcome to contribute to this project and leave feedback. Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md).

## License and Copyright

This software is released under the terms of the [MIT license](https://github.com/kevinfarrugia/first-important-paint/blob/main/LICENSE).
