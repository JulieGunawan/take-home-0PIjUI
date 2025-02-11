import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin';
import typescript from '@typescript-eslint/parser';
import pluginVue from 'eslint-plugin-vue';

export default [
  eslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    // TypeScript files configuration
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: typescript,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['node_modules/**','**/dist/**', '**/dist-ssr/**', '**/coverage/**', '.git/**'],
  },

]
