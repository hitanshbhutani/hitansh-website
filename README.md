# my resume site

A one-page personal site. Plain HTML and CSS - no JavaScript, no build step,
nothing to install.

## files

- `index.html` - all the content
- `style.css` - the stylesheet, in 12 commented sections
- `README.md` - this

Open `index.html` in a browser. That's the whole setup.

## the look

Cream paper, pastel blocks, everything in monospace. The cards and sticky
notes sit at slightly wrong angles on purpose and straighten up when you
hover them, which is the only real "effect" on the page.

**fonts** (Google Fonts)

- `Space Mono` - headings. It's a mono with a bit of personality.
- `IBM Plex Mono` - body text. Easier to read a paragraph in.

**colours** - all custom properties in `:root`, so the whole page can be
re-themed from one block at the top of the stylesheet.

| token | value | what it's for |
| --- | --- | --- |
| `--paper` | `#fbf7f0` | background |
| `--paper-2` | `#f4eee4` | the tinted bands |
| `--ink` | `#3d3a36` | body text |
| `--ink-soft` | `#6b665f` | dates and labels |
| `--accent` | `#9c554f` | links |
| `--pink` / `--pink-deep` | `#f6c9c6` / `#e8a9a4` | pastel + its shadow |
| `--mint` / `--mint-deep` | `#bfe0d2` / `#9ccfba` | " |
| `--butter` / `--butter-deep` | `#f7e6ad` / `#eed88f` | " |
| `--lilac` / `--lilac-deep` | `#d7cdea` / `#bfb1dd` | " |

Each pastel has a deeper version, which is what the little solid offset
shadows under the cards are made of.

## css I used

- **element selectors** for the base - `body`, `h1, h2, h3`, `p`, `a`, `ul`, `mark`
- **class selectors** for anything repeated - `.card`, `.btn`, `.stat`, `.section`
- **id selectors** for the one-off landmarks - `#site-nav`, `#hero`, `#about`,
  `#skills`, `#experience`, `#education`, `#contact`, `#site-footer`
- **custom properties** in `:root` for colour, type and spacing
- **display** - `flex` for the nav, buttons and footer; `grid` for the cards,
  sticky notes and contact panel
- **positioning** - `sticky` on the nav, `relative` + `absolute` for the
  timeline squares
- **pseudo-elements** - `::before` draws the list bullets and the timeline markers
- **pseudo-classes** - `:hover`, `:active`, `:focus-visible`, and `:nth-child()`
  to give each card, nav link and sticky note a different pastel
- **transforms** - a small `rotate()` on the cards, undone on hover
- **responsive** - `repeat(auto-fit, minmax())`, `clamp()` on the big heading,
  and media queries at 860px and 620px
- **accessibility** - focus outlines, and a `prefers-reduced-motion` block that
  kills the transitions and straightens the tilted cards

## layout

```
nav (sticky)
  hero
  # about        two columns + four sticky notes
  # skills       3 cards, last one spans the row
  # experience   dashed timeline
  # school       2 cards
  # say hi       lilac panel
footer
```
