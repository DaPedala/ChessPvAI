// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        allowedHosts: ['discrepant-unbendingly-killian.ngrok-free.dev']
    }
});