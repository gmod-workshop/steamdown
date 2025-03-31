import { describe, test } from 'vitest';
import { Renderer } from '../src';
import { Marked } from 'marked';

describe('Renderer', async () => {
    const renderer = new Renderer();
    const marked = new Marked();

    const parse = async (markdown: string) => marked.parse(markdown, { renderer, async: true });
    const parseInline = async (markdown: string) => marked.parseInline(markdown, { renderer, async: true });

    test('should render code', async ({ expect }) => {
        await expect(parse('```\ncode\n```')).resolves.toEqual('[code]\ncode\n[/code]\n\n');
        await expect(parse('```\ncode\n```\n')).resolves.toEqual('[code]\ncode\n[/code]\n\n');
    });

    test('should render blockquote', async ({ expect }) => {
        await expect(parse('> quote')).resolves.toBe('[quote]\nquote\n[/quote]\n\n');
        await expect(parse('> quote\n')).resolves.toBe('[quote]\nquote\n[/quote]\n\n');
        await expect(parse('> quote\n> quote')).resolves.toBe('[quote]\nquote\nquote\n[/quote]\n\n');
    });

    test('should render heading', async ({ expect }) => {
        await expect(parse('# heading')).resolves.toBe('[h1]heading[/h1]\n\n');
        await expect(parse('## heading')).resolves.toBe('[h2]heading[/h2]\n\n');
        await expect(parse('### heading')).resolves.toBe('[h3]heading[/h3]\n\n');

        await expect(parse('heading\n====')).resolves.toBe('[h1]heading[/h1]\n\n');
        await expect(parse('heading\n----')).resolves.toBe('[h2]heading[/h2]\n\n');
    });

    test('should render hr', async ({ expect }) => {
        await expect(parse('---')).resolves.toBe('[hr][/hr]\n\n');
    });

    test('should render an unordered list', async ({ expect }) => {
        await expect(parse('- item')).resolves.toBe('[list]\n\t[*] item\n[/list]\n\n');
        await expect(parse('* item')).resolves.toBe('[list]\n\t[*] item\n[/list]\n\n');
        await expect(parse('+ item')).resolves.toBe('[list]\n\t[*] item\n[/list]\n\n');
        await expect(parse('- item\n- item')).resolves.toBe('[list]\n\t[*] item\n\t[*] item\n[/list]\n\n');
    });

    test('should render an ordered list', async ({ expect }) => {
        await expect(parse('1. item')).resolves.toBe('[olist]\n\t[*] item\n[/olist]\n\n');
        await expect(parse('1. item\n2. item')).resolves.toBe('[olist]\n\t[*] item\n\t[*] item\n[/olist]\n\n');
    });

    test('should render a checkbox', async ({ expect }) => {
        await expect(parse('- [x] item')).resolves.toBe('[list]\n\t[*] ✅ item\n[/list]\n\n');
        await expect(parse('- [ ] item')).resolves.toBe('[list]\n\t[*] ⬜ item\n[/list]\n\n');
        await expect(parse('- [ ] item\n- [x] item')).resolves.toBe('[list]\n\t[*] ⬜ item\n\t[*] ✅ item\n[/list]\n\n');
    });

    test('should render paragraph', async ({ expect }) => {
        await expect(parse('paragraph')).resolves.toBe('paragraph\n\n');
        await expect(parse('paragraph\n\nparagraph')).resolves.toBe('paragraph\n\nparagraph\n\n');
    });

    test('should render a table', async ({ expect }) => {
        await expect(parse('| header |\n|--------|\n| cell   |\n'))
            .resolves.toBe('[table]\n\t[tr]\n\t\t[th]header[/th]\n\t[/tr]\n\t[tr]\n\t\t[td]cell[/td]\n\t[/tr]\n[/table]\n\n');
        await expect(parse('| header1 | header2 |\n|---------|---------|\n| cell1   | cell2   |\n'))
            .resolves.toBe('[table]\n\t[tr]\n\t\t[th]header1[/th]\n\t\t[th]header2[/th]\n\t[/tr]\n\t[tr]\n\t\t[td]cell1[/td]\n\t\t[td]cell2[/td]\n\t[/tr]\n[/table]\n\n');
    })

    test('should render codespan as quoted text', async ({ expect }) => {
        await expect(parseInline('`codespan`')).resolves.toBe("'codespan'");
    });

    test('should render em', async ({ expect }) => {
        await expect(parseInline('*em*')).resolves.toBe('[i]em[/i]');
        await expect(parseInline('_em_')).resolves.toBe('[i]em[/i]');
    });

    test('should render strong', async ({ expect }) => {
        await expect(parseInline('**strong**')).resolves.toBe('[b]strong[/b]');
        await expect(parseInline('__strong__')).resolves.toBe('[b]strong[/b]');
    });

    test('should NOT render strong inside codespan', async ({ expect }) => {
        await expect(parseInline('`**strong**`')).resolves.toBe("'**strong**'");
        await expect(parseInline('`**strong`')).resolves.toBe("'**strong'");
        await expect(parseInline('`strong**`')).resolves.toBe("'strong**'");
        await expect(parseInline('`strong**strong`')).resolves.toBe("'strong**strong'");
        await expect(parseInline('`strong**strong**`')).resolves.toBe("'strong**strong**'");
        await expect(parseInline('`__strong__`')).resolves.toBe("'__strong__'");
        await expect(parseInline('`__strong`')).resolves.toBe("'__strong'");
    });

    test('should NOT render em inside codespan', async ({ expect }) => {
        await expect(parseInline('`*em*`')).resolves.toBe("'*em*'");
        await expect(parseInline('`*em`')).resolves.toBe("'*em'");
        await expect(parseInline('`_em_`')).resolves.toBe("'_em_'");
    });

    test('should NOT render em if underscores are part of a word', async ({ expect }) => {
        await expect(parseInline('word_underscore')).resolves.toBe('word_underscore');
        await expect(parseInline('word_underscore_')).resolves.toBe('word_underscore_');
        await expect(parseInline('word_underscore_word')).resolves.toBe('word_underscore_word');
    });

    test('should render a strikethrough', async ({ expect }) => {
        await expect(parseInline('~~strikethrough~~')).resolves.toBe('[strike]strikethrough[/strike]');
        await expect(parseInline('~~strikethrough')).resolves.toBe('~~strikethrough');
    });

    test('should render a link', async ({ expect }) => {
        await expect(parseInline('[link](https://example.com)')).resolves.toBe('[url=https://example.com]link[/url]');
    });

    test('should render an image', async ({ expect }) => {
        await expect(parseInline('![image](https://example.com)')).resolves.toBe('[img]https://example.com[/img]');
    });

    test('should render a link with an image', async ({ expect }) => {
        await expect(parseInline('[![image](https://example.com)](https://example.com)')).resolves.toBe('[url=https://example.com][img]https://example.com[/img][/url]');
    });

    test('should render a br', async ({ expect }) => {
        await expect(parse('paragraph  \nparagraph')).resolves.toBe('paragraph\nparagraph\n\n');
    });

    test('should render text', async ({ expect }) => {
        await expect(parseInline('text')).resolves.toBe('text');
    });

    test('should render html as is', async ({ expect }) => {
        await expect(parse('<html lang="en">html</html>')).resolves.toBe('<html lang="en">html</html>');
    });
});
