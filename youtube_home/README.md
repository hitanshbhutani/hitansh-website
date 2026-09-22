# youtube_home

My resume as a video site homepage. Plain HTML, CSS and JavaScript, no build step.

## changing the words

Everything that is text lives in `js/data.js`:

- `CHANNEL` - name, picture, banner, and the e-mail and phone shown by Hire
- `VIEWER` - the signed-in account in the top right (District)
- `VIDEOS` - the two long videos, Mission and Origins (the Worldview shelf)
- `SHORTS` - the Work shelf: Parallaxis, Maya Narrative Universe, Education, Film
- each item's `id` is the end of its address, e.g. `mission` in `/worldview/mission`
- `text` on each one is what shows when it's opened, one string per paragraph
- `CHIPS` - the bar under the header: All, Worldview (long videos only), Work (Work only)
- `tags` also let `/?tag=film` filter the home page
- `thumbnail` is the picture in `img/`, `views` is the view count (`viewsLabel` replaces the
  word "views", as on Maya), and `uploaded` is the date text shown after it (always in lower case)
- `url` is where the play button offers to go; items without one get no play button
- `hover` is the tint (red, green, blue) behind a card under the pointer, taken from its
  thumbnail; it shows at 17% in dark mode and 13% in light mode, like YouTube's

Search reads straight from `text` and titles, so there's nothing else to update.

## files

- `index.html` - header and page shell
- `css/styles.css` - header, side menu, menus, light and dark colours
- `css/pages.css` - home grid, shorts, watch page, search results, channel page
- `js/data.js` - content
- `img/` - thumbnails, channel picture and banner, resized for the web
- `img/logo-wordmark.png` - the word Hitansh set in Alt Gothic ATF Demi, used as
  the logo. The font is licensed for images like this but not for putting the font file
  on a website, so it isn't in the repo. To change the word, render a new picture.
- `js/search.js` - search and autocomplete
- `js/views.js` - builds each page
- `js/app.js` - routing, search box, buttons
- `vercel.json` - sends every page URL to `index.html`, and stops git pushes from deploying

## pages

- `/` home, `/?tag=worldview` and `/?tag=work` from the chips, `/?tag=film` by item tag
- `/worldview/mission`, `/worldview/origins`
- `/work/parallaxis`, `/work/maya`, `/work/edu`, `/work/film` - one feed that scrolls
  item by item with the wheel, a trackpad or a swipe
- `/results?search_query=...`
- `/@hitanshbhutani` channel page, with `/worldview` and `/work` tabs
- `/feed/history`, `/playlist?list=WL` (watch later), `/playlist?list=LL` (liked)

History, likes, saves and theme are kept in the visitor's browser. Older addresses
(`/watch?v=...`, `/beliefs/...`, `/shorts/...`, `/work/academic`) still open the right page.

## preview and publish

- **live** - https://hitanshb.vercel.app
  Only changes when this is run from the repo folder, once each round of changes is pushed:

  ```
  npx.cmd vercel --prod --cwd youtube_home
  ```

GitHub Pages can't handle addresses like `/youtube_home/work/maya` on its own,
so `404.html` in the repo root sends them to this folder and the site puts the
address back. The `vercel.json` in the repo root turns off Vercel's git
deploys, so a push never reaches the live site.
