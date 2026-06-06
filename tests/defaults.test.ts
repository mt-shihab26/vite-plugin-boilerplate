import { describe, expect, test } from 'vitest';

import { defaultComponentName, pageTemplate, componentTemplate, vueTemplate } from '@/defaults';

describe('defaultComponentName', () => {
    test('capitalizes a simple filename', () => {
        expect(defaultComponentName('/src/components/button.tsx')).toBe('Button');
    });

    test('preserves already-capitalized filename', () => {
        expect(defaultComponentName('/src/components/Button.tsx')).toBe('Button');
    });

    test('uses parent directory name for index files', () => {
        expect(defaultComponentName('/src/components/Button/index.tsx')).toBe('Button');
    });

    test('converts hyphenated names to PascalCase', () => {
        expect(defaultComponentName('/src/components/my-button.tsx')).toBe('MyButton');
    });

    test('converts underscored names to PascalCase', () => {
        expect(defaultComponentName('/src/components/my_button.tsx')).toBe('MyButton');
    });

    test('handles multi-segment hyphenated names', () => {
        expect(defaultComponentName('/src/components/user-profile-card.tsx')).toBe(
            'UserProfileCard',
        );
    });
});

describe('pageTemplate', () => {
    test('uses a default (non-named) export', () => {
        const result = pageTemplate('HomePage', 'src/pages/Home.tsx');
        expect(result).toContain('const HomePage = () => {');
        expect(result).toContain('export default HomePage;');
    });

    test('includes the relative path in the JSX', () => {
        const result = pageTemplate('HomePage', 'src/pages/Home.tsx');
        expect(result).toContain('src/pages/Home.tsx');
    });

    test('does not use a named export', () => {
        const result = pageTemplate('HomePage', 'src/pages/Home.tsx');
        expect(result).not.toContain('export const');
    });
});

describe('componentTemplate', () => {
    test('uses a named export', () => {
        const result = componentTemplate('Button', 'src/components/Button.tsx');
        expect(result).toContain('export const Button = () => {');
    });

    test('includes the relative path in the JSX', () => {
        const result = componentTemplate('Button', 'src/components/Button.tsx');
        expect(result).toContain('src/components/Button.tsx');
    });

    test('does not use a default export', () => {
        const result = componentTemplate('Button', 'src/components/Button.tsx');
        expect(result).not.toContain('export default');
    });
});

describe('vueTemplate', () => {
    test('includes script setup block', () => {
        const result = vueTemplate('src/components/Button.vue');
        expect(result).toContain('<script setup lang="ts">');
        expect(result).toContain('</script>');
    });

    test('includes template block', () => {
        const result = vueTemplate('src/components/Button.vue');
        expect(result).toContain('<template>');
        expect(result).toContain('</template>');
    });

    test('includes the relative path in the template', () => {
        const result = vueTemplate('src/components/Button.vue');
        expect(result).toContain('src/components/Button.vue');
    });
});
