import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { boilerplate } from '../src/index';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), viteBoilerplate({ watchDir: 'src' })],
});
