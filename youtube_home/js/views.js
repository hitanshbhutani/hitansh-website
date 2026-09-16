// HTML builders for every page. Nothing in here touches the DOM directly.

const Store = {
  get(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v == null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  },
  has(list, id) { return this.get(list, []).includes(id); },
  toggle(list, id) {
    const items = this.get(list, []);
    const i = items.indexOf(id);
    if (i === -1) items.unshift(id); else items.splice(i, 1);
    this.set(list, items);
    return i === -1;
  },
  push(list, id, max = 50) {
    const items = this.get(list, []).filter((x) => x !== id);
    items.unshift(id);
    this.set(list, items.slice(0, max));
  },
};

const V = (() => {
  const ch = () => window.CHANNEL;
  const byId = (id) => [...window.VIDEOS, ...window.SHORTS].find((x) => x.id === id);
  const href = (item, query) => {
    const base = item.type === "short" ? "work/" + item.id : "watch?v=" + item.id;
    if (!query) return base;
    return base + (item.type === "short" ? "?q=" : "&q=") + encodeURIComponent(query);
  };

  function avatar(cls = "") {
    const c = ch();
    if (c.avatar) return `<img class="avatar ${cls}" src="${c.avatar}" alt="">`;
    return `<span class="avatar ${cls}" aria-hidden="true">${escapeHtml(c.initials)}</span>`;
  }

  const viewerAvatar = (cls = "") => `<img class="avatar ${cls}" src="${window.VIEWER.avatar}" alt="">`;

  // the grey tick after a channel name, with its "Verified" tooltip on hover
  const verified = () =>
    `<span class="verified" aria-label="Verified">${icon("verified")}<span class="tip" role="tooltip">Verified</span></span>`;

  const channelName = () =>
    `<span class="ch"><span class="ch-name">${escapeHtml(ch().name)}</span>${verified()}</span>`;

  function ago(dateStr) {
    const then = new Date(dateStr + "T00:00:00");
    const secs = Math.max(0, (Date.now() - then.getTime()) / 1000);
    const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600]];
    for (const [name, s] of units) {
      const n = Math.floor(secs / s);
      if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
    }
    return "just now";
  }

  const when = (item) => escapeHtml((item.uploaded || ago(item.published)).toLowerCase());
  const views = (item) => escapeHtml(`${item.views} ${item.views === "1" ? "view" : "views"}`);
  const metaLine = (item) => `${views(item)}<span class="dot"></span>${when(item)}`;

  // the loading circle shown until a video "starts"
  const spinner = `<div class="spinner" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26"/></svg></div>`;

  // ---- thumbnails ----
  // `wide` is a 16:9 frame. A vertical picture in one gets blurred side bars,
  // and so does any picture marked fit: "contain".
  function thumb(item, wide) {
    const src = item.thumbnail;
    const vertical = item.type === "short";
    if ((wide && vertical) || item.fit === "contain") {
      return `<img class="thumb-blur" src="${src}" alt="" aria-hidden="true"><img class="thumb-img contain" src="${src}" alt="" loading="lazy">`;
    }
    return `<img class="thumb-img" src="${src}" alt="" loading="lazy">`;
  }

  const badge = (item) =>
    `<span class="badge">${item.type === "short" ? "WORK" : Search.duration(item)}</span>`;

  // sits on top of a thumbnail, outside its link, so pressing it doesn't open the page
  const playBtn = (item, cls = "") =>
    `<button class="play-btn ${cls}" data-play="${item.id}" aria-label="Play ${escapeHtml(item.title)}">${icon("play")}</button>`;

  const menuBtn = (item) =>
    `<button class="icon-btn card-menu" data-menu="${item.id}" aria-label="Action menu">${icon("more")}</button>`;

  // ---- cards ----
  function videoCard(item) {
    return `
      <div class="card">
        <div class="thumb-wrap">
          <a class="card-link" href="${href(item)}" data-link>
            <div class="thumb">${thumb(item, true)}${badge(item)}${watchedBar(item)}</div>
          </a>
          ${playBtn(item)}
        </div>
        <div class="details">
          <a href="${ch().handle}" data-link aria-label="${escapeHtml(ch().name)}">${avatar()}</a>
          <div>
            <a href="${href(item)}" data-link><h3 class="v-title">${escapeHtml(item.title)}</h3></a>
            <div class="v-meta"><a href="${ch().handle}" data-link>${channelName()}</a></div>
            <div class="v-meta">${metaLine(item)}</div>
          </div>
          ${menuBtn(item)}
        </div>
      </div>`;
  }

  function shortCard(item, query) {
    return `
      <div class="short-card">
        <div class="thumb-wrap">
          <a href="${href(item, query)}" data-link>
            <div class="short-thumb">${thumb(item, false)}</div>
          </a>
          ${playBtn(item)}
        </div>
        <div class="short-meta">
          <a href="${href(item, query)}" data-link><h3 class="v-title">${escapeHtml(item.title)}</h3></a>
          <div class="v-meta">${metaLine(item)}</div>
          ${menuBtn(item)}
        </div>
      </div>`;
  }

  function watchedBar(item) {
    return Store.has("history", item.id) ? `<span class="progress"><i style="width:100%"></i></span>` : "";
  }

  function row(item, query) {
    const link = href(item, query);
    const isShort = item.type === "short";
    const snippet = query ? Search.snippet(item, query) : escapeHtml(item.text.join(" ").slice(0, 160)) + "...";
    return `
      <div class="row">
        <div class="thumb-wrap">
          <a href="${link}" data-link>
            <div class="thumb">${thumb(item, true)}${badge(item)}</div>
          </a>
          ${playBtn(item)}
        </div>
        <div class="row-body">
          <a href="${link}" data-link><h3 class="row-title">${escapeHtml(item.title)}</h3></a>
          <div class="v-meta" style="font-size:12px;line-height:18px">${metaLine(item)}</div>
          <a class="row-channel" href="${ch().handle}" data-link>${avatar()}${channelName()}</a>
          <p class="row-snippet">${snippet}</p>
          ${isShort && item.subtitle ? `<span class="row-tag">${escapeHtml(item.subtitle)}</span>` : ""}
          ${menuBtn(item)}
        </div>
      </div>`;
  }

  function compact(item) {
    return `
      <div class="compact">
        <div class="thumb-wrap">
          <a href="${href(item)}" data-link>
            <div class="thumb">${thumb(item, true)}${badge(item)}</div>
          </a>
          ${playBtn(item, "small")}
        </div>
        <div class="compact-body">
          <a href="${href(item)}" data-link><h3 class="compact-title">${escapeHtml(item.title)}</h3></a>
          <div class="v-meta">${channelName()}</div>
          <div class="v-meta">${metaLine(item)}</div>
          ${menuBtn(item)}
        </div>
      </div>`;
  }

  const workShelf = (items, title, query) => `
    <section class="shelf">
      <h2 class="shelf-head">${icon("shorts")}${escapeHtml(title)}</h2>
      <div class="shorts-grid">${items.map((s) => shortCard(s, query)).join("")}</div>
    </section>`;

  // ---- pages ----
  function home(activeTag) {
    const match = (i) => !activeTag || i.tags.includes(activeTag);
    const videos = window.VIDEOS.filter(match);
    const shorts = window.SHORTS.filter(match);
    const chips = window.CHIPS.map(
      (c) => `<button class="chip ${c.tag === activeTag ? "active" : ""}" data-chip="${c.tag || ""}">${escapeHtml(c.label)}</button>`
    ).join("");

    let body = "";
    if (videos.length) body += `<div class="video-grid">${videos.map((v) => videoCard(v)).join("")}</div>`;
    if (shorts.length) body += workShelf(shorts, window.SHORTS_SHELF_TITLE);
    if (!body) body = empty("No videos here yet", "Try another topic.");

    return `<div class="chips-bar"><div class="chips">${chips}</div></div><div class="feed">${body}</div>`;
  }

  function empty(title, text) {
    return `<div class="empty"><div class="big">${icon("search")}</div><h2>${title}</h2><p>${text}</p></div>`;
  }

  function results(query) {
    const hits = Search.run(query);
    if (!hits.length) {
      return `<div class="results">${empty("No results found", "Try different keywords or remove search filters")}</div>`;
    }
    const videos = hits.filter((h) => h.type === "video");
    const shorts = hits.filter((h) => h.type === "short");
    let html = `<div class="results"><p class="results-count">${hits.length} result${hits.length > 1 ? "s" : ""} for "${escapeHtml(query)}"</p>`;
    // work goes in a shelf after the first long video, the way the real results page mixes them
    videos.forEach((v, i) => {
      html += row(v, query);
      if (i === 0 && shorts.length) html += workShelf(shorts, window.SHORTS_SHELF_TITLE, query);
    });
    if (!videos.length) html += shorts.map((s) => row(s, query)).join("");
    return html + "</div>";
  }

  function paragraphs(item, query) {
    const terms = query ? Search.tokenize(query) : [];
    return item.text
      .map((p) => `<p>${terms.length ? Search.highlight(p, terms).replace(/<b>/g, "<mark>").replace(/<\/b>/g, "</mark>") : escapeHtml(p)}</p>`)
      .join("");
  }

  function watch(item, query) {
    const others = [...window.VIDEOS, ...window.SHORTS].filter((x) => x.id !== item.id);
    const liked = Store.has("liked", item.id);
    const saved = Store.has("later", item.id);
    const tags = item.tags.map((t) => "#" + t.replace(/-/g, "")).join(" ");
    return `
      <div class="watch">
        <div class="watch-main">
          <div class="player" id="player">
            ${thumb(item, true)}
            ${spinner}
            ${playBtn(item, "big")}
            <div class="player-bar">
              <div class="scrub"><i id="scrub" style="width:0%"></i></div>
              <div class="controls">
                <button class="icon-btn" data-play="${item.id}" aria-label="Play">${icon("play")}</button>
                <button class="icon-btn" id="ctl-next" aria-label="Next">${icon("next")}</button>
                <button class="icon-btn" aria-label="Volume">${icon("volume")}</button>
                <span class="time"><span id="time-now">0:00</span> / ${Search.duration(item)}</span>
                <button class="icon-btn" id="ctl-full" aria-label="Full screen">${icon("fullscreen")}</button>
              </div>
            </div>
          </div>

          <h1 class="watch-title">${escapeHtml(item.title)}</h1>

          <div class="watch-bar">
            <div class="owner">
              <a href="${ch().handle}" data-link>${avatar()}</a>
              <a href="${ch().handle}" data-link class="owner-name">${channelName()}</a>
              <button class="pill dark" data-action="hire">Hire</button>
            </div>
            <div class="actions">
              <div class="seg">
                <button class="pill" data-action="like" data-id="${item.id}" aria-pressed="${liked}">${icon(liked ? "likeFilled" : "like")}${liked ? "Liked" : "Like"}</button>
                <button class="pill" data-action="dislike" aria-label="Dislike">${icon("dislike")}</button>
              </div>
              <button class="pill" data-action="share" data-id="${item.id}">${icon("share")}Share</button>
              <button class="pill" data-action="save" data-id="${item.id}">${icon(saved ? "check" : "later")}${saved ? "Saved" : "Save"}</button>
            </div>
          </div>

          <div class="desc" id="desc">
            <div class="desc-top">${views(item)}&nbsp;&nbsp;${when(item)}<span class="desc-tags">${escapeHtml(tags)}</span></div>
            <div class="desc-text" id="desc-text">${paragraphs(item, query)}</div>
            <button class="desc-toggle" id="desc-toggle">Show less</button>
          </div>
        </div>

        <aside class="watch-side">
          <div class="side-head">Up next</div>
          ${others.map((v) => compact(v)).join("")}
        </aside>
      </div>`;
  }

  function reelItem(item, index, query) {
    const liked = Store.has("liked", item.id);
    return `
      <section class="reel-item" data-index="${index}">
        <div class="reel">
          <div class="reel-video loading">
            ${thumb(item, false)}
            ${spinner}
            ${playBtn(item, "big")}
            <div class="reel-overlay">
              <div class="owner-row">
                <a href="${ch().handle}" data-link class="owner-link">${avatar()}<span>${escapeHtml(ch().name)}</span>${verified()}</a>
                <button class="sub-btn" data-action="hire">Hire</button>
              </div>
              <h2 class="reel-title">${escapeHtml(item.title)}</h2>
            </div>
          </div>
          <div class="reel-actions">
            <button data-action="like" data-id="${item.id}" class="${liked ? "on" : ""}" aria-pressed="${liked}"><span class="round">${icon(liked ? "likeFilled" : "like")}</span>Like</button>
            <button data-action="dislike"><span class="round">${icon("dislike")}</span>Dislike</button>
            <button data-action="panel" class="panel-btn"><span class="round">${icon("comment")}</span>About</button>
            <button data-action="share" data-id="${item.id}"><span class="round">${icon("share")}</span>Share</button>
            <button data-menu="${item.id}"><span class="round">${icon("more")}</span></button>
          </div>
        </div>

        <section class="reel-panel">
          <div class="panel-head">Description<button class="icon-btn" data-action="panel" aria-label="Close">${icon("close")}</button></div>
          <div class="panel-body">
            <h3>${escapeHtml(item.title)}</h3>
            ${item.subtitle ? `<p class="panel-sub">${escapeHtml(item.subtitle)}</p>` : ""}
            <div class="panel-stats">
              <div><strong>${escapeHtml(item.views)}</strong><span>${item.views === "1" ? "View" : "Views"}</span></div>
              <div><strong>${when(item)}</strong><span>Uploaded</span></div>
            </div>
            ${paragraphs(item, query)}
          </div>
        </section>
      </section>`;
  }

  // `query` highlights search words in the item the search opened
  function shorts(index, query) {
    return `
      <div class="shorts-page">
        <div class="reel-scroller" id="reel-scroller">
          ${window.SHORTS.map((s, i) => reelItem(s, i, i === index ? query : "")).join("")}
        </div>
        <div class="reel-nav">
          <button class="icon-btn" data-reel="-1" aria-label="Previous">${icon("up")}</button>
          <button class="icon-btn" data-reel="1" aria-label="Next">${icon("down")}</button>
        </div>
      </div>`;
  }

  const CHANNEL_TABS = [["home", "Home"], ["beliefs", "Beliefs"], ["work", "Work"]];

  function channel(tab) {
    const c = ch();
    const count = window.VIDEOS.length + window.SHORTS.length;
    const tabs = CHANNEL_TABS
      .map(([k, label]) => `<button class="tab ${tab === k ? "active" : ""}" data-tab="${k}">${label}</button>`)
      .join("");
    let body = "";
    if (tab !== "work") {
      body += `<section class="shelf">${tab === "home" ? `<h2 class="shelf-head">Beliefs</h2>` : ""}<div class="video-grid">${window.VIDEOS.map((v) => videoCard(v)).join("")}</div></section>`;
    }
    if (tab !== "beliefs") {
      body += `<section class="shelf">${tab === "home" ? `<h2 class="shelf-head">${icon("shorts")}${escapeHtml(window.SHORTS_SHELF_TITLE)}</h2>` : ""}<div class="shorts-grid">${window.SHORTS.map((v) => shortCard(v)).join("")}</div></section>`;
    }
    return `
      <div class="channel">
        <div class="banner"><img src="${c.banner}" alt=""></div>
        <div class="chan-head">
          ${avatar()}
          <div>
            <h1>${escapeHtml(c.name)}${verified()}</h1>
            <p class="chan-meta"><strong>${escapeHtml(c.handle)}</strong><span class="dot"></span>${count} videos</p>
            <p class="chan-desc">${escapeHtml(c.tagline)}</p>
            <div class="chan-btns">
              <button class="pill dark" data-action="hire">Hire</button>
            </div>
          </div>
        </div>
        <div class="tabs">${tabs}</div>
        ${body}
      </div>`;
  }

  function library(kind) {
    const titles = { history: "Watch history", later: "Watch later", liked: "Liked videos" };
    const ids = Store.get(kind, []);
    const items = ids.map(byId).filter(Boolean);
    const clear = kind === "history" && items.length
      ? `<div class="lib-actions"><button class="pill" data-action="clear-history">${icon("trash")}Clear all watch history</button></div>`
      : "";
    const list = items.length
      ? items.map((i) => row(i)).join("")
      : empty("Nothing here yet", kind === "history" ? "Videos you open will show up here." : kind === "later" ? "Use Save on a video to keep it for later." : "Videos you like will show up here.");
    return `<div class="library"><h1>${titles[kind]}</h1>${clear}${list}</div>`;
  }

  return { home, results, watch, shorts, channel, library, byId, href, avatar, viewerAvatar };
})();
