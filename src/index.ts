import fs from 'fs';

import type { Plugin } from 'vite';

export type { VitePluginBoilerplateOptions } from './types';

import type { VitePluginBoilerplateOptions } from './types';
import {
    componentTemplate,
    defaultComponentName,
    defaultComponents,
    defaultPages,
    defaultWatchDir,
    pageTemplate,
} from './defaults';
import { isIgnored, matchesPaths } from './utils';

export const viteBoilerplate = (options: VitePluginBoilerplateOptions = {}): Plugin => {
    const {
        watchDir = defaultWatchDir,
        pages = defaultPages,
        components = defaultComponents,
        extensions = ['.tsx', '.jsx'],
        ignore = [],
    } = options;

    const extPattern = new RegExp(`(${extensions.map((e) => e.replace('.', '\\.')).join('|')})$`);

    return {
        name: 'vite-boilerplate',
        configureServer(server) {
            server.watcher.on('add', (filePath: string) => {
                if (!extPattern.test(filePath)) return;
                if (!filePath.includes(watchDir)) return;
                if (ignore.length > 0 && isIgnored(filePath, ignore)) return;

                try {
                    const stats = fs.statSync(filePath);
                    if (stats.size > 0) return;

                    const name = defaultComponentName(filePath);

                    if (matchesPaths(filePath, pages)) {
                        fs.writeFileSync(filePath, pageTemplate(name), 'utf-8');
                    } else if (matchesPaths(filePath, components)) {
                        fs.writeFileSync(filePath, componentTemplate(name), 'utf-8');
                    }
                } catch {
                    // file may not be accessible yet — ignore
                }
            });
        },
    };
};
