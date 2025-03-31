#!usr/bin/env node

import { program } from 'commander';
import fs from 'node:fs/promises';
import { Converter } from './Converter';

program
    .name('steamdown')
    .description('Convert Markdown to Steam BBCode')
    .version(process.env.npm_package_version || '1.0.0')
    .argument('[input]', 'Input file (reads from stdin if not provided)')
    .option('-o, --output <file>', 'Output file (writes to stdout if not provided)')
    .action(async (input: string | undefined, options: { output?: string }) => {
        try {
            // Read from file or stdin
            const markdown = input
                ? await fs.readFile(input, 'utf-8')
                : await readStdin();

            const converter = new Converter();

            const bbcode = await converter.convert(markdown);

            // Write to file or stdout
            if (options.output) {
                await fs.writeFile(options.output, bbcode);
            } else {
                process.stdout.write(bbcode);
            }
        } catch (error) {
            console.error('Error:', (error as Error).message);
            process.exit(1);
        }
    });

async function readStdin(): Promise<string> {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf-8');
}

// Only run the CLI if this file is being executed directly
if (require.main === module) {
    program.parse();
}
