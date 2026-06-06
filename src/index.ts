import fs from 'node:fs';
import path from 'node:path';

import type { Plugin } from 'vite';

export interface BoilerplateRule {
    match: string | RegExp | ((filePath: string) => boolean);
    template: string | ((componentName: string, filePath: string) => string);
}

export interface VitePluginBoilerplateOptions {
    /**
     * File extensions to watch. Defaults to ['.tsx', '.jsx'].
     */
    extensions?: string[];

    /**
     * Rules evaluated in order — first match wins.
     * Defaults to: pages/ → default export, everything else → named export.
     */
    rules?: BoilerplateRule[];

    /**
     * Derive the React component name from a file path.
     * Defaults to PascalCase of the filename; index files use the parent directory name.
     */
    getComponentName?: (filePath: string) => string;
}

function defaultComponentName(filePath: string): string {
    const fileName = path.basename(filePath, path.extname(filePath));
    const name = fileName === 'index' ? path.basename(path.dirname(filePath)) : fileName;

    return name
        .split(/[-_]/)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

function matchesRule(rule: BoilerplateRule, filePath: string): boolean {
    const { match } = rule;

    if (typeof match === 'string') {
        return filePath.includes(match);
    }

    if (match instanceof RegExp) {
        return match.test(filePath);
    }

    return match(filePath);
}

function applyTemplate(
    rule: BoilerplateRule,
    componentName: string,
    filePath: string,
): string {
    const { template } = rule;
    return typeof template === 'string' ? template : template(componentName, filePath);
}

export const defaultRules: BoilerplateRule[] = [
    {
        match: /\/pages\//,
        template: (name) =>
            [
                `export default function ${name}() {`,
                `    return (`,
                `        <div>`,
                `            `,
                `        </div>`,
                `    );`,
                `}`,
                ``,
            ].join('\n'),
    },
    {
        match: () => true,
        template: (name) =>
            [
                `function ${name}() {`,
                `    return (`,
                `        <div>`,
                `            `,
                `        </div>`,
                `    );`,
                `}`,
                ``,
                `export { ${name} };`,
                ``,
            ].join('\n'),
    },
];

export function viteBoilerplate(options: VitePluginBoilerplateOptions = {}): Plugin {
    const {
        extensions = ['.tsx', '.jsx'],
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
                if (!extPattern.test(filePath)) {
                    return;
                }

                try {
                    const stats = fs.statSync(filePath);

                    if (stats.size > 0) {
                        return;
                    }

                    const componentName = getComponentName(filePath);
                    const rule = rules.find((r) => matchesRule(r, filePath));

                    if (!rule) {
                        return;
                    }

                    fs.writeFileSync(filePath, applyTemplate(rule, componentName, filePath), 'utf-8');
                } catch {
                    // file may not be accessible yet — ignore
                }
            });
        },
    };
}
