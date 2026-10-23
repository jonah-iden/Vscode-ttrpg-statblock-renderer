# Markdown Statblock Renderer

Renders TTRPG statblocks in VS Code's built-in Markdown preview. Write a statblock as YAML in a fenced code block tagged with the system's name, and the preview shows it as a formatted statblock.

Supported systems:

| Fence tag | System |
|---|---|
| `dcc-mob` | DCC monsters (mobs and bosses) |

## Usage

1. Open or create a Markdown file.
2. Add a fenced code block whose language is a fence tag from the table above, and write the statblock inside it as YAML.
3. Open the preview (`Ctrl+Shift+V`, or `Ctrl+K V` to open it to the side).

Code blocks with any other language render as usual.

## Statblock format

All statblocks follow these rules, whatever the system:

- The body of the code block is YAML, made of `key: value` pairs. Which keys exist depends on the system (see below). Keys the renderer doesn't recognize are ignored.
- Long text can go over several lines with `>`. The lines are joined into one paragraph, and a blank line starts a new paragraph:

  ```yaml
  notes: >
    This text can wrap over as many lines
    as you like.

    This is a second paragraph.
  ```

- Free-text fields (descriptions, notes) support inline Markdown such as `**bold**` and `*italic*`.
- If the YAML is invalid, the preview shows the error message with its line number, followed by the raw code block, so you can fix it in place.

### YAML pitfalls

YAML gives some characters a special meaning. Wrap a value in quotes if it:

- starts with `[`, `{`, `*`, `&`, `!`, `|`, `>`, `%`, `@` or a quote character,
- contains `: ` (colon followed by a space) or ` #` (space followed by a hash).

```yaml
title: "*Not* a YAML alias"
abilities:
  "Warning: Hot": Burns on touch.
```

Values like `12+F`, `1d8+2 Bludgeoning` or `10ft (Reach)` are fine without quotes.

## DCC mobs (`dcc-mob`)

### Example

````markdown
```dcc-mob
name: Hooligans Ultra
title: Nachbarschafts-Boss (Neighborhood Boss)
rank: Boss
size: Large
type: Avian/Humanoid Hybrid
hp: 11x4
level: 6
surprise: 13+F
evade: 13+F
move: 20+S
dr: 2
str: 9
int: 6
con: 10
dex: 8
cha: 10

attacks:
  Eiserne Kette: { hit: 13+F, damage: 2d6+3 Bludgeoning, range: 10ft (Reach) }
  Tackle: { hit: 13+F, damage: 1d6+3 Bludgeoning + Knockback }
  Improvisierter Molotow:
    hit: 12+F
    damage: 1d4+2 Fire
    range: 20ft
    note: Creates a burning field (5ft radius, 1d4 fire damage on entering).

abilities:
  Fangesang der Schande (Schrei): >
    Once per fight. All Crawlers within 30ft must pass an Int/Mental check
    or become Enraged until the end of the next round.
  Ultra-Motivation: Allied Hooligans within 15ft get +1 DR.

notes: >
  As a boss, the Ultra gets 1 action per Crawler in the group.
```
````

Further examples are in [test-data/dcc.md](test-data/dcc.md).

### Fields

Every field is optional. A missing stat or attribute shows as `–`.

