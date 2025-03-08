import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintIgnores from './eslint.ignores.js';

export default [
  eslintIgnores,
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser }
    },
    rules: {
      'prettier/prettier': 'error'
    }
  }
];
