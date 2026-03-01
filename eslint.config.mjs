// eslint.config.mjs — ES-ENTERPRISE Domain Isolation Rules
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: { import: importPlugin },
        rules: {
            // ─── Domain Isolation ────────────────────────────────────────────────
            // shared/ cannot import FROM other domains (it's the Shared Kernel)
            'import/no-restricted-paths': [
                'error',
                {
                    zones: [
                        // shared Kernel: CANNOT import from other domains
                        {
                            target: './domains/shared',
                            from: './domains/auth',
                            message: '[@shared] Cannot import from @auth. Shared Kernel has no dependencies on other domains.',
                        },
                        {
                            target: './domains/shared',
                            from: './domains/google-workspace',
                            message: '[@shared] Cannot import from @google-workspace.',
                        },
                        {
                            target: './domains/shared',
                            from: './domains/whatsapp',
                            message: '[@shared] Cannot import from @whatsapp.',
                        },
                        {
                            target: './domains/shared',
                            from: './domains/clients',
                            message: '[@shared] Cannot import from @clients.',
                        },
                        {
                            target: './domains/shared',
                            from: './domains/inventory',
                            message: '[@shared] Cannot import from @inventory.',
                        },
                        {
                            target: './domains/shared',
                            from: './domains/ai',
                            message: '[@shared] Cannot import from @ai.',
                        },
                        {
                            target: './domains/shared',
                            from: './domains/site-builder',
                            message: '[@shared] Cannot import from @site-builder.',
                        },
                        {
                            target: './domains/shared',
                            from: './domains/reports',
                            message: '[@shared] Cannot import from @reports.',
                        },
                        // Domains CANNOT directly import from each other (must go through shared)
                        { target: './domains/whatsapp', from: './domains/auth', message: 'Cross-domain import forbidden. Use @shared if needed.' },
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
    {
        // Apply only to TypeScript/TSX files
        files: ['**/*.ts', '**/*.tsx'],
        ignores: [
            'node_modules/**',
            'dist/**',
            'infra/**',
        ],
    },
);
