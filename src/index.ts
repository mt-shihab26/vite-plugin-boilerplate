import fs from 'fs';

import type { Plugin } from 'vite';

export type { VitePluginBoilerplateOptions } from './types';

import type { VitePluginBoilerplateOptions } from './types';
import {
    componentTemplate,
    defaultComponentName,
    defaultPages,
    defaultWatchDir,
    pageTemplate,
} from './defaults';
import { isIgnored, matchesPaths } from './utils';

export const viteBoilerplate = (options: VitePluginBoilerplateOptions = {}): Plugin => {
    const {
        watchDir = defaultWatchDir,
        pages = defaultPages,
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
                    const template = matchesPaths(filePath, pages)
                        ? pageTemplate(name)
                        : componentTemplate(name);

                    fs.writeFileSync(filePath, template, 'utf-8');
                } catch {
                    // file may not be accessible yet — ignore
                }
            });
        },
    };
};
