# vite-plugin-boilerplate

[![npm version](https://img.shields.io/npm/v/vite-plugin-boilerplate?style=flat-square)](https://www.npmjs.com/package/vite-plugin-boilerplate)
[![npm downloads](https://img.shields.io/npm/dm/vite-plugin-boilerplate?style=flat-square)](https://www.npmjs.com/package/vite-plugin-boilerplate)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vite-plugin-boilerplate?style=flat-square)](https://bundlephobia.com/package/vite-plugin-boilerplate)
[![license](https://img.shields.io/npm/l/vite-plugin-boilerplate?style=flat-square)](./LICENSE)
[![types](https://img.shields.io/npm/types/vite-plugin-boilerplate?style=flat-square)](https://www.npmjs.com/package/vite-plugin-boilerplate)

A Vite plugin that automatically generates React component boilerplate when you create a new `.tsx` or `.jsx` file.

## Install

```bash
npm install -D vite-plugin-boilerplate
# or
bun add -D vite-plugin-boilerplate
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { viteBoilerplate } from 'vite-plugin-boilerplate';

export default defineConfig({
    plugins: [viteBoilerplate()],
});
```

When you create a new empty `.tsx` or `.jsx` file inside `watchDir`, the plugin writes a component stub:

- Files matching a **`pages`** path get a **default export**
- All other files inside `watchDir` get a **named export**

The component name is derived from the filename in PascalCase. For `index` files, the parent directory name is used instead.

## Options

```ts
viteBoilerplate({
    // Base directory to watch. Default: 'src'
    watchDir: 'src',

    // Paths treated as pages — default export. Default: ['src/pages']
    // All other files inside watchDir get a named export automatically.
    pages: ['src/pages', 'src/views'],

    // File extensions to watch. Default: ['.tsx', '.jsx']
    extensions: ['.tsx', '.jsx'],

    // Paths to ignore. Supports string (substring), RegExp, or predicate.
    ignore: ['node_modules', /\.stories\./, (filePath) => filePath.includes('__mocks__')],
});
```

### Options reference

| Option       | Type                                                    | Default            | Description                                                                                 |
| ------------ | ------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| `watchDir`   | `string`                                                | `'src'`            | Base directory — files outside it are ignored                                               |
| `pages`      | `string[]`                                              | `['src/pages']`    | Paths matched as pages (default export). Everything else in `watchDir` gets a named export. |
| `extensions` | `string[]`                                              | `['.tsx', '.jsx']` | File extensions that trigger boilerplate generation                                         |
| `ignore`     | `(string \| RegExp \| (filePath: string) => boolean)[]` | `[]`               | Paths to skip                                                                               |

## Generated templates

**Page** (`src/pages/**`):

```tsx
const PageName = () => {
    return <div></div>;
};

export default PageName;
```

**Component** (`src/**`):

```tsx
const ComponentName = () => {
    return <div></div>;
};

export { ComponentName };
```

## License

MIT
