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
    const base = item.type === "short" ? "shorts/" + item.id : "watch?v=" + item.id;
    if (!query) return base;
    return base + (item.type === "short" ? "?q=" : "&q=") + encodeURIComponent(query);
  };

  function avatar(size = "") {
    const c = ch();
    if (c.avatar) return `<img class="avatar ${size}" src="${c.avatar}" alt="">`;
    return `<span class="avatar ${size}" aria-hidden="true">${escapeHtml(c.initials)}</span>`;
  }

  function ago(dateStr) {
    const then = new Date(dateStr + "T00:00:00");
    const secs = Math.max(0, (Date.now() - then.getTime()) / 1000);
    const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600]];
    for (const [name, s] of units) {
      const n = Math.floor(secs / s);
      if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  }

  const fmtDate = (d) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const readLine = (item) => `${Search.readMinutes(item)} min read`;

  // ---- drawn artwork ----
  function art(item) {
    if (item.thumbnail) return `<img src="${item.thumbnail}" alt="" loading="lazy">`;
    const t = escapeHtml(item.title);
    switch (item.art) {
      case "mission":
        return `<div class="art art-mission art-grain"><div class="frame"></div><div class="rec">REC</div><div class="word">${t}</div></div>`;
      case "origin":
        return `<div class="art art-origin art-grain"><div class="sun"></div><div class="ground"></div><div class="word">${t}</div><div class="stamp">NEW DELHI</div></div>`;
      case "parallaxis":
        return `<div class="art art-short art-parallaxis art-grain"><div class="layer"></div><div class="layer"></div><div class="layer"></div><div class="kicker">${escapeHtml(item.subtitle || "")}</div><div class="word">${t}</div></div>`;
      case "maya":
        return `<div class="art art-short art-maya art-grain"><div class="rings"></div><div class="kicker">${escapeHtml(item.subtitle || "")}</div><div class="word">${t}</div></div>`;
      case "academic":
        return `<div class="art art-short art-academic"><div class="rules"></div><div class="note">A+</div><div class="kicker">${escapeHtml(item.subtitle || "")}</div><div class="word">${t}</div></div>`;
      default:
        return `<div class="art art-short art-parallaxis"><div class="word">${t}</div></div>`;
    }
  }

  const menuBtn = (item) =>
    `<button class="icon-btn card-menu" data-menu="${item.id}" aria-label="Action menu">${icon("more")}</button>`;

  // ---- cards ----
  function videoCard(item) {
    return `
      <div class="card">
        <a class="card-link" href="${href(item)}" data-link>
          <div class="thumb">${art(item)}<span class="badge">${Search.duration(item)}</span>${watchedBar(item)}</div>
        </a>
        <div class="details">
          <a href="${ch().handle}" data-link aria-label="${escapeHtml(ch().name)}">${avatar()}</a>
          <div>
            <a href="${href(item)}" data-link><h3 class="v-title">${escapeHtml(item.title)}</h3></a>
            <div class="v-meta"><a href="${ch().handle}" data-link>${escapeHtml(ch().name)}</a></div>
            <div class="v-meta">${readLine(item)}<span class="dot"></span>${ago(item.published)}</div>
          </div>
          ${menuBtn(item)}
        </div>
      </div>`;
  }

  function shortCard(item, query) {
    return `
      <div class="short-card">
        <a href="${href(item, query)}" data-link>
          <div class="short-thumb">${art(item)}</div>
        </a>
        <div class="short-meta">
          <a href="${href(item, query)}" data-link><h3 class="v-title">${escapeHtml(item.title)}</h3></a>
          <div class="v-meta">${escapeHtml(item.subtitle || ago(item.published))}</div>
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
        <a class="thumb-link" href="${link}" data-link style="display:contents">
          <div class="thumb">${art(item)}<span class="badge">${isShort ? "SHORTS" : Search.duration(item)}</span></div>
        </a>
        <div class="row-body">
          <a href="${link}" data-link><h3 class="row-title">${escapeHtml(item.title)}</h3></a>
          <div class="v-meta" style="font-size:12px;line-height:18px">${readLine(item)}<span class="dot"></span>${ago(item.published)}</div>
          <a class="row-channel" href="${ch().handle}" data-link>${avatar()}<span>${escapeHtml(ch().name)}</span></a>
          <p class="row-snippet">${snippet}</p>
          ${isShort ? `<span class="row-tag">${escapeHtml(item.subtitle || "Short")}</span>` : ""}
          ${menuBtn(item)}
        </div>
      </div>`;
  }

  function compact(item) {
    return `
      <div class="compact ${item.type === "short" ? "is-short" : ""}">
        <a href="${href(item)}" data-link style="display:contents">
          <div class="thumb">${art(item)}<span class="badge">${item.type === "short" ? "SHORTS" : Search.duration(item)}</span></div>
        </a>
        <div class="compact-body">
          <a href="${href(item)}" data-link><h3 class="compact-title">${escapeHtml(item.title)}</h3></a>
          <div class="v-meta">${escapeHtml(ch().name)}</div>
          <div class="v-meta">${readLine(item)}<span class="dot"></span>${ago(item.published)}</div>
          ${menuBtn(item)}
        </div>
      </div>`;
  }

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
    if (shorts.length) {
      body += `
        <section class="shelf" ${videos.length ? "" : 'style="border-top:0;margin-top:0;padding-top:0"'}>
          <h2 class="shelf-head">${icon("shorts")}${escapeHtml(window.SHORTS_SHELF_TITLE)}</h2>
          <div class="shorts-grid">${shorts.map((v) => shortCard(v)).join("")}</div>
        </section>`;
    }
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
    // shorts go in a shelf after the first long video, the way the real results page mixes them
    videos.forEach((v, i) => {
      html += row(v, query);
      if (i === 0 && shorts.length) html += shortsShelf(shorts, query);
    });
    if (!videos.length) html += shorts.map((s) => row(s, query)).join("");
    return html + "</div>";
  }

  function shortsShelf(shorts, query) {
    return `
      <section class="shelf">
        <h2 class="shelf-head">${icon("shorts")}Shorts</h2>
        <div class="shorts-grid">${shorts.map((s) => shortCard(s, query)).join("")}</div>
      </section>`;
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
    const subbed = Store.get("subscribed", false);
    const saved = Store.has("later", item.id);
    const tags = item.tags.map((t) => "#" + t.replace(/-/g, "")).join(" ");
    return `
      <div class="watch">
        <div class="watch-main">
          <div class="player" id="player">
            ${art(item)}
            <button class="player-play" id="player-play" aria-label="Read">${icon("play")}</button>
            <div class="player-bar">
              <div class="scrub"><i id="scrub" style="width:0%"></i></div>
              <div class="controls">
                <button class="icon-btn" id="ctl-play" aria-label="Read">${icon("play")}</button>
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
              <div>
                <a href="${ch().handle}" data-link class="owner-name">${escapeHtml(ch().name)}</a>
                <div class="owner-sub">${escapeHtml(ch().location)}</div>
              </div>
              <button class="pill ${subbed ? "" : "dark"}" data-action="subscribe">${subbed ? icon("bell") + "Subscribed" : "Subscribe"}</button>
            </div>
            <div class="actions">
              <div class="seg">
                <button class="pill" data-action="like" data-id="${item.id}" aria-pressed="${liked}">${icon(liked ? "likeFilled" : "like")}${liked ? "Liked" : "Like"}</button>
                <button class="pill" data-action="dislike" aria-label="Dislike">${icon("dislike")}</button>
              </div>
              <button class="pill" data-action="share" data-id="${item.id}">${icon("share")}Share</button>
              <button class="pill" data-action="save" data-id="${item.id}">${icon(saved ? "check" : "later")}${saved ? "Saved" : "Save"}</button>
              <button class="pill" data-action="email" style="padding:0 10px" aria-label="Email">${icon("mail")}</button>
            </div>
          </div>

          <div class="desc" id="desc">
            <div class="desc-top">${readLine(item)}&nbsp;&nbsp;${fmtDate(item.published)}<span class="desc-tags">${escapeHtml(tags)}</span></div>
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

  function shorts(item, index, query) {
    const liked = Store.has("liked", item.id);
    const subbed = Store.get("subscribed", false);
    const total = window.SHORTS.length;
    return `
      <div class="shorts-page">
        <div class="reel">
          <div class="reel-video">
            ${art(item)}
            <div class="reel-overlay">
              <div class="owner-row">
                <a href="${ch().handle}" data-link style="display:flex;align-items:center;gap:8px">${avatar()}<span>${escapeHtml(ch().handle)}</span></a>
                <button class="sub-btn ${subbed ? "on" : ""}" data-action="subscribe">${subbed ? "Subscribed" : "Subscribe"}</button>
              </div>
              <h1>${escapeHtml(item.title)}</h1>
            </div>
          </div>
          <div class="reel-actions">
            <button data-action="like" data-id="${item.id}" class="${liked ? "on" : ""}" aria-pressed="${liked}"><span class="round">${icon(liked ? "likeFilled" : "like")}</span>Like</button>
            <button data-action="dislike"><span class="round">${icon("dislike")}</span>Dislike</button>
            <button data-action="panel" class="on" id="panel-btn"><span class="round">${icon("comment")}</span>About</button>
            <button data-action="share" data-id="${item.id}"><span class="round">${icon("share")}</span>Share</button>
            <button data-menu="${item.id}"><span class="round">${icon("more")}</span></button>
          </div>
        </div>

        <section class="reel-panel" id="reel-panel">
          <div class="panel-head">Description<button class="icon-btn" data-action="panel" aria-label="Close">${icon("close")}</button></div>
          <div class="panel-body">
            <h2>${escapeHtml(item.title)}</h2>
            <div class="panel-stats">
              <div><strong>${Search.readMinutes(item)} min</strong><span>Read</span></div>
              <div><strong>${escapeHtml(item.subtitle ? item.subtitle.split(",")[0] : "")}</strong><span>Where</span></div>
              <div><strong>${new Date(item.published + "T00:00:00").getFullYear()}</strong><span>Since</span></div>
            </div>
            ${paragraphs(item, query)}
          </div>
        </section>

        <div class="reel-nav">
          <button class="icon-btn" data-reel="${index - 1}" ${index === 0 ? "disabled" : ""} aria-label="Previous short">${icon("up")}</button>
          <button class="icon-btn" data-reel="${index + 1}" ${index === total - 1 ? "disabled" : ""} aria-label="Next short">${icon("down")}</button>
        </div>
      </div>`;
  }

  function channel(tab) {
    const c = ch();
    const subbed = Store.get("subscribed", false);
    const count = window.VIDEOS.length + window.SHORTS.length;
    const tabs = [["home", "Home"], ["videos", "Videos"], ["shorts", "Shorts"]]
      .map(([k, label]) => `<button class="tab ${tab === k ? "active" : ""}" data-tab="${k}">${label}</button>`)
      .join("");
    let body = "";
    if (tab !== "shorts") {
      body += `<section class="shelf">${tab === "home" ? `<h2 class="shelf-head">Videos</h2>` : ""}<div class="video-grid">${window.VIDEOS.map((v) => videoCard(v)).join("")}</div></section>`;
    }
    if (tab !== "videos") {
      body += `<section class="shelf">${tab === "home" ? `<h2 class="shelf-head">${icon("shorts")}${escapeHtml(window.SHORTS_SHELF_TITLE)}</h2>` : ""}<div class="shorts-grid">${window.SHORTS.map((v) => shortCard(v)).join("")}</div></section>`;
    }
    return `
      <div class="channel">
        <div class="banner"><div class="art art-grain"><div class="banner-word">${escapeHtml(c.name)}</div><div class="banner-strip"><span style="background:#d9a441"></span><span style="background:#e56b3f"></span><span style="background:#0e2830"></span><span style="background:#f1ece0"></span></div></div></div>
        <div class="chan-head">
          ${avatar()}
          <div>
            <h1>${escapeHtml(c.name)}</h1>
            <p class="chan-meta"><strong>${escapeHtml(c.handle)}</strong><span class="dot"></span>${count} videos<span class="dot"></span>${escapeHtml(c.location)}</p>
            <p class="chan-desc">${escapeHtml(c.tagline)}</p>
            <div class="chan-btns">
              <button class="pill ${subbed ? "" : "dark"}" data-action="subscribe">${subbed ? icon("bell") + "Subscribed" : "Subscribe"}</button>
              <button class="pill" data-action="email">${icon("mail")}Email</button>
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

  return { home, results, watch, shorts, channel, library, byId, href, avatar, art, ago };
})();
