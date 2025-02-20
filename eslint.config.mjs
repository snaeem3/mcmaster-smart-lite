import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,tsx}"] }, // Include TypeScript and JSX files
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended, // ESLint recommended rules
  ...tseslint.configs.recommended, // TypeScript recommended rules
  {
    // Prettier plugin configuration
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error", // Enforce Prettier formatting
    },
  },
  eslintConfigPrettier, // Disable ESLint rules that conflict with Prettier
];