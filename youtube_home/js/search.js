// Search over titles and paragraph text of every video and short.

const Search = (() => {
  const ALL = () => [...window.VIDEOS, ...window.SHORTS];

  const norm = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  const tokenize = (s) => norm(s).match(/[a-z0-9]+/g) || [];

  function fullText(item) {
    return [item.title, item.subtitle || "", ...item.text].join(" ");
  }

  // word -> how many times it appears, for ranking suggestions
  let vocab = null;
  function buildVocab() {
    vocab = new Map();
    for (const item of ALL()) {
      for (const w of tokenize(fullText(item))) {
        if (w.length < 2) continue;
        vocab.set(w, (vocab.get(w) || 0) + 1);
      }
    }
  }

  function scoreItem(item, terms) {
    const titleWords = tokenize(item.title);
    const bodyWords = tokenize(fullText(item));
    let matched = 0;
    let score = 0;
    for (const t of terms) {
      const inTitle = titleWords.some((w) => w.startsWith(t));
      const bodyHits = bodyWords.filter((w) => w.startsWith(t)).length;
      if (inTitle || bodyHits) matched++;
      score += (inTitle ? 10 : 0) + bodyHits;
    }
    // whole phrase appearing as written is worth a lot
    const phrase = terms.join(" ");
    if (terms.length > 1 && norm(fullText(item)).includes(phrase)) score += 20;
    return { matched, score };
  }

  // Every term has to match. If that finds nothing, fall back to any term.
  function run(query) {
    const terms = tokenize(query);
    if (!terms.length) return [];
    const scored = ALL()
      .map((item) => ({ item, ...scoreItem(item, terms) }))
      .filter((r) => r.matched > 0);
    let hits = scored.filter((r) => r.matched === terms.length);
    if (!hits.length) hits = scored;
    return hits.sort((a, b) => b.matched - a.matched || b.score - a.score).map((r) => r.item);
  }

  // Short piece of the text around the first match, with matches wrapped in <b>.
  function snippet(item, query, max = 190) {
    const terms = tokenize(query);
    const body = item.text.join(" ");
    const lower = norm(body);
    let at = -1;
    for (const t of terms) {
      const re = new RegExp("\\b" + t);
      const m = re.exec(lower);
      if (m && (at === -1 || m.index < at)) at = m.index;
    }
    let start = at === -1 ? 0 : Math.max(0, at - 60);
    if (start > 0) {
      const space = body.indexOf(" ", start);
      if (space !== -1 && space < at) start = space + 1;
    }
    let piece = body.slice(start, start + max);
    if (start + max < body.length) piece = piece.replace(/\s+\S*$/, "") + "...";
    if (start > 0) piece = "..." + piece;
    return highlight(piece, terms);
  }

  function highlight(text, terms) {
    if (!terms.length) return escapeHtml(text);
    const re = new RegExp("\\b(?:" + terms.join("|") + ")[a-z0-9]*", "gi");
    let out = "";
    let last = 0;
    for (const m of text.matchAll(re)) {
      out += escapeHtml(text.slice(last, m.index)) + "<b>" + escapeHtml(m[0]) + "</b>";
      last = m.index + m[0].length;
    }
    return out + escapeHtml(text.slice(last));
  }

  // Autocomplete: keep what's typed, finish the last word, then add titles.
  function suggest(query, limit = 10) {
    if (!vocab) buildVocab();
    const raw = norm(query).replace(/\s+/g, " ").trimStart();
    if (!raw.trim()) return [];
    const endsWithSpace = /\s$/.test(raw);
    const words = raw.trim().split(" ");
    const last = endsWithSpace ? "" : words.pop();
    const lead = words.join(" ");
    const out = new Set();

    for (const item of ALL()) {
      if (norm(item.title).startsWith(raw.trim())) out.add(norm(item.title));
    }

    if (last) {
      [...vocab.entries()]
        .filter(([w]) => w.startsWith(last) && w !== last)
        .sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)
        .forEach(([w]) => out.add((lead ? lead + " " : "") + w));
    }

    // phrases from the text that continue what was typed
    const typed = raw.trim();
    if (typed.length > 1) {
      for (const item of ALL()) {
        const words = tokenize(fullText(item));
        for (let i = 0; i < words.length; i++) {
          const phrase2 = words.slice(i, i + 2).join(" ");
          const phrase3 = words.slice(i, i + 3).join(" ");
          if (phrase3.startsWith(typed) && phrase3 !== typed && phrase3.split(" ").length === 3) out.add(phrase3);
          else if (phrase2.startsWith(typed) && phrase2 !== typed) out.add(phrase2);
        }
      }
    }

    return [...out].filter((s) => s !== typed).slice(0, limit);
  }

  return { run, snippet, suggest, highlight, tokenize, invalidate: () => (vocab = null) };
})();

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
