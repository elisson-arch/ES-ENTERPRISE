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
                        { 
                            target: './domains/shared', 
                            from: './domains', 
                            except: ['./domains/shared'], 
                            message: '[@shared] Shared kernel cannot depend on other domains.' 
                        },
                        
                        // Domain Isolation: each domain can only import from itself and @shared
                        { 
                            target: './domains/ai', 
                            from: './domains', 
                            except: ['./domains/ai', './domains/shared'], 
                            message: '[@ai] Cross-domain import forbidden. Use @shared or API.' 
                        },
                        { 
                            target: './domains/auth', 
                            from: './domains', 
                            except: ['./domains/auth', './domains/shared'], 
                            message: '[@auth] Cross-domain import forbidden. Use @shared or API.' 
                        },
                        { 
                            target: './domains/clients', 
                            from: './domains', 
                            except: ['./domains/clients', './domains/shared'], 
                            message: '[@clients] Cross-domain import forbidden. Use @shared or API.' 
                        },
                        { 
                            target: './domains/google-workspace', 
                            from: './domains', 
                            except: ['./domains/google-workspace', './domains/shared'], 
                            message: '[@google-workspace] Cross-domain import forbidden. Use @shared or API.' 
                        },
                        { 
                            target: './domains/inventory', 
                            from: './domains', 
                            except: ['./domains/inventory', './domains/shared'], 
                            message: '[@inventory] Cross-domain import forbidden. Use @shared or API.' 
                        },
                        { 
                            target: './domains/reports', 
                            from: './domains', 
                            except: ['./domains/reports', './domains/shared'], 
                            message: '[@reports] Cross-domain import forbidden. Use @shared or API.' 
                        },
                        { 
                            target: './domains/site-builder', 
                            from: './domains', 
                            except: ['./domains/site-builder', './domains/shared'], 
                            message: '[@site-builder] Cross-domain import forbidden. Use @shared or API.' 
                        },
                        { 
                            target: './domains/whatsapp', 
                            from: './domains', 
                            except: ['./domains/whatsapp', './domains/shared'], 
                            message: '[@whatsapp] Cross-domain import forbidden. Use @shared or API.' 
                        },
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
