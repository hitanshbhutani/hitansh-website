# youtube_home

My resume as a video site homepage. Plain HTML, CSS and JavaScript, no build step.

## changing the words

Everything that is text lives in `js/data.js`:

- `VIDEOS` - the two long videos, Mission and Origin
- `SHORTS` - the Work shelf: Parallaxis, Maya Narrative Universe, Academic
- `text` on each one is what shows when it's opened, one string per paragraph
- `tags` decide which chip (Film, Writing...) each one shows up under
- `thumbnail` can point at an image in `img/` to replace the drawn card

Search reads straight from `text` and titles, so there's nothing else to update.

## files

- `index.html` - header and page shell
- `css/styles.css` - header, side menu, menus, light and dark colours
- `css/pages.css` - home grid, shorts, watch page, search results, channel page
- `js/data.js` - content
- `js/search.js` - search and autocomplete
- `js/views.js` - builds each page
- `js/app.js` - routing, search box, buttons
- `vercel.json` - sends every page URL to `index.html`, and stops git pushes from deploying

## pages

- `/` home, `/?tag=film` filtered by a chip
- `/watch?v=mission`, `/watch?v=origin`
- `/shorts/parallaxis`, `/shorts/maya`, `/shorts/academic`
- `/results?search_query=...`
- `/@hitanshbhutani` channel page
- `/feed/history`, `/playlist?list=WL` (watch later), `/playlist?list=LL` (liked)

History, likes, saves and theme are kept in the visitor's browser.

## preview and publish

Two copies of the site:

- **preview** - https://hitanshbhutani.github.io/resume-website/youtube_home/
  Updates by itself a minute or so after anything is pushed to `main`.
- **live** - https://hitansh-theta.vercel.app
  Only changes when I run this from the repo folder:

  ```
  npx.cmd vercel --prod --cwd youtube_home
  ```

GitHub Pages can't handle addresses like `/youtube_home/shorts/maya` on its own,
so `404.html` in the repo root sends them to this folder and the site puts the
address back. The `vercel.json` in the repo root turns off Vercel's git
deploys, so a push never reaches the live site.
