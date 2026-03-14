import { fileURLToPath, URL } from 'node:url'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        files: ['**/*.{js,mjs,cjs,ts,tsx,mts}'],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: rootDir,
            },
        },
    },
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
])

export default eslintConfig
