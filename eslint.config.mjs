// eslint.config.mjs — ES-ENTERPRISE Domain Isolation Rules
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
    // ── Global ignores ────────────────────────────────────────────────────────
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'infra/**',
            '.claude/**',
        ],
    },

    // ── Base JS + TS recommended ──────────────────────────────────────────────
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // ── Domain Isolation (TS/TSX files only) ──────────────────────────────────
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: { import: importPlugin },
        rules: {
            'import/no-restricted-paths': [
                'error',
                {
                    zones: [
                        // Shared Kernel: zero deps on other domains
                        { target: './domains/shared', from: './domains/auth', message: '[@shared] Cannot import from @auth.' },
                        { target: './domains/shared', from: './domains/google-workspace', message: '[@shared] Cannot import from @google-workspace.' },
                        { target: './domains/shared', from: './domains/whatsapp', message: '[@shared] Cannot import from @whatsapp.' },
                        { target: './domains/shared', from: './domains/clients', message: '[@shared] Cannot import from @clients.' },
                        { target: './domains/shared', from: './domains/inventory', message: '[@shared] Cannot import from @inventory.' },
                        { target: './domains/shared', from: './domains/ai', message: '[@shared] Cannot import from @ai.' },
                        { target: './domains/shared', from: './domains/site-builder', message: '[@shared] Cannot import from @site-builder.' },
                        { target: './domains/shared', from: './domains/reports', message: '[@shared] Cannot import from @reports.' },
                        // Cross-domain imports forbidden
                        { target: './domains/whatsapp', from: './domains/auth', message: 'Cross-domain import forbidden: use @shared.' },
                        { target: './domains/whatsapp', from: './domains/google-workspace', message: 'Cross-domain import forbidden.' },
                        { target: './domains/whatsapp', from: './domains/clients', message: 'Cross-domain import forbidden.' },
                        { target: './domains/whatsapp', from: './domains/ai', message: 'Cross-domain import forbidden.' },
                        { target: './domains/google-workspace', from: './domains/whatsapp', message: 'Cross-domain import forbidden.' },
                        { target: './domains/google-workspace', from: './domains/ai', message: 'Cross-domain import forbidden.' },
                        { target: './domains/ai', from: './domains/whatsapp', message: 'Cross-domain import forbidden.' },
                        { target: './domains/ai', from: './domains/clients', message: 'Cross-domain import forbidden.' },
                        { target: './domains/clients', from: './domains/whatsapp', message: 'Cross-domain import forbidden.' },
                        { target: './domains/clients', from: './domains/inventory', message: 'Cross-domain import forbidden.' },
                        { target: './domains/inventory', from: './domains/clients', message: 'Cross-domain import forbidden.' },
                        { target: './domains/reports', from: './domains/whatsapp', message: 'Cross-domain import forbidden.' },
                    ],
                },
            ],
        },
    },

    // ── Node.js env for API and CLI scripts ───────────────────────────────────
    {
        files: ['apps/api/**/*.ts', 'scripts/**/*.ts', 'scripts/**/*.js'],
        languageOptions: {
            globals: {
                process: 'readonly',
                console: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
            },
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            'no-undef': 'off',
        },
    },

    // ── Relax strict rules (large codebase, migration in progress) ────────────
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-empty-object-type': 'warn',
            '@typescript-eslint/no-unsafe-function-type': 'warn',
            'no-empty': ['warn', { allowEmptyCatch: true }],
        },
    },
);
