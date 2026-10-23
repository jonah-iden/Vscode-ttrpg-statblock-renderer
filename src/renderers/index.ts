import { dccMob } from './dcc-mob';
import type { MarkdownIt, RenderRule, StatblockRenderer } from './types';

/** Add new system renderers here. */
const renderers: StatblockRenderer[] = [dccMob];

/** Hooks the fence rule so ```<renderer-id> blocks are rendered by the matching renderer. */
export function registerRenderers(md: MarkdownIt): MarkdownIt {
	const byId = new Map(renderers.map(r => [r.id, r]));
	const defaultFence: RenderRule = md.renderer.rules.fence
		?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		const lang = token.info.trim().split(/\s+/)[0];
		const renderer = byId.get(lang);
		if (!renderer) {
			return defaultFence(tokens, idx, options, env, self);
		}
		try {
			return renderer.render(token.content, md);
		} catch (e) {
			// Show what went wrong above the raw block so it can be fixed in place.
			const message = e instanceof Error ? e.message : String(e);
			return `<div class="statblock-error"><strong>${md.utils.escapeHtml(lang)}:</strong> `
				+ `<pre>${md.utils.escapeHtml(message)}</pre></div>`
				+ defaultFence(tokens, idx, options, env, self);
		}
	};
	return md;
}
