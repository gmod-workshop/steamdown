import { Tokens, marked } from 'marked';

export class Renderer extends marked.Renderer {
    space(): string {
        return '';
    }

    code({ text }: Tokens.Code): string {
        return `[code]\n${text}\n[/code]\n\n`;
    }

    blockquote({tokens}: Tokens.Blockquote): string {
        return `[quote]\n${this.parser.parse(tokens).trim()}\n[/quote]\n\n`;
    }

    html(token: Tokens.HTML): string {
        return token.text;
    }

    heading({ tokens, depth }: Tokens.Heading): string {
        return `[h${depth}]${this.parser.parseInline(tokens)}[/h${depth}]\n\n`;
    }

    hr(): string {
        return '[hr][/hr]\n\n';
    }

    list({ ordered, items }: Tokens.List): string {
        if (ordered) {
            return `[olist]\n${items.map((i) => `${this.listitem(i)}`).join('\n')}\n[/olist]\n\n`;
        }

        return `[list]\n${items.map((i) => `${this.listitem(i)}`).join('\n')}\n[/list]\n\n`;
    }

    listitem({ tokens, task, checked, loose }: Tokens.ListItem): string {
        let body = '';
        if (task) {
            const checkbox = this.checkbox({ checked: checked!! });
            body += `${checkbox} `;
        }

        body += this.parser.parse(tokens, loose);

        return `\t[*] ${body}`;
    }

    checkbox({checked}: Tokens.Checkbox): string {
        return checked ? '✅' : '⬜';
    }

    paragraph({ tokens }: Tokens.Paragraph): string {
        const text = this.parser.parseInline(tokens).replace(/\n{2,}/g, '');

        return `${text}\n\n`;
    }

    table({ header, rows }: Tokens.Table): string {
        let body = '';

        let cell = ''
        cell += header.map((i) => `${this.tablecell(i)}`).join('\n');
        body += this.tablerow({ text: cell });

        cell = '';
        for (const row of rows) {
            cell += row.map((i) => `${this.tablecell(i)}`).join('\n');
            body += this.tablerow({ text: cell });
            cell = '';
        }

        return `[table]\n${body}[/table]\n\n`;
    }

    tablerow({ text }: Tokens.TableRow): string {
        return `\t[tr]\n${text}\n\t[/tr]\n`;
    }

    tablecell({ tokens, header }: Tokens.TableCell): string {
        if (header) {
            return `\t\t[th]${this.parser.parseInline(tokens)}[/th]`;
        }

        return `\t\t[td]${this.parser.parseInline(tokens)}[/td]`;
    }

    strong({ tokens }: Tokens.Strong): string {
        return `[b]${this.parser.parseInline(tokens)}[/b]`;
    }

    em({ tokens }: Tokens.Em): string {
        return `[i]${this.parser.parseInline(tokens)}[/i]`;
    }

    codespan({ text }: Tokens.Codespan): string {
        return `'${text}'`;
    }

    br(): string {
        return '\n';
    }

    del({tokens}: Tokens.Del): string {
        return `[strike]${this.parser.parseInline(tokens)}[/strike]`;
    }

    link({href, tokens}: Tokens.Link): string {
        return `[url=${href}]${this.parser.parseInline(tokens)}[/url]`;
    }

    image({href}: Tokens.Image): string {
        return `[img]${href}[/img]`;
    }

    text(token: Tokens.Text | Tokens.Escape): string {
        return token.text;
    }
}
