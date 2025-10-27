import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jestPlugin from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends(
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:jest/recommended',
        'plugin:jest/style',
    ),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
            'jest': jestPlugin,
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
            },
            parser: tsParser,
            parserOptions: {
                project: [
                    './tsconfig.eslint.json',
                    './tsconfig.json',
                ],
                tsconfigRootDir: __dirname
            },
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
        },
    },
    prettier
];
