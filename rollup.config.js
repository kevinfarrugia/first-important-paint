import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";

const configurePlugins = ({ module }) => [
  babel({
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            browsers: ["defaults", "not ie > 0"],
          },
        },
      ],
    ],
  }),
  terser({
    module,
    mangle: true,
    compress: true,
  }),
];

const configs = [
  {
    input: "dist/modules/index.js",
    output: {
      format: "esm",
      file: "./dist/first-important-paint.js",
    },
    plugins: configurePlugins({ module: true, polyfill: false }),
  },
  {
    input: "dist/modules/index.js",
    output: {
      format: "umd",
      file: "./dist/first-important-paint.umd.js",
      name: "firstImportantPaint",
    },
    plugins: configurePlugins({ module: false, polyfill: false }),
  },
  {
    input: "dist/modules/index.js",
    output: {
      format: "iife",
      file: "./dist/first-important-paint.iife.js",
      name: "firstImportantPaint",
    },
    plugins: configurePlugins({ module: false, polyfill: false }),
  },
  {
    input: "dist/modules/index.js",
    output: {
      format: "esm",
      file: "./dist/first-important-paint.index.js",
    },
    plugins: configurePlugins({ module: true, polyfill: true }),
  },
  {
    input: "dist/modules/index.js",
    output: {
      format: "umd",
      file: "./dist/first-important-paint.index.umd.js",
      name: "firstImportantPaint",
      extend: true,
    },
    plugins: configurePlugins({ module: false, polyfill: true }),
  },
  {
    input: "dist/modules/index.js",
    output: {
      format: "iife",
      file: "./dist/first-important-paint.index.iife.js",
      name: "firstImportantPaint",
      extend: true,
    },
    plugins: configurePlugins({ module: false, polyfill: true }),
  },
];

export default configs;
