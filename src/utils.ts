import type { BoilerplateRule } from './types';

export const matchesRule = (rule: BoilerplateRule, filePath: string): boolean => {
    const { match } = rule;

    if (typeof match === 'string') {
return filePath.includes(match);
    } 

    if (match instanceof RegExp) {
return match.test(filePath);
    } 

    return match(filePath);
};

export const applyTemplate = (
    rule: BoilerplateRule,
    componentName: string,
    filePath: string,
): string => {
    const { template } = rule;
    return typeof template === 'string' ? template : template(componentName, filePath);
};

export const isIgnored = (
    filePath: string,
    ignore: (string | RegExp | ((filePath: string) => boolean))[],
): boolean =>
    {
    return ignore.some((pattern) => {
        if (typeof pattern === 'string') return filePath.includes(pattern);
        if (pattern instanceof RegExp) return pattern.test(filePath);
        return pattern(filePath);
    })
};
