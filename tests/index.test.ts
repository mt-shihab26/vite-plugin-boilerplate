import fs from 'fs';
import os from 'os';
import path from 'path';

import { describe, expect, test } from 'vitest';

import { boilerplate } from '@/index';

const makePlugin = () =>
    boilerplate({
        watchDir: '/src',
    });

describe('boilerplate plugin — structure', () => {
    test('returns a plugin named vite-plugin-boilerplate', () => {
        expect(makePlugin().name).toBe('vite-plugin-boilerplate');
    });

    test('exposes a configResolved hook', () => {
        expect(typeof makePlugin().configResolved).toBe('function');
    });

    test('exposes a configureServer hook', () => {
        expect(typeof makePlugin().configureServer).toBe('function');
    });
});

describe('boilerplate plugin — configResolved', () => {
    test('does not throw when called with a valid config', () => {
        const plugin = makePlugin();
        expect(() => (plugin.configResolved as any)({ root: '/project' })).not.toThrow();
    });

    test('reads gitignore from the root specified in config', () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-plugin-test-'));
        try {
            fs.writeFileSync(path.join(tmpDir, '.gitignore'), 'dist\n');
            const plugin = boilerplate({ watchDir: path.join(tmpDir, 'src') });
            expect(() => (plugin.configResolved as any)({ root: tmpDir })).not.toThrow();
        } finally {
            fs.rmSync(tmpDir, { recursive: true });
        }
    });
});

describe('boilerplate plugin — configureServer', () => {
    test('registers an "add" listener on the file watcher', () => {
        const plugin = makePlugin();
        const events: string[] = [];
        const mockServer = {
            watcher: { on: (event: string) => events.push(event) },
        } as any;

        (plugin.configureServer as any)(mockServer);
        expect(events).toContain('add');
    });

    test('watcher handler writes boilerplate for a new empty .tsx file inside watchDir', () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-plugin-test-'));
        try {
            const watchDir = path.join(tmpDir, 'src');
            fs.mkdirSync(watchDir);
            const filePath = path.join(watchDir, 'Button.tsx');
            fs.writeFileSync(filePath, '');

            const plugin = boilerplate({ watchDir });
            (plugin.configResolved as any)({ root: tmpDir });

            let addHandler: ((p: string) => void) | undefined;
            const mockServer = {
                watcher: {
                    on: (_: string, h: (p: string) => void) => {
                        addHandler = h;
                    },
                },
            } as any;
            (plugin.configureServer as any)(mockServer);

            addHandler!(filePath);
            expect(fs.readFileSync(filePath, 'utf-8')).toContain('export const Button = () => {');
        } finally {
            fs.rmSync(tmpDir, { recursive: true });
        }
    });

    test('watcher handler writes Vue SFC boilerplate for a new empty .vue file', () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-plugin-test-'));
        try {
            const watchDir = path.join(tmpDir, 'src');
            fs.mkdirSync(watchDir);
            const filePath = path.join(watchDir, 'Button.vue');
            fs.writeFileSync(filePath, '');

            const plugin = boilerplate({ watchDir });
            (plugin.configResolved as any)({ root: tmpDir });

            let addHandler: ((p: string) => void) | undefined;
            const mockServer = {
                watcher: {
                    on: (_: string, h: (p: string) => void) => {
                        addHandler = h;
                    },
                },
            } as any;
            (plugin.configureServer as any)(mockServer);

            addHandler!(filePath);
            const content = fs.readFileSync(filePath, 'utf-8');
            expect(content).toContain('<script setup lang="ts">');
            expect(content).toContain('<template>');
        } finally {
            fs.rmSync(tmpDir, { recursive: true });
        }
    });

    test('watcher handler skips files outside watchDir', () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-plugin-test-'));
        try {
            const watchDir = path.join(tmpDir, 'src');
            fs.mkdirSync(watchDir);
            const outsideFile = path.join(tmpDir, 'outside.tsx');
            fs.writeFileSync(outsideFile, '');

            const plugin = boilerplate({ watchDir });
            (plugin.configResolved as any)({ root: tmpDir });

            let addHandler: ((p: string) => void) | undefined;
            const mockServer = {
                watcher: {
                    on: (_: string, h: (p: string) => void) => {
                        addHandler = h;
                    },
                },
            } as any;
            (plugin.configureServer as any)(mockServer);

            addHandler!(outsideFile);
            expect(fs.readFileSync(outsideFile, 'utf-8')).toBe('');
        } finally {
            fs.rmSync(tmpDir, { recursive: true });
        }
    });
});
