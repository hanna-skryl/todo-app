import tseslint from 'typescript-eslint';
import angular from '@code-pushup/eslint-config/angular';
import jest from '@code-pushup/eslint-config/jest';

export default tseslint.config(
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
  },
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.base.json', 'node_modules/rxjs/tsconfig.json'],
        },
      },
    },
  },
  {
    files: ['*.html'],
    parser: '@angular-eslint/template-parser',
    plugins: ['@angular-eslint/template'],
    rules: {
      '@angular-eslint/template/click-events-have-key-events': 'off',
    },
  },
  {
    ignores: [
      '.angular/**',
      'dist/**',
      '**/*.md',
      '**/*.scss',
      '**/assets/**',
      '**/*.yml',
    ],
  },
);
