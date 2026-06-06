import fs from 'fs';
import os from 'os';
import path from 'path';

import { describe, expect, test } from 'vitest';

import { matchesPaths, isIgnored, readGitignorePatterns } from '@/utils';

describe('matchesPaths', () => {
    test('returns true when filePath includes one of the paths', () => {
        expect(matchesPaths('/src/pages/Home.tsx', ['/src/pages'])).toBe(true);
    });

    test('returns false when filePath does not include any path', () => {
        expect(matchesPaths('/src/components/Button.tsx', ['/src/pages'])).toBe(false);
    });

    test('returns true when any of multiple paths match', () => {
        expect(matchesPaths('/src/views/About.tsx', ['/src/pages', '/src/views'])).toBe(true);
    });

    test('returns false for empty paths array', () => {
        expect(matchesPaths('/src/pages/Home.tsx', [])).toBe(false);
    });
});

describe('isIgnored', () => {
    test('matches string patterns as substring', () => {
        expect(isIgnored('/src/node_modules/foo.tsx', ['node_modules'])).toBe(true);
    });

    test('returns false for non-matching string', () => {
        expect(isIgnored('/src/components/Button.tsx', ['node_modules'])).toBe(false);
    });

    test('matches RegExp patterns', () => {
        expect(isIgnored('/src/components/Button.test.tsx', [/\.test\./])).toBe(true);
    });

    test('returns false when RegExp does not match', () => {
        expect(isIgnored('/src/components/Button.tsx', [/\.test\./])).toBe(false);
    });

    test('matches predicate functions returning true', () => {
        expect(isIgnored('/src/components/Button.tsx', [(p) => p.endsWith('.tsx')])).toBe(true);
    });

    test('returns false when predicate returns false', () => {
        expect(isIgnored('/src/components/Button.vue', [(p) => p.endsWith('.tsx')])).toBe(false);
    });

    test('returns false for empty ignore array', () => {
        expect(isIgnored('/src/components/Button.tsx', [])).toBe(false);
    });

    test('short-circuits on first matching pattern', () => {
        const called: string[] = [];
        const patterns = [
            (p: string) => {
                called.push('first');
                return true;
            },
            (p: string) => {
                called.push('second');
                return true;
            },
        ];
        expect(isIgnored('/src/Button.tsx', patterns)).toBe(true);
        expect(called).toEqual(['first']);
    });
});

describe('readGitignorePatterns', () => {
    test('reads and parses .gitignore, stripping comments and blank lines', () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-plugin-test-'));
        try {
            fs.writeFileSync(
                path.join(tmpDir, '.gitignore'),
                'node_modules\ndist\n# comment\n\nbuild\n',
            );
            expect(readGitignorePatterns(tmpDir)).toEqual(['node_modules', 'dist', 'build']);
        } finally {
            fs.rmSync(tmpDir, { recursive: true });
        }
    });

    test('returns empty array when .gitignore does not exist', () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-plugin-test-'));
        try {
            expect(readGitignorePatterns(tmpDir)).toEqual([]);
        } finally {
            fs.rmSync(tmpDir, { recursive: true });
        }
    });

    test('trims whitespace from each line', () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-plugin-test-'));
        try {
            fs.writeFileSync(path.join(tmpDir, '.gitignore'), '  node_modules  \n  dist  \n');
            expect(readGitignorePatterns(tmpDir)).toEqual(['node_modules', 'dist']);
        } finally {
            fs.rmSync(tmpDir, { recursive: true });
        }
    });
});
