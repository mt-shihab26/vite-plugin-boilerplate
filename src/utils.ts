export const matchesPaths = (filePath: string, paths: string[]): boolean =>
    paths.some((p) => filePath.includes(p));

export const isIgnored = (
    filePath: string,
    ignore: (string | RegExp | ((filePath: string) => boolean))[],
): boolean =>
    ignore.some((pattern) => {
        if (typeof pattern === 'string') return filePath.includes(pattern);
        if (pattern instanceof RegExp) return pattern.test(filePath);
        return pattern(filePath);
    });
