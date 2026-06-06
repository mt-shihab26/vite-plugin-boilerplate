import fs from 'fs';
import path from 'path';

export const matchesPaths = (filePath: string, paths: string[]): boolean => {
    return paths.some((p) => filePath.includes(p));
};

export const isIgnored = (
    filePath: string,
    ignore: (string | RegExp | ((filePath: string) => boolean))[],
): boolean => {
    return ignore.some((pattern) => {
        if (typeof pattern === 'string') return filePath.includes(pattern);
        if (pattern instanceof RegExp) return pattern.test(filePath);
        return pattern(filePath);
    });
};

export const readGitignorePatterns = (root: string): string[] => {
    const gitignorePath = path.join(root, '.gitignore');

    try {
        return fs
            .readFileSync(gitignorePath, 'utf-8')
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0 && !line.startsWith('#'));
    } catch {
        return [];
    }
};
