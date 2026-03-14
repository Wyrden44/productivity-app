import { fileURLToPath } from 'node:url'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier/flat'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig([
    globalIgnores(['**/dist/**', '**/coverage/**']),
    {
        files: ['**/*.{ts,mts,cts}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
                tsconfigRootDir: rootDir,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
        },
    },
    prettier,
])
