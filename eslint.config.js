import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: { ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	globalIgnores(['dist', 'pnpm-lock.yaml']),
]);
