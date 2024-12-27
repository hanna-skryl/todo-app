import jest from '@code-pushup/eslint-config/jest';
import angular from '@code-pushup/eslint-config/angular';

export default tseslint.config(
  ...angular,
  ...jest,
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
    files: '*.html',
    parser: '@angular-eslint/template-parser',
    plugins: ['@angular-eslint/template'],
    rules: {
      '@angular-eslint/template/click-events-have-key-events': 'off',
    },
  },
  {
    ignores: ['/dist', '**/*.md', '**/*.scss', '**/assets', '**/*.yml'],
  },
);
