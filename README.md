# vite-plugin-boilerplate

[![npm version](https://img.shields.io/npm/v/vite-plugin-boilerplate?style=flat-square)](https://www.npmjs.com/package/vite-plugin-boilerplate)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vite-plugin-boilerplate?style=flat-square)](https://bundlephobia.com/package/vite-plugin-boilerplate)
[![TypeScript](https://img.shields.io/badge/TypeScript-typed-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![vite peer](https://img.shields.io/badge/vite-%3E%3D4.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![GitHub stars](https://img.shields.io/github/stars/mt-shihab26/vite-plugin-boilerplate?style=flat-square)](https://github.com/mt-shihab26/vite-plugin-boilerplate/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/mt-shihab26/vite-plugin-boilerplate?style=flat-square)](https://github.com/mt-shihab26/vite-plugin-boilerplate/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/mt-shihab26/vite-plugin-boilerplate?style=flat-square)](https://github.com/mt-shihab26/vite-plugin-boilerplate/commits/main)

A Vite plugin that automatically writes component boilerplate when you create a new `.tsx`, `.jsx`, or `.vue` file.

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
import { boilerplate } from 'vite-plugin-boilerplate';

export default defineConfig({
    plugins: [
        boilerplate({
            watchDir: 'src',
            pages: 'pages', // .tsx/.jsx files here get a default export
        }),
    ],
});
```

When you create an empty file inside `watchDir`, the plugin fills it in.

The component name is taken from the filename in PascalCase (`my-button.tsx` → `MyButton`). For `index` files, the parent folder name is used instead.

### React component

`.tsx`/`.jsx` anywhere else:

```tsx
export const MyButton = () => {
    return <div>Edit: `src/components/my-button.tsx`</div>;
};
```

### React page

`.tsx`/`.jsx` inside a `pages` dir:

```tsx
const Home = () => {
    return <div>Edit: `src/pages/home.tsx`</div>;
};

export default Home;
```

### Vue SFC

```vue
<script setup lang="ts"></script>

<template>
    <div>Edit: `src/components/my-button.vue`</div>
</template>
```

## Options

| Option     | Type                               | Description                                                 |
| ---------- | ---------------------------------- | ----------------------------------------------------------- |
| `watchDir` | `string` **(required)**            | Only files inside this directory are watched                |
| `pages`    | `string \| string[]`               | Subdir(s) whose `.tsx`/`.jsx` files get a default export    |
| `ignore`   | `(string \| RegExp \| function)[]` | Extra paths to skip (`.gitignore` is applied automatically) |

```ts
boilerplate({
    // required — only files inside this dir are watched
    watchDir: 'src',

    // subdir(s) relative to watchDir whose .tsx/.jsx files get a default export
    pages: 'pages',

    // string (substring), RegExp, or function — .gitignore is applied automatically
    ignore: ['__tests__', /\.stories\./, (path) => path.includes('__mocks__')],
});
```
