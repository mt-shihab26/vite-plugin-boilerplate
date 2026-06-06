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

When you create a new empty `.tsx` or `.jsx` file, the plugin writes a component stub based on the file path:

- Files inside a `pages/` directory get a **default export**
- All other files get a **named export**

The component name is derived from the filename in PascalCase. For `index` files, the parent directory name is used instead.

## Options

```ts
viteBoilerplate({
  // File extensions to watch. Default: ['.tsx', '.jsx']
  extensions: ['.tsx', '.jsx'],

  // Rules evaluated in order — first match wins.
  rules: [
    {
      match: /\/pages\//,         // string, RegExp, or (filePath) => boolean
      template: (name) => `export default function ${name}() {\n  return <div />;\n}\n`,
    },
  ],

  // Custom component name derivation
  getComponentName: (filePath) => 'MyComponent',
})
```

### `BoilerplateRule`

| Field | Type | Description |
|---|---|---|
| `match` | `string \| RegExp \| (filePath) => boolean` | Matches against the full file path |
| `template` | `string \| (componentName, filePath) => string` | Content written to the new file |

## Default templates

**`pages/` files:**
```tsx
export default function PageName() {
    return (
        <div>
            
        </div>
    );
}
```

**All other files:**
```tsx
function ComponentName() {
    return (
        <div>
            
        </div>
    );
}

export { ComponentName };
```

## License

MIT
