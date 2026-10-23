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
		return renderer
			? renderer.render(token.content, md)
			: defaultFence(tokens, idx, options, env, self);
	};
	return md;
}
