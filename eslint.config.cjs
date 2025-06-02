const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const eslintPluginJest = require('eslint-plugin-jest');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const tseslint = require('typescript-eslint');

module.exports = [
  js.configs.recommended,

  ...tseslint.config(
    {
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          project: './tsconfig.json',
          sourceType: 'module',
          ecmaVersion: 'latest',
        },
      },
    },
    {
      files: ['**/*.ts'],
      languageOptions: {
        parser: tseslint.parser,
      },
      plugins: {
        '@typescript-eslint': tseslint.plugin,
        'simple-import-sort': simpleImportSort,
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',
        'no-console': 'warn',
      },
    },
  ),

  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts', '**/*.test.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
    plugins: {
      jest: eslintPluginJest,
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
    },
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      ...prettier.rules,
    },
  },
];
