import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                app: resolve(__dirname, 'app.html'),
                'pages/pricing': resolve(__dirname, 'pages/pricing.html'),
                'pages/account': resolve(__dirname, 'pages/account.html'),
                'pages/terms-of-service': resolve(__dirname, 'pages/terms-of-service.html'),
                'pages/privacy-policy': resolve(__dirname, 'pages/privacy-policy.html'),
                'pages/refund-policy': resolve(__dirname, 'pages/refund-policy.html'),
            },
        },
    },
});
