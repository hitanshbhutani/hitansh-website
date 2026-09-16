# youtube_home

My resume as a video site homepage. Plain HTML, CSS and JavaScript, no build step.

## changing the words

Everything that is text lives in `js/data.js`:

- `CHANNEL` - name, picture, banner, and the e-mail and phone shown by Hire
- `VIEWER` - the signed-in account in the top right (District)
- `VIDEOS` - the two long videos, Mission and Origin
- `SHORTS` - the Work shelf: Parallaxis, Maya Narrative Universe, Education, Film
- each item's `id` is the end of its address, e.g. `mission` in `/beliefs/mission`
- `text` on each one is what shows when it's opened, one string per paragraph
- `tags` decide which chip (Film, Writing...) each one shows up under
- `thumbnail` is the picture in `img/`, `views` is the view count, and `uploaded` is the
  date text shown after it (always in lower case)
- `url` is where the play button offers to go; items without one get no play button

Search reads straight from `text` and titles, so there's nothing else to update.

## files

- `index.html` - header and page shell
- `css/styles.css` - header, side menu, menus, light and dark colours
- `css/pages.css` - home grid, shorts, watch page, search results, channel page
- `js/data.js` - content
- `img/` - thumbnails, channel picture and banner, resized for the web
- `img/logo-wordmark.png` - the word Districtansh set in Alt Gothic ATF Demi, used as
  the logo. The font is licensed for images like this but not for putting the font file
  on a website, so it isn't in the repo. To change the word, render a new picture.
- `js/search.js` - search and autocomplete
- `js/views.js` - builds each page
- `js/app.js` - routing, search box, buttons
- `vercel.json` - sends every page URL to `index.html`, and stops git pushes from deploying

## pages

- `/` home, `/?tag=film` filtered by a chip
- `/beliefs/mission`, `/beliefs/origins`
- `/work/parallaxis`, `/work/maya`, `/work/edu`, `/work/film` - one feed that scrolls
  item by item with the wheel, a trackpad or a swipe
- `/results?search_query=...`
- `/@hitanshbhutani` channel page, with `/beliefs` and `/work` tabs
- `/feed/history`, `/playlist?list=WL` (watch later), `/playlist?list=LL` (liked)

History, likes, saves and theme are kept in the visitor's browser. Older addresses
(`/watch?v=...`, `/shorts/...`, `/work/academic`) still open the right page.

## preview and publish

Two copies of the site:

- **preview** - https://hitanshbhutani.github.io/resume-website/youtube_home/
  Updates by itself a minute or so after anything is pushed to `main`.
- **live** - https://hitansh-theta.vercel.app
  Only changes when I run this from the repo folder:

  ```
  npx.cmd vercel --prod --cwd youtube_home
  ```

GitHub Pages can't handle addresses like `/youtube_home/work/maya` on its own,
so `404.html` in the repo root sends them to this folder and the site puts the
address back. The `vercel.json` in the repo root turns off Vercel's git
deploys, so a push never reaches the live site.
