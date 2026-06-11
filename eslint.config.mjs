import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: ['**/*.ts', '**/*.tsx', 'node_modules/**', '.next/**', 'styled-system/**'],
  },
];
