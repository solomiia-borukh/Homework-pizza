import js from '@eslint/js'
import pluginNext from '@next/eslint-plugin-next'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import importsSortPlugin from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      'unused-imports': unusedImports,
      'simple-import-sort': importsSortPlugin,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
      'no-console': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'newline-after-var': 'error',
      'newline-before-return': 'error',
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          tabWidth: 2,
        },
      ],
    },
  },
  {
    files: ['src/pkg/db/seed.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
