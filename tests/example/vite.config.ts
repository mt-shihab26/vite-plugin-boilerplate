import { defineConfig } from 'vite';
import { boilerplate } from 'vite-plugin-boilerplate';

import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        boilerplate({
            watchDir: 'src',
            pages: 'pages',
        }),
    ],
});
