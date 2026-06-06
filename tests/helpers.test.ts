import fs from 'fs';
import os from 'os';
import path from 'path';

import { describe, expect, test } from 'vitest';

import {
    buildExtPattern,
    resolvePages,
    selectTemplate,
    writeBoilerplate,
    shouldSkip,
} from '@/helpers';

describe('buildExtPattern', () => {
    test('matches files with a single configured extension', () => {
        const pattern = buildExtPattern(['.tsx']);
        expect(pattern.test('Button.tsx')).toBe(true);
    });

    test('does not match files with unconfigured extension', () => {
        const pattern = buildExtPattern(['.tsx', '.jsx']);
        expect(pattern.test('utils.ts')).toBe(false);
    });

    test('matches all configured extensions', () => {
        const pattern = buildExtPattern(['.tsx', '.jsx', '.vue']);
        expect(pattern.test('Button.vue')).toBe(true);
        expect(pattern.test('Button.jsx')).toBe(true);
    });

    test('does not match dot in the middle of a filename', () => {
        const pattern = buildExtPattern(['.tsx']);
        expect(pattern.test('Button.test.ts')).toBe(false);
    });
});

describe('resolvePages', () => {
    test('returns empty array when pages is undefined', () => {
        expect(resolvePages('/src', undefined)).toEqual([]);
    });

    test('resolves a single page string to a joined path', () => {
        expect(resolvePages('/src', 'pages')).toEqual([path.join('/src', 'pages')]);
    });

    test('resolves an array of page strings', () => {
        expect(resolvePages('/src', ['pages', 'views'])).toEqual([
            path.join('/src', 'pages'),
            path.join('/src', 'views'),
        ]);
    });
});

describe('selectTemplate', () => {
    test('returns Vue SFC template for .vue files', () => {
        const result = selectTemplate(
            '/src/components/Button.vue',
            'src/components/Button.vue',
            [],
        );
        expect(result).toContain('<script setup lang="ts">');
    });

    test('returns page template (default export) for files inside a resolved page dir', () => {
        const result = selectTemplate('/src/pages/Home.tsx', 'src/pages/Home.tsx', ['/src/pages']);
        expect(result).toContain('const Home = () => {');
        expect(result).toContain('export default Home;');
    });

    test('returns component template (named export) for files outside page dirs', () => {
        const result = selectTemplate('/src/components/Button.tsx', 'src/components/Button.tsx', [
            '/src/pages',
        ]);
        expect(result).toContain('export const Button = () => {');
        expect(result).not.toContain('export default');
    });

    test('returns component template when resolvedPages is empty', () => {
        const result = selectTemplate('/src/pages/Home.tsx', 'src/pages/Home.tsx', []);
        expect(result).toContain('export const Home = () => {');
    });
});

describe('writeBoilerplate', () => {
    test('writes template content to an empty file', () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-plugin-test-'));
        try {
            const filePath = path.join(tmpDir, 'Button.tsx');
            fs.writeFileSync(filePath, '');
            writeBoilerplate(filePath, 'src/components/Button.tsx', []);
            expect(fs.readFileSync(filePath, 'utf-8')).toContain('export const Button = () => {');
        } finally {
            fs.rmSync(tmpDir, { recursive: true });
        }
    });

    test('does not overwrite a non-empty file', () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-plugin-test-'));
        try {
            const filePath = path.join(tmpDir, 'Button.tsx');
            const existing = 'export const Button = () => <div>existing</div>;\n';
            fs.writeFileSync(filePath, existing);
            writeBoilerplate(filePath, 'src/components/Button.tsx', []);
            expect(fs.readFileSync(filePath, 'utf-8')).toBe(existing);
        } finally {
            fs.rmSync(tmpDir, { recursive: true });
        }
    });

    test('silently ignores inaccessible files', () => {
        expect(() => {
            writeBoilerplate('/nonexistent/path/Button.tsx', 'src/Button.tsx', []);
        }).not.toThrow();
    });

    test('writes page template when file is inside a resolved page dir', () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-plugin-test-'));
        try {
            const filePath = path.join(tmpDir, 'Home.tsx');
            fs.writeFileSync(filePath, '');
            writeBoilerplate(filePath, 'src/pages/Home.tsx', [tmpDir]);
            expect(fs.readFileSync(filePath, 'utf-8')).toContain('export default Home;');
        } finally {
            fs.rmSync(tmpDir, { recursive: true });
        }
    });
});

describe('shouldSkip', () => {
    const extPattern = buildExtPattern(['.tsx', '.jsx']);
    const watchDir = '/src';

    test('returns true for files with a non-matching extension', () => {
        expect(shouldSkip('/src/utils.ts', extPattern, watchDir, [], [])).toBe(true);
    });

    test('returns true for files outside watchDir', () => {
        expect(shouldSkip('/other/Button.tsx', extPattern, watchDir, [], [])).toBe(true);
    });

    test('returns true for files matching gitignore patterns', () => {
        expect(
            shouldSkip('/src/node_modules/Button.tsx', extPattern, watchDir, ['node_modules'], []),
        ).toBe(true);
    });

    test('returns true for files matching custom ignore patterns', () => {
        expect(shouldSkip('/src/Button.test.tsx', extPattern, watchDir, [], [/\.test\./])).toBe(
            true,
        );
    });

    test('returns false for a valid file inside watchDir with matching extension', () => {
        expect(shouldSkip('/src/components/Button.tsx', extPattern, watchDir, [], [])).toBe(false);
    });

    test('returns false when ignore is undefined', () => {
        expect(shouldSkip('/src/components/Button.tsx', extPattern, watchDir, [], undefined)).toBe(
            false,
        );
    });
});
