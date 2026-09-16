// Everything on the site that is words or pictures lives in this file.
// To change what a video says when it's opened, edit its `text` array -
// one string per paragraph. Search picks up the new text automatically.

// The channel whose videos these are.
window.CHANNEL = {
  name: "Hitansh Bhutani",
  shortName: "Hitansh",
  handle: "@hitanshbhutani",
  initials: "HB",
  avatar: "img/channel-avatar.jpg",
  banner: "img/banner.jpg",
  tagline: "Screenwriter, director, editor and video essayist.",
  email: "hitansh.bhutani@gmail.com",
  phone: "+91-9810504325",
};

// The account shown as signed in, top right.
window.VIEWER = {
  name: "District",
  handle: "@districtculture",
  avatar: "img/viewer-avatar.jpg",
};

// `uploaded` is shown as written. Leave it null to work it out from `published`.
window.VIDEOS = [
  {
    id: "mission",
    type: "video",
    title: "Mission",
    uploaded: "Tomorrow",
    thumbnail: "img/mission.jpg",
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
    uploaded: "19 Years Ago",
    thumbnail: "img/origin.jpg",
    tags: ["film", "writing", "debate"],
    text: [
      "PLACEHOLDER - paste the Origin text here.",
      "Before any filmmaking I did competitive debate and Model UN for years: national debate champion in 2021, Team India, 32 conferences and 13 best delegate awards.",
    ],
  },
];

window.SHORTS_SHELF_TITLE = "Work";

// `fit: "contain"` shows the whole picture instead of cropping it to fill.
window.SHORTS = [
  {
    id: "parallaxis",
    type: "short",
    title: "Parallaxis",
    subtitle: "Jun 2026 - now",
    uploaded: null,
    published: "2026-06-01",
    thumbnail: "img/parallaxis.jpg",
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
    uploaded: "1 Year Ago",
    thumbnail: "img/maya.jpg",
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
    uploaded: "2 Years Later",
    thumbnail: "img/academic.jpg",
    tags: ["education", "debate"],
    text: [
      "PLACEHOLDER - paste the Academic text here.",
      "BBA in Digital Business and Entrepreneurship at IIM Bangalore. International Baccalaureate diploma from Hiranandani Upscale School, Chennai.",
    ],
  },
  {
    id: "film",
    type: "short",
    title: "Film",
    subtitle: "Chennai",
    uploaded: "2 to 4 Years Ago",
    thumbnail: "img/film.webp",
    fit: "contain",
    tags: ["film", "directing", "writing", "editing"],
    text: [
      "PLACEHOLDER - paste the Film text here.",
      "A 23-page non-linear short film, written, directed and edited in Chennai, from storyboards through to ADR and foley.",
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
