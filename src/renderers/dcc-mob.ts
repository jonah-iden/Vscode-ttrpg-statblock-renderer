import type { StatblockRenderer } from './types';

/**
 * Renderer for DCC RPG monster ("mob") statblocks, e.g.
 *
 *   Goblin: Init +1; Atk dagger +1 melee (1d4); AC 12; HD 1d6; hp 4; MV 30'; Act 1d20; SV Fort +0, Ref +1, Will -1; AL C.
 *
 * The name is everything before the first colon, the rest is split on ';'.
 */
export const dccMob: StatblockRenderer = {
	id: 'dcc-mob',
	render(source, md) {
		const esc = md.utils.escapeHtml;
		const text = source.trim().replace(/\s+/g, ' ');
		const colon = text.indexOf(':');
		const name = colon === -1 ? '' : text.slice(0, colon).trim();
		const body = colon === -1 ? text : text.slice(colon + 1);
		const fields = body.split(';').map(f => f.trim().replace(/\.$/, '')).filter(Boolean);

		const rows = fields.map(f => {
			const space = f.indexOf(' ');
			const key = space === -1 ? f : f.slice(0, space);
			const value = space === -1 ? '' : f.slice(space + 1);
			return `<dt>${esc(key)}</dt><dd>${esc(value)}</dd>`;
		}).join('');

		return `<div class="statblock statblock-dcc-mob">`
			+ (name ? `<div class="statblock-name">${esc(name)}</div>` : '')
			+ `<dl>${rows}</dl></div>\n`;
	},
};
