import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    name: "custom-typescript-config",
    files: ["**/*.{ts,js}"],
    ignores: ["eslint.config.mjs"],

    languageOptions: {
      parser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    plugins: {
      "@typescript-eslint": tseslint,
    },

    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/strict-boolean-expressions": "off",
    },
  },
];
