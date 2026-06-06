import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { boilerplate } from 'vite-plugin-boilerplate';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), viteBoilerplate({ watchDir: 'src' })],
});
