/**
 * Minimal JSX runtime that renders straight to HTML strings (no React, no DOM).
 * Text children and attribute values are escaped; use `raw()` for HTML that is already safe.
 */

/** A piece of HTML that is already escaped. */
export class Html {
	constructor(readonly value: string) {}
	toString(): string {
		return this.value;
	}
}

export type Child = Html | string | number | boolean | null | undefined | Child[];
type Component = (props: Record<string, unknown>) => Html | null;

const VOID_ELEMENTS = new Set(['area', 'br', 'col', 'hr', 'img', 'input', 'link', 'meta', 'source', 'wbr']);

export function raw(html: string): Html {
	return new Html(html);
}

export function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function renderChildren(children: Child): string {
	if (children instanceof Html) {
		return children.value;
	}
	if (Array.isArray(children)) {
		return children.map(renderChildren).join('');
	}
	if (children === null || children === undefined || typeof children === 'boolean') {
		return '';
	}
	return escapeHtml(String(children));
}

export function h(tag: string | Component, props: Record<string, unknown> | null, ...children: Child[]): Html {
	if (typeof tag === 'function') {
		return tag({ ...props, children }) ?? new Html('');
	}
	const attributes = Object.entries(props ?? {})
		.map(([name, value]) => {
			if (value === false || value === null || value === undefined) {
				return '';
			}
			return value === true ? ` ${name}` : ` ${name}="${escapeHtml(String(value))}"`;
		})
		.join('');
	return new Html(VOID_ELEMENTS.has(tag)
		? `<${tag}${attributes}>`
		: `<${tag}${attributes}>${renderChildren(children)}</${tag}>`);
}

export function Fragment({ children }: { children?: Child }): Html {
	return new Html(renderChildren(children));
}

declare global {
	namespace JSX {
		type Element = Html;
		interface IntrinsicElements {
			[tag: string]: Record<string, unknown>;
		}
		interface ElementChildrenAttribute {
			children: unknown;
		}
	}
}
