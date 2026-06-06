# vite-plugin-boilerplate

[![npm version](https://img.shields.io/npm/v/vite-plugin-boilerplate?style=flat-square)](https://www.npmjs.com/package/vite-plugin-boilerplate)
[![npm downloads](https://img.shields.io/npm/dm/vite-plugin-boilerplate?style=flat-square)](https://www.npmjs.com/package/vite-plugin-boilerplate)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vite-plugin-boilerplate?style=flat-square)](https://bundlephobia.com/package/vite-plugin-boilerplate)
[![license](https://img.shields.io/npm/l/vite-plugin-boilerplate?style=flat-square)](./LICENSE)
[![types](https://img.shields.io/npm/types/vite-plugin-boilerplate?style=flat-square)](https://www.npmjs.com/package/vite-plugin-boilerplate)
[![npmx](https://img.shields.io/badge/npmx-vite--plugin--boilerplate-blue?style=flat-square)](https://npmx.dev/package/vite-plugin-boilerplate)

A Vite plugin that automatically writes component boilerplate when you create a new `.tsx`, `.jsx`, or `.vue` file — so you never start from a blank file again.

## Install

```bash
npm install -D vite-plugin-boilerplate
# or
bun add -D vite-plugin-boilerplate
```

## Setup

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { boilerplate } from 'vite-plugin-boilerplate';

export default defineConfig({
    plugins: [boilerplate({ watchDir: 'src' })],
});
```

## How it works

When you create a new **empty** file inside `watchDir`, the plugin writes a stub based on the file type:

| File                                  | Template written                        |
| ------------------------------------- | --------------------------------------- |
| `.vue`                                | `<script setup lang="ts">` SFC          |
| `.tsx` / `.jsx` inside a `pages` path | React component with **default export** |
| `.tsx` / `.jsx` everywhere else       | React component with **named export**   |

The component name is derived from the filename in PascalCase. For `index` files, the parent directory name is used instead (e.g. `Button/index.tsx` → `Button`).

Paths listed in `.gitignore` are skipped automatically.

> Vue files always use the same SFC stub regardless of whether they are inside a `pages` path — the default/named export distinction applies only to `.tsx` and `.jsx` files.

## Options

```ts
boilerplate({
    // Base directory to watch (required)
    watchDir: 'src',

    // Subdirectory(s) relative to watchDir whose .tsx/.jsx files get a default export.
    // Accepts a string or an array of strings. Omit to use named exports everywhere.
    pages: 'pages', // or pages: ['pages', 'views']

    // Paths to ignore. Supports strings (substring match), RegExp, or predicate functions.
    ignore: ['node_modules', /\.stories\./, (filePath) => filePath.includes('__mocks__')],
});
```

### Options reference

| Option     | Type                                                    | Default | Description                                                                              |
| ---------- | ------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `watchDir` | `string` **(required)**                                 | —       | Base directory — files outside it are ignored                                            |
| `pages`    | `string \| string[]`                                    | —       | Subdir(s) relative to `watchDir` for `.tsx`/`.jsx` pages (default export)                |
| `ignore`   | `(string \| RegExp \| (filePath: string) => boolean)[]` | `[]`    | Patterns for files to skip — strings match as substrings, RegExp and functions also work |

## Generated templates

**React page** — `.tsx`/`.jsx` inside a `pages` path (e.g. `src/pages/home.tsx`):

```tsx
const Home = () => {
    return <div>Edit: `src/pages/home.tsx`</div>;
};

export default Home;
```

**React component** — `.tsx`/`.jsx` outside a `pages` path (e.g. `src/components/my-button.tsx`):

```tsx
export const MyButton = () => {
    return <div>Edit: `src/components/my-button.tsx`</div>;
};
```

**Vue SFC** — any `.vue` file (e.g. `src/components/my-button.vue`):

```vue
<script setup lang="ts"></script>

<template>
    <div>Edit: `src/components/my-button.vue`</div>
</template>
```
