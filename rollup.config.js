import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";

const sharedPlugins = [typescript(), resolve({ browser: true }), commonjs()];

export default [
  // General multi-input config (without inlineDynamicImports)
  {
    input: {
      background: "./src/background.ts",
      popup: "./src/popup.ts",
      mcmasterScript: "./src/scripts/mcmasterScript.ts",
      utils: "./src/utils/getActiveTabURL.ts", // change to ./src/utils/**/*.ts with rollup multi plugin
    },
    output: {
      dir: "distribution/assets",
      format: "esm",
    },
    plugins: [
      ...sharedPlugins,
      copy({
        targets: [
          { src: "./src/manifest.json", dest: "distribution" },
          { src: "./src/*.+(html|png)", dest: "distribution/assets" },
          { src: "./src/images/*.+(html|png)", dest: "distribution/assets" },
        ],
      }),
    ],
  },

  // Separate mscScript bundle with inlineDynamicImports
  {
    input: "./src/scripts/mscScript.ts",
    output: {
      file: "distribution/assets/mscScript.js",
      format: "esm",
      inlineDynamicImports: true,
    },
    plugins: sharedPlugins,
  },
];