| Field | Example | Description |
|---|---|---|
| `name` | `Hooligans` | Name of the creature. |
| `title` | `Neighborhood Boss` | Optional subtitle, shown in italics under the name. |
| `rank` | `Mob`, `Boss` | Shown at the start of the description line. |
| `size` | `Large` or `5` | Size class, given by name or number (see [Sizes](#sizes)). Shown as `Large (5)`. |
| `type` | `Avian/Humanoid Hybrid` | Creature type. |
| `hp` | `11x4`, `[2, 2, 2]`, `4` | HP boxes (see [HP](#hp)). |
| `level` | `6` | Stats row. Any text works, e.g. `13+F`. |
| `surprise` | `13+F` | |
| `evade` | `13+F` | |
| `move` | `20+S` | |
| `dr` | `2` | |
| `str`, `int`, `con`, `dex`, `cha` | `9` or `9 (+3)` | Attributes (see [Attribute modifiers](#attribute-modifiers)). |
| `attacks` | | Attacks, by name (see [Attacks](#attacks)). |
| `abilities` | | Abilities, by name (see [Abilities](#abilities)). |
| `notes` | | Free text, shown at the bottom under "Notes". |

The description line combines `rank`, `size` and `type`, e.g. `Boss: Large (5), Avian/Humanoid Hybrid`.

### Sizes

`size` takes the name or the number. The name is not case-sensitive. A value that is neither is shown exactly as written.

| Class | Name | Examples |
|---|---|---|
| 1 | Tiny | Scatterer, Rat |
| 2 | Small | Cat, Raccoon |
| 3 | Petite | Goblin, Boar |
| 4 | Medium | Human, Wolf |
| 5 | Large | Horse, Mantaur |
| 6 | Huge | Elephant, Rhino |
| 7 | Colossal | Dinosaur, Dragon |
| 8 | Gargantuan | Kaiju |

### HP

HP is drawn as a row of boxes, colored from red on the left to green on the right.

Click a box in the preview to cross it off, and click it again to restore it. Crossed-off boxes are kept while you edit the document, but reset when the preview is closed. They are not saved to the file.

| Value | Result |
|---|---|
| `11x4` | 11 boxes of 4 HP each |
| `[2, 2, 3]` | One box per entry, so box sizes can differ |
| `4` | A single box of 4 HP |

Any other text is shown as written, without boxes.

### Attribute modifiers

Give an attribute as a plain number and the modifier is calculated for you: `str: 9` shows as `9 (+3)`. The modifier goes up by one at each of these scores:

| Score | Modifier |
|---|---|
| 1–2 | +1 |
| 3–5 | +2 |
| 6–9 | +3 |
| 10–14 | +4 |
| 15–20 | +5 |

The pattern continues: each step is one score wider than the last. To set the modifier yourself, write the value as text, e.g. `str: 9 (+4)`. Text is shown exactly as written.

### Attacks

`attacks` maps each attack's name to its details:

| Key | Example | Shown as |
|---|---|---|
| `hit` | `13+F` | `13+F to hit` |
| `damage` | `2d6+3 Bludgeoning` | as written |
| `range` | `10ft (Reach)` | `10ft (Reach) range` |
| `note` | | Free text shown under the attack |

Short attacks fit on one line using `{ … }`. Longer ones, or ones with a `note`, can be written over several lines. Both forms are in the example above.

An attack can also be plain text, which is shown as written:

```yaml
attacks:
  Tackle: 13+F to hit, 1d6+3 Bludgeoning + Knockback
```

### Abilities

`abilities` maps each ability's name to its description. Text in parentheses at the end of the name, such as `(Aura)` or `(Schrei)`, is shown as a small tag next to the name.

```yaml
abilities:
  Aggressives Zischen (Aura): >
    Any creature that starts its turn within 5ft of a Hooligan
    must win a Dex/Evade contest or lose 1 positioning field.
```

## Development

- `npm install` installs dependencies.
- Press `F5` to start an Extension Development Host. It builds the extension in watch mode and opens the [test-data](test-data) folder.
- `npm run compile` type-checks, lints and builds once.

### Adding a system

1. Create a renderer in `src/renderers/`, e.g. `src/renderers/my-system.tsx`, that exports a `StatblockRenderer` (see [src/renderers/types.ts](src/renderers/types.ts)). Its `id` is the fence tag, and `render` turns the code block's content into an HTML string. Parse the YAML with the `yaml` package, as [src/renderers/dcc-mob.tsx](src/renderers/dcc-mob.tsx) does.
2. Add the renderer to the `renderers` list in [src/renderers/index.ts](src/renderers/index.ts).
3. Add styles to [media/statblock.css](media/statblock.css), and click handling or other interaction to [media/statblock.js](media/statblock.js).
4. Add sample statblocks to `test-data/` and document the format in this README.

Renderers are written in JSX, but there is no React. [src/jsx.ts](src/jsx.ts) is a small runtime that turns JSX straight into an HTML string:

- Text and attribute values are escaped automatically.
- Wrap HTML that is already safe, such as the output of `md.renderInline`, in `raw()`.
- Use `class`, not `className`.
- Each `.tsx` file needs `import { h } from '../jsx'`, plus `Fragment` if it uses `<>…</>`.

The HTML is generated once per preview render. Anything interactive has to be done in [media/statblock.js](media/statblock.js), which runs inside the preview. The preview removes inline `style` attributes, so all styling has to go in the CSS file.

If `render` throws an error, the preview shows the error message above the raw block, so a renderer only needs to throw a clear message for invalid input.

## Requirements

VS Code 1.140 or later.
