/** Minimal subset of the markdown-it API used by this extension. */
export interface MarkdownIt {
	utils: { escapeHtml(str: string): string };
	renderInline(src: string, env?: unknown): string;
	renderer: {
		rules: Record<string, RenderRule | undefined>;
	};
}

export interface Token {
	info: string;
	content: string;
}

export type RenderRule = (
	tokens: Token[],
	idx: number,
	options: unknown,
	env: unknown,
	self: { renderToken(tokens: Token[], idx: number, options: unknown): string }
) => string;

/** A renderer turns the body of a fenced code block into HTML. */
export interface StatblockRenderer {
	/** Fence language, e.g. ```dcc-mob */
	readonly id: string;
	render(source: string, md: MarkdownIt): string;
}
