import fs from 'fs';
import path from 'path';

import type { TOptions } from './types';
import { componentTemplate, defaultComponentName, pageTemplate, vueTemplate } from './defaults';
import { isIgnored, matchesPaths } from './utils';

export const buildExtPattern = (extensions: string[]): RegExp =>
    new RegExp(`(${extensions.map((e) => e.replace('.', '\\.')).join('|')})$`);

export const resolvePages = (watchDir: string, pages: TOptions['pages']): string[] => {
    const list = pages === undefined ? [] : Array.isArray(pages) ? pages : [pages];
    return list.map((p) => path.join(watchDir, p));
};

export const selectTemplate = (
    filePath: string,
    relPath: string,
    resolvedPages: string[],
): string => {
    if (filePath.endsWith('.vue')) return vueTemplate(relPath);
    const name = defaultComponentName(filePath);
    return resolvedPages.length > 0 && matchesPaths(filePath, resolvedPages)
        ? pageTemplate(name, relPath)
        : componentTemplate(name, relPath);
};

export const writeBoilerplate = (
    filePath: string,
    relPath: string,
    resolvedPages: string[],
): void => {
    try {
        const stats = fs.statSync(filePath);
        if (stats.size > 0) return;
        fs.writeFileSync(filePath, selectTemplate(filePath, relPath, resolvedPages), 'utf-8');
    } catch {
        // file may not be accessible yet — ignore
    }
};

export const shouldSkip = (
    filePath: string,
    extPattern: RegExp,
    watchDir: string,
    gitignorePatterns: string[],
    ignore: TOptions['ignore'],
): boolean => {
    if (!extPattern.test(filePath)) return true;
    if (!filePath.includes(watchDir)) return true;
    if (isIgnored(filePath, gitignorePatterns)) return true;
    if (ignore && ignore.length > 0 && isIgnored(filePath, ignore)) return true;
    return false;
};
