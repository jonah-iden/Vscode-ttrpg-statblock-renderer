import { parse } from 'yaml';
import { Child, Fragment, h, raw } from '../jsx';
import type { MarkdownIt, StatblockRenderer } from './types';

/**
 * Renderer for DCC (Dungeon Crawler Carl) mob statblocks written as YAML:
 *
 *   name: Hooligans
 *   rank: Mob
 *   size: Medium
 *   type: Avian/Humanoid Hybrid
 *   hp: 2x2
 *   level: 2
 *   ...
 *   attacks:
 *     Baseballschläger: { hit: 12+F, damage: 1d8+2 Bludgeoning, range: 5ft }
 *   abilities:
 *     Rudel-Aggro: Erhält +1 auf Trefferwürfe ...
 */

const SIZES = ['Tiny', 'Small', 'Petite', 'Medium', 'Large', 'Huge', 'Colossal', 'Gargantuan'];
const STATS = [['level', 'Level'], ['surprise', 'Surprise'], ['evade', 'Evade'], ['move', 'Move'], ['dr', 'DR']] as const;
const ATTRIBUTES = [['str', 'Str'], ['int', 'Int'], ['con', 'Con'], ['dex', 'Dex'], ['cha', 'Cha']] as const;

type Mob = Record<string, unknown>;

export const dccMob: StatblockRenderer = {
	id: 'dcc-mob',
	render(source, md) {
		const mob: unknown = parse(source);
		if (!isMapping(mob)) {
			throw new Error('Expected a YAML mapping (key: value pairs).');
		}
		return <Statblock m={mob} md={md} /> + '\n';
	},
};

function Statblock({ m, md }: { m: Mob; md: MarkdownIt }) {
	return <div class="statblock statblock-dcc-mob">
		<div class="sb-name">{str(m.name)}</div>
		{m.title !== undefined && <div class="sb-title">{str(m.title)}</div>}
		<Meta m={m} />
		<Hp value={m.hp} />
		<StatTable cells={STATS.map(([key, label]) => [label, str(m[key], '–')])} />
		<StatTable cells={ATTRIBUTES.map(([key, label]) => [label, attribute(m[key])])} />
		<Attacks value={m.attacks} md={md} />
		<NamedTexts heading="Abilities" value={m.abilities} md={md} />
		{m.notes !== undefined && <Section heading="Notes"><Text value={m.notes} md={md} /></Section>}
	</div>;
}

function str(value: unknown, fallback = ''): string {
	return value === undefined || value === null ? fallback : String(value);
}

/** "Boss: Large (5), Avian/Humanoid Hybrid" */
function Meta({ m }: { m: Mob }) {
	const parts = [size(m.size), str(m.type)].filter(Boolean).join(', ');
	const line = m.rank !== undefined ? `${str(m.rank)}: ${parts}` : parts;
	return line ? <div class="sb-meta">{line}</div> : null;
}

/** Accepts a size name ("Large") or class number (5) and renders "Large (5)". */
function size(value: unknown): string {
	if (value === undefined) {
		return '';
	}
	if (typeof value === 'number' && SIZES[value - 1]) {
		return `${SIZES[value - 1]} (${value})`;
	}
	const index = SIZES.findIndex(s => s.toLowerCase() === String(value).trim().toLowerCase());
	return index === -1 ? String(value) : `${SIZES[index]} (${index + 1})`;
}

/** Accepts "11x4" (11 boxes of 4), a list of box sizes, or a single number. */
function Hp({ value }: { value: unknown }) {
	if (value === undefined) {
		return null;
	}
	let boxes: string[];
	const repeat = typeof value === 'string' && /^\s*(\d+)\s*x\s*(\d+)\s*$/i.exec(value);
	if (repeat) {
		boxes = Array<string>(Number(repeat[1])).fill(repeat[2]);
	} else if (Array.isArray(value)) {
		boxes = value.map(v => str(v));
	} else if (typeof value === 'number') {
		boxes = [String(value)];
	} else {
		return <div class="sb-hp"><span class="sb-label">HP</span> {str(value)}</div>;
	}
	return <div class="sb-hp">
		<span class="sb-label">HP</span>
		<span class="sb-hp-boxes">
			{boxes.map(b => <button class="sb-hp-box" type="button" title="Click to cross off">{b}</button>)}
		</span>
	</div>;
}

function StatTable({ cells }: { cells: (readonly [string, string])[] }) {
	return <table class="sb-table">
		<tr>{cells.map(([label]) => <th>{label}</th>)}</tr>
		<tr>{cells.map(([, value]) => <td>{value}</td>)}</tr>
	</table>;
}

/** A bare number gets its modifier derived; anything else (e.g. "9 (+3)") is shown as written. */
function attribute(value: unknown): string {
	if (typeof value !== 'number') {
		return str(value, '–');
	}
	return `${value} (${modifier(value) >= 0 ? '+' : ''}${modifier(value)})`;
}

/** Modifiers step up at the triangular numbers: 1 → +1, 3 → +2, 6 → +3, 10 → +4, 15 → +5, ... */
function modifier(score: number): number {
	let mod = 0;
	while ((mod + 1) * (mod + 2) / 2 <= score) {
		mod++;
	}
	return mod;
}

function Section({ heading, children }: { heading: string; children?: Child }) {
	return <div class="sb-section">
		<div class="sb-heading">{heading}</div>
		{children}
	</div>;
}

function Attacks({ value, md }: { value: unknown; md: MarkdownIt }) {
	if (!isMapping(value)) {
		return null;
	}
	return <Section heading="Attacks">
		{Object.entries(value).map(([name, attack]) => {
			if (!isMapping(attack)) {
				return <div class="sb-entry"><span class="sb-entry-name">{name}:</span> {raw(md.renderInline(str(attack)))}</div>;
			}
			const parts = [
				attack.hit !== undefined ? `${str(attack.hit)} to hit` : '',
				str(attack.damage),
				attack.range !== undefined ? `${str(attack.range)} range` : '',
			].filter(Boolean);
			return <div class="sb-entry">
				<span class="sb-entry-name">{name}:</span> {parts.join(', ')}
				{attack.note !== undefined && <Text value={attack.note} md={md} />}
			</div>;
		})}
	</Section>;
}

/** Renders a "Name (Tag): text" mapping such as abilities. */
function NamedTexts({ heading, value, md }: { heading: string; value: unknown; md: MarkdownIt }) {
	if (!isMapping(value)) {
		return null;
	}
	return <Section heading={heading}>
		{Object.entries(value).map(([key, body]) => {
			const tagged = /^(.*?)\s*\(([^()]+)\)$/.exec(key);
			return <div class="sb-entry">
				<span class="sb-entry-name">{tagged ? tagged[1] : key}</span>
				{tagged && <> <span class="sb-tag">{tagged[2]}</span></>}
				<Text value={body} md={md} />
			</div>;
		})}
	</Section>;
}

/** Free text with inline markdown; blank lines separate paragraphs. */
function Text({ value, md }: { value: unknown; md: MarkdownIt }) {
	return <>{str(value).trim().split(/\n\s*\n/).map(p => <p>{raw(md.renderInline(p))}</p>)}</>;
}

function isMapping(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === 'object' && !Array.isArray(value);
}
