import js from '@eslint/js';
import hooks from 'eslint-plugin-react-hooks';
export default [
  {
    ignores: [
      'dist/**',
      'storybook-static/**',
      'public/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        crypto: 'readonly',
        AbortController: 'readonly',
        URLSearchParams: 'readonly',
        URL: 'readonly',
        structuredClone: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        process: 'readonly',
      },
    },
    plugins: { 'react-hooks': hooks },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z]', argsIgnorePattern: '^_' },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
