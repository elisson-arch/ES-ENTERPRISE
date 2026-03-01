import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()] as any,
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
            '@domains': path.resolve(__dirname, './domains'),
            '@shared': path.resolve(__dirname, './domains/shared'),
            '@auth': path.resolve(__dirname, './domains/auth'),
            '@google-workspace': path.resolve(__dirname, './domains/google-workspace'),
            '@whatsapp': path.resolve(__dirname, './domains/whatsapp'),
            '@clients': path.resolve(__dirname, './domains/clients'),
            '@inventory': path.resolve(__dirname, './domains/inventory'),
            '@ai': path.resolve(__dirname, './domains/ai'),
            '@site-builder': path.resolve(__dirname, './domains/site-builder'),
            '@reports': path.resolve(__dirname, './domains/reports'),
            '@infra': path.resolve(__dirname, './infra'),
        },
    },
});

