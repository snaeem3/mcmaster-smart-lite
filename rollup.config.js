import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";

const rollup = {
  input: {
    background: "./src/background.ts",
    popup: "./src/popup.ts",
    content: "./src/scripts/content.ts",
    utils: "./src/utils/getActiveTabURL.ts", // change to ./src/utils/**/*.ts with rollup multi plugin
  },
  output: {
    dir: "distribution/assets",
  },
  plugins: [
    typescript(),
    resolve({ browser: true }),
    commonjs(),
    copy({
      targets: [
        { src: "./src/manifest.json", dest: "distribution" },
        { src: "./src/*.+(html|png)", dest: "distribution/assets" },
        { src: "./src/images/*.+(html|png)", dest: "distribution/assets" },
      ],
    }),
  ],
};

export default rollup;
