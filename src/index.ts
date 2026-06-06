import path from 'path';

import type { Plugin, ResolvedConfig } from 'vite';
export type { TOptions as VitePluginBoilerplateOptions } from './types';
import type { TOptions } from './types';

import { buildExtPattern, resolvePages, shouldSkip, writeBoilerplate } from './helpers';
import { readGitignorePatterns } from './utils';

export const boilerplate = (options: TOptions): Plugin => {
    const { watchDir, pages, extensions = ['.tsx', '.jsx'], ignore = [] } = options;

    const extPattern = buildExtPattern(extensions);
    const resolvedPages = resolvePages(watchDir, pages);

    let gitignorePatterns: string[] = [];
    let root = '';

    return {
        name: 'vite-plugin-boilerplate',
        configResolved(config: ResolvedConfig) {
            root = config.root;
            gitignorePatterns = readGitignorePatterns(config.root);
        },
        configureServer(server) {
            server.watcher.on('add', (filePath: string) => {
                if (shouldSkip(filePath, extPattern, watchDir, gitignorePatterns, ignore)) return;
                const relPath = path.relative(root, filePath).replace(/\\/g, '/');
                writeBoilerplate(filePath, relPath, resolvedPages);
            });
        },
    };
};
