import globals from 'globals';
import pluginJs from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

export default [
  ...compat.config({
    extends: [
      '@code-pushup/eslint-config/angular',
      '@code-pushup/eslint-config/jest',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: ['tsconfig.json'],
    },
    overrides: [
      {
        files: '*.html',
        parser: '@angular-eslint/template-parser',
        plugins: ['@angular-eslint/template'],
        rules: {
          '@angular-eslint/template/click-events-have-key-events': 'off',
        },
      },
    ],
  }),
  { files: ['*.ts'] },
  { ignores: ['node_modules', '.angular', '.vscode'] },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    settings: {
      'import/parsers': {
        espree: ['.js', '.cjs', '.mjs', '.jsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.json', 'node_modules/rxjs/tsconfig.json'],
        },
      },
    },
  },
];
