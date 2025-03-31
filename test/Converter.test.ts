import { describe, test } from 'vitest';
import { Converter } from '../src';

describe('Converter', () => {
    const converter = new Converter();

    test('should convert markdown to bbcode', async ({ expect }) => {
        expect(await converter.convert('paragraph')).toBe('paragraph\n\n');
    });

    test('should convert a complex markdown to bbcode', async ({ expect }) => {
        const markdown = `# Heading 1  

[![image](https://example.com)](https://example.com)
        
\`Hello World\`
        
---
        
- List 1\n`

        const bbcode = `[h1]Heading 1[/h1]

[url=https://example.com][img]https://example.com[/img][/url]

'Hello World'

[hr][/hr]

[list]
\t[*] List 1
[/list]\n\n`

        expect(await converter.convert(markdown)).toBe(bbcode);
    })
});
