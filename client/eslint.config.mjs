import tseslint from 'typescript-eslint';
import angular from '@code-pushup/eslint-config/angular';
import jest from '@code-pushup/eslint-config/jest';

export default tseslint.config(
  {
    ignores: ['.angular/**', 'dist/**', '**/assets/**'],
  },
  ...angular,
  ...jest,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.json'],
        },
      },
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'property',
          format: ['camelCase'],
          filter: { regex: '^_id$', match: false },
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
      ],
    },
  },
  {
    files: ['**/*.store.ts'],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      'max-lines-per-function': 'off',
    },
  },
  {
    files: ['eslint.config.mjs'],
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
);
