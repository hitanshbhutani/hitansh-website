// Everything on the site that is words lives in this file.
// To change what a video says when it's opened, edit its `text` array -
// one string per paragraph. Search picks up the new text automatically.

window.CHANNEL = {
  name: "Hitansh Bhutani",
  handle: "@hitanshbhutani",
  initials: "HB",
  avatar: null, // e.g. "img/avatar.jpg"
  location: "New Delhi, India",
  tagline: "Screenwriter, director, editor and video essayist.",
  email: "hitansh.bhutani@gmail.com",
};

window.VIDEOS = [
  {
    id: "mission",
    type: "video",
    title: "Mission",
    published: "2026-09-01",
    thumbnail: null, // e.g. "img/mission.jpg" - leave null for the drawn card
    art: "mission",
    tags: ["film", "writing", "directing", "video-essays"],
    text: [
      "PLACEHOLDER - paste the Mission text here.",
      "I write, shoot and cut things. Most of my time right now goes into Parallaxis, a video essay channel about films and why they work.",
    ],
  },
  {
    id: "origin",
    type: "video",
    title: "Origin",
    published: "2026-08-20",
    thumbnail: null,
    art: "origin",
    tags: ["film", "writing", "debate"],
    text: [
      "PLACEHOLDER - paste the Origin text here.",
      "Before any filmmaking I did competitive debate and Model UN for years: national debate champion in 2021, Team India, 32 conferences and 13 best delegate awards.",
    ],
  },
];

window.SHORTS_SHELF_TITLE = "Work";

window.SHORTS = [
  {
    id: "parallaxis",
    type: "short",
    title: "Parallaxis",
    subtitle: "Jun 2026 - now",
    published: "2026-06-01",
    thumbnail: null,
    art: "parallaxis",
    tags: ["film", "video-essays", "editing", "writing"],
    text: [
      "PLACEHOLDER - paste the Parallaxis text here.",
      "A film video essay channel: research, scripting, edit and publishing.",
    ],
  },
  {
    id: "maya",
    type: "short",
    title: "Maya Narrative Universe",
    subtitle: "Department of Lore, Goa",
    published: "2025-08-01",
    thumbnail: null,
    art: "maya",
    tags: ["world-building", "writing", "directing"],
    text: [
      "PLACEHOLDER - paste the Maya Narrative Universe text here.",
      "Thematic structure and world-building mechanics for MAYA, a multi-format narrative universe, at the Department of Lore.",
    ],
  },
  {
    id: "academic",
    type: "short",
    title: "Academic",
    subtitle: "IIM Bangalore, IB Diploma",
    published: "2025-09-01",
    thumbnail: null,
    art: "academic",
    tags: ["education", "debate"],
    text: [
      "PLACEHOLDER - paste the Academic text here.",
      "BBA in Digital Business and Entrepreneurship at IIM Bangalore. International Baccalaureate diploma from Hiranandani Upscale School, Chennai.",
    ],
  },
];

// The chip bar under the header. `tag` matches the tags above.
window.CHIPS = [
  { label: "All", tag: null },
  { label: "Film", tag: "film" },
  { label: "Writing", tag: "writing" },
  { label: "Directing", tag: "directing" },
  { label: "Editing", tag: "editing" },
  { label: "Video essays", tag: "video-essays" },
  { label: "World-building", tag: "world-building" },
  { label: "Debate", tag: "debate" },
  { label: "Education", tag: "education" },
];

// "Subscriptions" in the side menu. Clicking one runs a search for `query`.
window.SUBSCRIPTIONS = [
  { name: "Parallaxis", query: "Parallaxis", color: "#d4a017" },
  { name: "Department of Lore", query: "Maya", color: "#2f6f5e" },
  { name: "IIM Bangalore", query: "IIM Bangalore", color: "#8a3b2e" },
  { name: "Model UN", query: "Model UN", color: "#3a5a8c" },
];
