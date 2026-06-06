import fs from 'fs';
import path from 'path';

import type { Plugin, ResolvedConfig } from 'vite';

export type { VitePluginBoilerplateOptions } from './types';

import type { VitePluginBoilerplateOptions } from './types';
import { componentTemplate, defaultComponentName, defaultWatchDir, pageTemplate } from './defaults';
import { isIgnored, matchesPaths, readGitignorePatterns } from './utils';

export const viteBoilerplate = (options: VitePluginBoilerplateOptions = {}): Plugin => {
    const {
        watchDir = defaultWatchDir,
        pages = [],
        extensions = ['.tsx', '.jsx'],
        ignore = [],
    } = options;

    const extPattern = new RegExp(`(${extensions.map((e) => e.replace('.', '\\.')).join('|')})$`);
    const resolvedPages = pages.map((p) => path.join(watchDir, p));

    let gitignorePatterns: string[] = [];

    return {
        name: 'vite-boilerplate',
        configResolved(config: ResolvedConfig) {
            gitignorePatterns = readGitignorePatterns(config.root);
        },
        configureServer(server) {
            server.watcher.on('add', (filePath: string) => {
                if (!extPattern.test(filePath)) return;
                if (!filePath.includes(watchDir)) return;
                if (isIgnored(filePath, gitignorePatterns)) return;
                if (ignore.length > 0 && isIgnored(filePath, ignore)) return;

                try {
                    const stats = fs.statSync(filePath);
                    if (stats.size > 0) return;

                    const name = defaultComponentName(filePath);
                    const template =
                        resolvedPages.length > 0 && matchesPaths(filePath, resolvedPages)
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
