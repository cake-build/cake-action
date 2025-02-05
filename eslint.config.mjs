import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jestPlugin from 'eslint-plugin-jest';
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

export default [...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:jest/recommended',
    'plugin:jest/style',
), {
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
            project: path.join(__dirname, 'tsconfig.json'),
        },
        ecmaVersion: 'latest',
        sourceType: 'commonjs',
    },

    rules: {
        'brace-style': 'error',
        'arrow-spacing': 'error',
        'eol-last': 'error',
        'keyword-spacing': 'error',
        'no-mixed-spaces-and-tabs': 'error',
        'no-multiple-empty-lines': 'error',
        'no-trailing-spaces': 'error',
        'space-before-blocks': 'error',
        'space-before-function-paren': 'off',
        'space-in-parens': 'error',
        'space-infix-ops': 'error',
        'space-unary-ops': 'error',
        'spaced-comment': 'error',
        semi: 'error',
        quotes: [2, 'single', {
            avoidEscape: true,
        }],
    },
}];
