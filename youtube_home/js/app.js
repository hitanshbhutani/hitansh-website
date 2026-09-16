// Router, header, side menu, search box, menus and page behaviour.

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const page = $("#page");
  const body = document.body;
  const C = window.CHANNEL;

  // ---------- header icons ----------
  $("#guide-toggle").innerHTML = icon("menu");
  $("#search-back").innerHTML = icon("back");
  $(".search-inner-icon").innerHTML = icon("search");
  $("#search-clear").innerHTML = icon("close");
  $(".search-btn").innerHTML = icon("search");
  $("#mic-btn").innerHTML = icon("mic");
  $("#search-open").innerHTML = icon("search");
  $(".create-icon").innerHTML = icon("add");
  $("#bell-btn").insertAdjacentHTML("afterbegin", icon("bell"));
  $("#avatar-btn").innerHTML = V.viewerAvatar();
  $(".avatar-btn .avatar").style.cssText = "width:32px;height:32px";
  const channelLabel = `View ${escapeHtml(C.shortName)}'s channel`;

  // ---------- side menu ----------
  function renderGuide() {
    const item = (path, ic, label, key) =>
      `<a class="guide-item" href="${path}" data-link data-key="${key}">${icon(ic)}<span>${label}</span></a>`;

    $("#guide").innerHTML = `
      <div class="drawer-head">
        <button class="icon-btn" data-action="close-drawer" aria-label="Close menu">${icon("menu")}</button>
        ${$(".logo").outerHTML}
      </div>
      <div class="guide-section">
        ${item("./", "home", "Home", "home")}
        ${item("work", "shorts", "Work", "work")}
      </div>
      <div class="guide-section">
        <a class="guide-title" href="${C.handle}" data-link>Channel ${icon("chevron")}</a>
        ${item(C.handle, "you", `${escapeHtml(C.shortName)}'s channel`, "channel")}
        ${item("feed/history", "history", "History", "history")}
        ${item("playlist?list=WL", "later", "Watch later", "later")}
        ${item("playlist?list=LL", "like", "Liked videos", "liked")}
      </div>
      <div class="guide-footer">
        <p>&copy; ${new Date().getFullYear()} ${escapeHtml(C.name)}</p>
      </div>`;

    const mini = (path, ic, label, key) =>
      `<a class="mini-item" href="${path}" data-link data-key="${key}">${icon(ic)}<span>${label}</span></a>`;
    $("#mini-guide").innerHTML =
      mini("./", "home", "Home", "home") +
      mini("work", "shorts", "Work", "work") +
      mini(C.handle, "you", "Channel", "channel");
  }

  function markGuide(key) {
    document.querySelectorAll("[data-key]").forEach((a) => {
      const on = a.dataset.key === key;
      a.classList.toggle("active", on);
      if (a.dataset.key === "home") a.querySelector("path").setAttribute("d", ICON_PATHS[on ? "homeFilled" : "home"]);
    });
  }

  const wide = () => window.innerWidth >= 1313;

  function closeDrawer() {
    body.classList.remove("drawer-open");
    $("#scrim").hidden = true;
  }

  $("#guide-toggle").addEventListener("click", () => {
    if (wide() && !body.classList.contains("no-guide")) {
      body.classList.toggle("guide-collapsed");
      Store.set("guideCollapsed", body.classList.contains("guide-collapsed"));
    } else {
      body.classList.add("drawer-open");
      $("#scrim").hidden = false;
    }
  });
  $("#scrim").addEventListener("click", closeDrawer);
  if (Store.get("guideCollapsed", false)) body.classList.add("guide-collapsed");

  // ---------- router ----------
  // Links are relative to <base>, which is "/" on Vercel and the repo
  // sub-folder on GitHub Pages. Routes are matched without that prefix.
  const BASE = new URL(document.baseURI).pathname;

  function routePath() {
    const p = location.pathname;
    const rest = p.startsWith(BASE) ? p.slice(BASE.length) : p.replace(/^\/+/, "");
    return ("/" + decodeURIComponent(rest)).replace(/\/+$/, "") || "/";
  }

  // GitHub Pages has no rewrites, so 404.html bounces deep links here as ?redirect=
  const redirect = new URLSearchParams(location.search).get("redirect");
  if (redirect) history.replaceState({}, "", redirect.replace(/^[/\\]+/, ""));

  // how long a video takes to "start" after it's clicked or scrolled to
  const VST = 800;
  let playerTimer = 0;
  let reelTimer = 0;
  let reelObserver = null;

  // the thin red bar across the top while a video page loads
  let progressTimer = 0;
  function navProgress() {
    const bar = $("#nav-progress");
    clearTimeout(progressTimer);
    bar.classList.remove("run", "done");
    void bar.offsetWidth;
    bar.classList.add("run");
    progressTimer = setTimeout(() => bar.classList.replace("run", "done"), VST);
  }

  function go(url, replace = false) {
    closeDrawer();
    closePopup();
    if (new URL(url, document.baseURI).href === location.href) replace = true;
    history[replace ? "replaceState" : "pushState"]({}, "", url);
    render();
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-link]");
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(a.getAttribute("href"));
  });

  window.addEventListener("popstate", () => render());

  // `instant` skips the loading delay, for redraws that aren't a new video
  function render({ instant = false } = {}) {
    clearTimeout(playerTimer);
    clearTimeout(reelTimer);
    if (reelObserver) reelObserver.disconnect();
    reelObserver = null;

    const path = routePath();
    const q = new URLSearchParams(location.search);
    const query = q.get("q") || "";
    let key = "";
    let title = C.name;
    body.classList.remove("no-guide", "search-mode");

    if (path === "/" || path === "/index.html") {
      const tag = q.get("tag") || null;
      page.innerHTML = V.home(tag);
      key = "home";
    } else if (path === "/results") {
      const sq = q.get("search_query") || "";
      setSearchValue(sq);
      page.innerHTML = V.results(sq);
      title = sq + " - " + C.name;
    } else if (path === "/watch" && V.byId(q.get("v"))) {
      const item = V.byId(q.get("v"));
      body.classList.add("no-guide");
      page.innerHTML = V.watch(item, query);
      Store.push("history", item.id);
      title = item.title + " - " + C.name;
      setupWatch(item, instant);
      if (!instant) navProgress();
    } else if (/^\/(work|shorts)(\/|$)/.test(path) && (!path.split("/")[2] || V.byId(path.split("/")[2]))) {
      // old /shorts/ links still open, under their /work/ address
      const id = path.split("/")[2] || window.SHORTS[0].id;
      if (path !== "/work/" + id) history.replaceState({}, "", "work/" + id + location.search);
      const index = window.SHORTS.findIndex((s) => s.id === id);
      page.innerHTML = V.shorts(index, query);
      key = "work";
      title = window.SHORTS[index].title + " - " + C.name;
      setupReels(index, instant);
      if (!instant) navProgress();
    } else if (path.startsWith("/" + C.handle)) {
      const tab = path.split("/")[2] || "home";
      page.innerHTML = V.channel(["beliefs", "work"].includes(tab) ? tab : "home");
      key = "channel";
    } else if (path === "/feed/history") {
      page.innerHTML = V.library("history");
      key = "history";
      title = "History - " + C.name;
    } else if (path === "/playlist" && ["WL", "LL"].includes(q.get("list"))) {
      const kind = q.get("list") === "WL" ? "later" : "liked";
      page.innerHTML = V.library(kind);
      key = kind;
    } else {
      page.innerHTML = `<div class="empty"><div class="big">${icon("search")}</div><h2>This page isn't available</h2><p>Sorry about that. <a href="./" data-link style="color:var(--link)">Go back home</a></p></div>`;
    }

    if (path !== "/results") setSearchValue("");
    markGuide(key);
    document.title = title;
    window.scrollTo(0, 0);
  }

  // ---------- watch page ----------
  function setupWatch(item, instant) {
    const player = $("#player");
    if (!instant) {
      player.classList.add("loading");
      playerTimer = setTimeout(() => player.classList.remove("loading"), VST);
    }
    const desc = $("#desc");
    const toggle = $("#desc-toggle");
    const text = $("#desc-text");
    const scrub = $("#scrub");
    const now = $("#time-now");

    const collapse = (on) => {
      desc.classList.toggle("clamped", on);
      toggle.textContent = on ? "...more" : "Show less";
    };
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      collapse(!desc.classList.contains("clamped"));
    });
    desc.addEventListener("click", () => desc.classList.contains("clamped") && collapse(false));

    const toText = () => {
      collapse(false);
      const top = desc.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    };
    $("#player-play").addEventListener("click", toText);
    $("#ctl-play").addEventListener("click", toText);
    $("#player .thumb-img").addEventListener("click", toText);

    const all = [...window.VIDEOS, ...window.SHORTS];
    const next = all[(all.findIndex((x) => x.id === item.id) + 1) % all.length];
    $("#ctl-next").addEventListener("click", () => go(V.href(next)));
    $("#ctl-full").addEventListener("click", () => {
      const p = $("#player");
      if (document.fullscreenElement) document.exitFullscreen();
      else if (p.requestFullscreen) p.requestFullscreen();
    });

    // the red bar follows how far through the text you've scrolled
    const [m, s] = Search.duration(item).split(":").map(Number);
    const total = m * 60 + s;
    const onScroll = () => {
      if (!document.body.contains(text)) return window.removeEventListener("scroll", onScroll);
      const r = text.getBoundingClientRect();
      const seen = (window.innerHeight - r.top) / (r.height || 1);
      const pct = Math.min(1, Math.max(0, seen));
      scrub.style.width = pct * 100 + "%";
      const t = Math.round(pct * total);
      now.textContent = Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const firstMark = text.querySelector("mark");
    if (firstMark) setTimeout(() => firstMark.scrollIntoView({ block: "center", behavior: "smooth" }), 150);
  }

  // the description sits beside each item on wide screens, and slides over it on small ones
  const panelSideBySide = () => window.innerWidth > 1100;

  function togglePanel() {
    const feed = $(".shorts-page");
    if (!feed) return;
    const open = feed.classList.toggle("panel-open");
    if (panelSideBySide()) Store.set("panelHidden", !open);
  }

  function setupReels(startIndex, instant) {
    const feed = $(".shorts-page");
    const scroller = $("#reel-scroller");
    const items = [...scroller.querySelectorAll(".reel-item")];
    feed.classList.toggle("panel-open", panelSideBySide() && !Store.get("panelHidden", false));
    scroller.scrollTop = items[startIndex].offsetTop;

    let active = -1;
    const activate = (i, skipDelay) => {
      if (i === active) return;
      active = i;
      const item = window.SHORTS[i];
      clearTimeout(reelTimer);
      items.forEach((el) => el.querySelector(".reel-video").classList.add("loading"));
      const video = items[i].querySelector(".reel-video");
      if (skipDelay) video.classList.remove("loading");
      else reelTimer = setTimeout(() => video.classList.remove("loading"), VST);

      if (routePath() !== "/work/" + item.id) history.replaceState({}, "", "work/" + item.id);
      document.title = item.title + " - " + C.name;
      Store.push("history", item.id);
      feed.querySelector('[data-reel="-1"]').disabled = i === 0;
      feed.querySelector('[data-reel="1"]').disabled = i === items.length - 1;
    };

    // One wheel notch or one trackpad swipe moves exactly one item. A trackpad keeps
    // sending wheel events after the fingers lift, so that tail counts as the same swipe.
    // Touch screens are left to the browser's own snap scrolling.
    let wheelSum = 0;
    let lastWheel = 0;
    let lockUntil = 0;
    scroller.addEventListener("wheel", (e) => {
      if (e.ctrlKey || e.target.closest(".reel-panel") || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      if (now < lockUntil) {
        if (gap < 120) lockUntil = Math.max(lockUntil, now + 120);
        return;
      }
      if (gap > 300) wheelSum = 0;
      wheelSum += e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
      if (Math.abs(wheelSum) >= 30) {
        scrollReel(Math.sign(wheelSum));
        wheelSum = 0;
        lockUntil = now + 500;
      }
    }, { passive: false });

    activate(startIndex, instant);
    reelObserver = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && activate(+en.target.dataset.index)),
      { root: scroller, threshold: 0.6 }
    );
    items.forEach((el) => reelObserver.observe(el));
  }

  function scrollReel(dir) {
    const scroller = $("#reel-scroller");
    if (scroller) scroller.scrollBy({ top: dir * scroller.clientHeight, behavior: "smooth" });
  }

  // ---------- actions ----------
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  async function share(item) {
    const url = new URL(V.href(item), document.baseURI).href;
    if (navigator.share && matchMedia("(hover: none)").matches) {
      try { await navigator.share({ title: item.title, url }); return; } catch (e) { return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard");
    } catch (e) {
      toast(url);
    }
  }

  function showLiked(btn, on) {
    btn.setAttribute("aria-pressed", on);
    if (btn.closest(".reel-actions")) {
      btn.classList.toggle("on", on);
      btn.querySelector(".round").innerHTML = icon(on ? "likeFilled" : "like");
    } else {
      btn.innerHTML = icon(on ? "likeFilled" : "like") + (on ? "Liked" : "Like");
    }
  }

  document.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-chip]");
    if (chip) {
      const tag = chip.dataset.chip;
      return go(tag ? "./?tag=" + tag : "./");
    }

    const tab = e.target.closest("[data-tab]");
    if (tab) return go(C.handle + (tab.dataset.tab === "home" ? "" : "/" + tab.dataset.tab));

    const reel = e.target.closest("[data-reel]");
    if (reel) return reel.disabled || scrollReel(+reel.dataset.reel);

    const menu = e.target.closest("[data-menu]");
    if (menu) {
      e.stopPropagation();
      return openCardMenu(menu);
    }

    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const item = btn.dataset.id && V.byId(btn.dataset.id);

    switch (btn.dataset.action) {
      case "hire":
        openHire();
        break;
      case "like": {
        const on = Store.toggle("liked", item.id);
        toast(on ? "Added to Liked videos" : "Removed from Liked videos");
        showLiked(btn, on);
        break;
      }
      case "dislike":
        toast("Thanks for the feedback");
        break;
      case "share":
        share(item);
        break;
      case "save": {
        const on = Store.toggle("later", item.id);
        toast(on ? "Saved to Watch later" : "Removed from Watch later");
        btn.innerHTML = icon(on ? "check" : "later") + (on ? "Saved" : "Save");
        break;
      }
      case "panel":
        togglePanel();
        break;
      case "clear-history":
        Store.set("history", []);
        toast("Watch history cleared");
        render({ instant: true });
        break;
      case "close-drawer":
        closeDrawer();
        break;
    }
  });

  // ---------- popups ----------
  const popup = $("#popup");
  let popupOwner = null;

  function openPopup(anchor, html, align = "right") {
    if (popupOwner === anchor) return closePopup();
    closePopup();
    popup.innerHTML = html;
    popup.hidden = false;
    popupOwner = anchor;
    anchor.classList.add("open");
    const r = anchor.getBoundingClientRect();
    const w = popup.offsetWidth;
    const h = popup.offsetHeight;
    let left = align === "right" ? r.right - w : r.left;
    left = Math.min(Math.max(12, left), window.innerWidth - w - 12);
    let top = r.bottom + 4;
    if (top + h > window.innerHeight - 12) top = Math.max(60, r.top - h - 4);
    popup.style.left = left + "px";
    popup.style.top = top + "px";
  }

  function closePopup() {
    popup.hidden = true;
    if (popupOwner) popupOwner.classList.remove("open");
    popupOwner = null;
  }

  document.addEventListener("click", (e) => {
    if (!popup.hidden && !popup.contains(e.target) && !(popupOwner && popupOwner.contains(e.target))) closePopup();
  });
  window.addEventListener("resize", closePopup);
  window.addEventListener("scroll", () => popupOwner && popupOwner.closest(".card, .short-card, .row, .compact") && closePopup(), { passive: true });

  popup.addEventListener("click", (e) => {
    const el = e.target.closest("[data-pop]");
    if (!el) return;
    const [kind, value] = el.dataset.pop.split(":");
    if (kind === "later") {
      const on = Store.toggle("later", value);
      toast(on ? "Saved to Watch later" : "Removed from Watch later");
    } else if (kind === "share") {
      share(V.byId(value));
    } else if (kind === "theme") {
      setTheme(value);
    } else if (kind === "theme-open") {
      e.stopPropagation();
      return openThemeMenu(popupOwner, true);
    }
    closePopup();
  });

  const popItem = (ic, label, attr) =>
    `<button class="pop-item" ${attr}>${ic ? icon(ic) : `<span class="icon spacer"></span>`}<span>${label}</span></button>`;

  function openCardMenu(btn) {
    const id = btn.dataset.menu;
    const saved = Store.has("later", id);
    openPopup(
      btn,
      popItem("later", saved ? "Remove from Watch later" : "Save to Watch later", `data-pop="later:${id}"`) +
        popItem("share", "Share", `data-pop="share:${id}"`),
      "right"
    );
  }

  $("#create-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    openPopup(
      e.currentTarget,
      `<a class="pop-item" href="${C.handle}" data-link>${icon("you")}<span>${channelLabel}</span></a>`
    );
  });

  $("#bell-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    openPopup(
      e.currentTarget,
      `<div class="pop-title">Notifications</div><div class="pop-sep" style="margin-top:0"></div>
       <div class="notif-empty">${icon("bell")}<strong>Your notifications live here</strong><span>Subscribe to your favorite channels to receive notifications about their latest videos.</span></div>`
    );
  });

  $("#avatar-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    openPopup(
      e.currentTarget,
      `<div class="pop-head">${V.viewerAvatar()}<div><strong>${escapeHtml(window.VIEWER.name)}</strong><small>${escapeHtml(window.VIEWER.handle)}</small><a href="${C.handle}" data-link>${channelLabel}</a></div></div>
       <div class="pop-sep"></div>
       <a class="pop-item" href="feed/history" data-link>${icon("history")}<span>History</span></a>
       <div class="pop-sep"></div>
       <button class="pop-item" data-pop="theme-open">${icon("theme")}<span>Appearance: ${themeLabel()}</span>${icon("chevron")}</button>`
    );
  });

  // ---------- hire dialog ----------
  const hire = $("#hire-dialog");
  $("#hire-close").innerHTML = icon("close");
  $("#hire-lines").innerHTML = `
    <p>${icon("mail")}<span>E-mail: ${escapeHtml(C.email)}</span></p>
    <p>${icon("phone")}<span>Phone: ${escapeHtml(C.phone)}</span></p>`;

  function openHire() {
    closePopup();
    if (hire.showModal) hire.showModal();
    else hire.setAttribute("open", "");
  }
  const closeHire = () => (hire.close ? hire.close() : hire.removeAttribute("open"));
  $("#hire-close").addEventListener("click", closeHire);
  // a click on the dimmed area outside the box lands on the dialog itself
  hire.addEventListener("click", (e) => {
    if (e.target === hire) closeHire();
  });

  // ---------- theme ----------
  const THEMES = { device: "Use device theme", dark: "Dark theme", light: "Light theme" };
  const currentTheme = () => document.documentElement.dataset.theme || "device";
  const themeLabel = () => ({ device: "Device theme", dark: "Dark", light: "Light" }[currentTheme()]);

  function openThemeMenu(anchor, fromAvatar) {
    const items = Object.entries(THEMES)
      .map(([k, label]) => popItem(currentTheme() === k ? "check" : "", label, `data-pop="theme:${k}"`))
      .join("");
    const html = `<div class="pop-title">Appearance</div><div class="pop-sub" style="padding-top:0">Setting applies to this browser only</div>${items}`;
    if (fromAvatar) {
      popup.innerHTML = html;
      return;
    }
    openPopup(anchor, html, "left");
  }

  function setTheme(k) {
    if (k === "device") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = k;
    try { k === "device" ? localStorage.removeItem("theme") : localStorage.setItem("theme", k); } catch (e) {}
  }

  // ---------- search box ----------
  const form = $("#search-form");
  const input = $("#search-input");
  const list = $("#suggestions");
  const clearBtn = $("#search-clear");
  let active = -1;
  let current = [];

  function setSearchValue(v) {
    input.value = v;
    clearBtn.hidden = !v;
  }

  const recent = () => Store.get("searches", []);

  function showSuggestions() {
    const value = input.value;
    const typed = value.trim().toLowerCase();
    let rows;
    if (!typed) {
      rows = recent().slice(0, 10).map((s) => ({ text: s, recent: true }));
    } else {
      const past = recent().filter((s) => s.toLowerCase().startsWith(typed) && s.toLowerCase() !== typed).slice(0, 3);
      const fresh = Search.suggest(value).filter((s) => !past.map((p) => p.toLowerCase()).includes(s));
      rows = [...past.map((s) => ({ text: s, recent: true })), ...fresh.map((s) => ({ text: s }))].slice(0, 10);
    }
    current = rows;
    active = -1;
    if (!rows.length) return (list.hidden = true);

    list.innerHTML = rows
      .map((r, i) => {
        const t = r.text;
        const lower = t.toLowerCase();
        const label = typed && lower.startsWith(typed)
          ? `<b>${escapeHtml(t.slice(0, typed.length))}</b>${escapeHtml(t.slice(typed.length))}`
          : escapeHtml(t);
        return `<li role="option" data-i="${i}">${icon(r.recent ? "history" : "search")}<span class="s-text">${label}</span>${r.recent ? `<button type="button" class="s-remove" data-remove="${i}">Remove</button>` : ""}</li>`;
      })
      .join("");
    list.hidden = false;
  }

  function highlightRow(i) {
    const items = list.querySelectorAll("li");
    items.forEach((li) => li.classList.remove("active"));
    active = i;
    if (i >= 0 && items[i]) {
      items[i].classList.add("active");
      input.value = current[i].text;
    }
  }

  function submit(value) {
    const v = value.trim();
    list.hidden = true;
    if (!v) return;
    input.blur();
    const past = recent().filter((s) => s.toLowerCase() !== v.toLowerCase());
    Store.set("searches", [v, ...past].slice(0, 20));
    go("results?search_query=" + encodeURIComponent(v));
  }

  let typedValue = "";
  input.addEventListener("input", () => {
    typedValue = input.value;
    clearBtn.hidden = !input.value;
    showSuggestions();
  });
  input.addEventListener("focus", () => {
    form.classList.add("focused");
    typedValue = input.value;
    showSuggestions();
  });
  input.addEventListener("blur", () => {
    form.classList.remove("focused");
    setTimeout(() => (list.hidden = true), 150);
  });

  input.addEventListener("keydown", (e) => {
    const n = current.length;
    if (e.key === "Enter" && !e.isComposing) {
      e.preventDefault();
      submit(input.value);
    } else if (e.key === "ArrowDown" && !list.hidden && n) {
      e.preventDefault();
      if (active === n - 1) { highlightRow(-1); input.value = typedValue; } else highlightRow(active + 1);
    } else if (e.key === "ArrowUp" && !list.hidden && n) {
      e.preventDefault();
      if (active === -1) highlightRow(n - 1);
      else if (active === 0) { highlightRow(-1); input.value = typedValue; } else highlightRow(active - 1);
    } else if (e.key === "Escape") {
      if (!list.hidden) { list.hidden = true; input.value = typedValue; } else input.blur();
    }
  });

  list.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const remove = e.target.closest("[data-remove]");
    if (remove) {
      const text = current[+remove.dataset.remove].text;
      Store.set("searches", recent().filter((s) => s !== text));
      return showSuggestions();
    }
    const li = e.target.closest("li");
    if (li) {
      input.value = current[+li.dataset.i].text;
      submit(input.value);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submit(input.value);
  });

  clearBtn.addEventListener("mousedown", (e) => e.preventDefault());
  clearBtn.addEventListener("click", () => {
    setSearchValue("");
    typedValue = "";
    input.focus();
    showSuggestions();
  });

  // phone: the search icon swaps the header for a full width search box
  $("#search-open").addEventListener("click", () => {
    body.classList.add("search-mode");
    input.focus();
  });
  $("#search-back").addEventListener("click", () => {
    body.classList.remove("search-mode");
    list.hidden = true;
  });

  // voice search where the browser supports it
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  const mic = $("#mic-btn");
  if (!Speech) {
    mic.title = "Voice search isn't supported in this browser";
    mic.addEventListener("click", () => toast("Voice search isn't supported in this browser"));
  } else {
    let rec = null;
    mic.addEventListener("click", () => {
      if (rec) return rec.stop();
      rec = new Speech();
      rec.lang = "en-IN";
      rec.interimResults = true;
      mic.classList.add("listening");
      toast("Listening...");
      rec.onresult = (ev) => {
        const said = [...ev.results].map((r) => r[0].transcript).join("");
        setSearchValue(said);
        if (ev.results[ev.results.length - 1].isFinal) submit(said);
      };
      rec.onerror = () => toast("Didn't catch that. Try again.");
      rec.onend = () => {
        mic.classList.remove("listening");
        rec = null;
      };
      rec.start();
    });
  }

  // ---------- keyboard ----------
  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if (e.key === "/" && !typing) {
      e.preventDefault();
      if (window.innerWidth <= 656) body.classList.add("search-mode");
      input.focus();
      input.select();
    }
    if (e.key === "Escape") {
      closePopup();
      closeDrawer();
      if (hire.open) closeHire();
    }
    if (!typing && $("#reel-scroller") && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      scrollReel(e.key === "ArrowDown" ? 1 : -1);
    }
  });

  // ---------- logo ----------
  // scaleX doesn't take up room, so a margin makes space for the extra width
  function stretchLogo() {
    const word = $("#masthead .logo-word");
    const k = parseFloat(getComputedStyle(word).getPropertyValue("--logo-stretch")) || 1;
    const extra = (k - 1) * word.offsetWidth + "px";
    document.querySelectorAll(".logo-word").forEach((w) => (w.style.marginRight = extra));
  }

  // ---------- start ----------
  renderGuide();
  render();
  stretchLogo();
  document.fonts && document.fonts.ready.then(stretchLogo);
  window.addEventListener("resize", stretchLogo);
})();
