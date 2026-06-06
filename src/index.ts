import fs from 'fs';

import type { Plugin } from 'vite';
export type { BoilerplateRule, VitePluginBoilerplateOptions } from './types';
import type { VitePluginBoilerplateOptions } from './types';

import { defaultComponentName, defaultRules } from './defaults';
import { applyTemplate, isIgnored, matchesRule } from './utils';
export { defaultRules } from './defaults';

export const viteBoilerplate = (options: VitePluginBoilerplateOptions = {}): Plugin => {
    const {
        extensions = ['.tsx', '.jsx'],
        ignore = [],
        rules = defaultRules,
        getComponentName = defaultComponentName,
    } = options;

    const extPattern = new RegExp(
        `(${extensions.map((e) => e.replace('.', '\\.')).join('|')})$`,
    );

    return {
        name: 'vite-boilerplate',
        configureServer(server) {
            server.watcher.on('add', (filePath: string) => {
                if (!extPattern.test(filePath)) return;
                if (ignore.length > 0 && isIgnored(filePath, ignore)) return;

                try {
                    const stats = fs.statSync(filePath);

                    if (stats.size > 0) return;

                    const componentName = getComponentName(filePath);
                    const rule = rules.find((r) => matchesRule(r, filePath));

                    if (!rule) return;

                    fs.writeFileSync(filePath, applyTemplate(rule, componentName, filePath), 'utf-8');
                } catch {
                    // file may not be accessible yet — ignore
                }
            });
        },
    };
};
