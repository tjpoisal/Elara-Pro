import js from "@eslint/js";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "**/*.d.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    rules: {
      ...js.configs.recommended.rules,
      "no-undef": "off",
      "no-unused-vars": "warn",
    },
  },
];
