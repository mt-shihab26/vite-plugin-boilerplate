import path from 'path';

import type { BoilerplateRule } from './types';

export const defaultComponentName = (filePath: string): string => {
    const fileName = path.basename(filePath, path.extname(filePath));
    const name = fileName === 'index' ? path.basename(path.dirname(filePath)) : fileName;

    return name
        .split(/[-_]/)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
};

export const defaultRules: BoilerplateRule[] = [
    {
        match: /\/pages\//,
        template: (name) =>
            [
                `const ${name} = () => {`,
                `    return (`,
                `        <div>`,
                `            `,
                `        </div>`,
                `    );`,
                `};`,
                ``,
                `export default ${name};`,
                ``,
            ].join('\n'),
    },
    {
        match: () => true,
        template: (name) =>
            [
                `const ${name} = () => {`,
                `    return (`,
                `        <div>`,
                `            `,
                `        </div>`,
                `    );`,
                `};`,
                ``,
                `export { ${name} };`,
                ``,
            ].join('\n'),
    },
];
