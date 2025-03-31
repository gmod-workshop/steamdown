import {Marked, Renderer as DefaultRenderer} from "marked";
import {Renderer} from "./Renderer";

export type ConvertOptions = {
    marked?: Marked;
    renderer?: DefaultRenderer;
}

export class Converter {
    private readonly marked: Marked;
    private readonly renderer: DefaultRenderer;

    public constructor(options: ConvertOptions = {}) {
        this.marked = options.marked ?? new Marked();
        this.renderer = options.renderer ?? new Renderer();
    }

    /**
     * Converts Markdown to Steam BBCode.
     * @param markdown Markdown to convert.
     */
    public async convert(markdown: string): Promise<string> {
        return await this.marked.parse(markdown, {renderer: this.renderer, async: true});
    }
}
