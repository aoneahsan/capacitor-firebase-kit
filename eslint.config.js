import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/.git/**',
      '**/coverage/**',
      '**/*.min.js',
      '**/android/**',
      '**/ios/**',
      '**/.idea/**',
      '**/.vscode/**',
      '**/scripts/**',
      '**/bin/**'
    ]
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'readonly',
        module: 'readonly',
        require: 'readonly',
        global: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': false,
        'ts-nocheck': false,
        'ts-check': false
      }],
      
      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'warn',
      
      // Code quality
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-useless-call': 'error',
      'no-useless-return': 'error',
      'prefer-promise-reject-errors': 'error',
      
      // Stylistic rules (keeping minimal for flexibility)
      'comma-dangle': ['error', 'always-multiline'],
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'semi': ['error', 'always'],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'no-trailing-spaces': 'error'
    }
  }
];