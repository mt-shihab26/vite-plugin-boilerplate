import path from 'path';

export const defaultWatchDir = 'src';
export const defaultPages = ['src/pages'];

export const defaultComponentName = (filePath: string): string => {
    const fileName = path.basename(filePath, path.extname(filePath));
    const name = fileName === 'index' ? path.basename(path.dirname(filePath)) : fileName;

    return name
        .split(/[-_]/)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
};

export const pageTemplate = (name: string): string =>
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
    ].join('\n');

export const componentTemplate = (name: string): string =>
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
    ].join('\n');
