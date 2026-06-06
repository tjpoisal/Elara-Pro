import js from "@eslint/js";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "**/*.ts",
      "**/*.tsx",
      "**/*.d.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    rules: {
      ...js.configs.recommended.rules,
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
];
