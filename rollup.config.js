import copy from "rollup-plugin-copy";

const rollup = {
  input: {
    background: "./src/background.ts",
    popup: "./src/popup.ts",
    content: "./src/scripts/content.ts",
  },
  output: {
    dir: "distribution/assets",
  },
  plugins: [
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
