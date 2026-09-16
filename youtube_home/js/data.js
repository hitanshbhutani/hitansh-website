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
  tagline: "Media for the Future",
  email: "hitansh.bhutani@gmail.com",
  phone: "+91-9810504325",
};

// The account shown as signed in, top right.
window.VIEWER = {
  name: "District Culture",
  handle: "@district.culture",
  avatar: "img/viewer-avatar.jpg",
};

// `views` is shown as written, followed by "views" (or by `viewsLabel` when an item has one).
// `uploaded` is shown in lower case;
// leave it null to work it out from `published`.
window.VIDEOS = [
  {
    id: "mission",
    type: "video",
    title: "Mission",
    views: "8.3B",
    uploaded: "tomorrow",
    thumbnail: "img/mission.jpg",
    tags: ["film", "writing", "directing", "video-essays"],
    text: [
      "PLACEHOLDER - paste the Mission text here.",
      "I write, shoot and cut things. Most of my time right now goes into Parallaxis, a video essay channel about films and why they work.",
    ],
  },
  {
    id: "origins",
    type: "video",
    title: "Origins",
    views: "1",
    uploaded: "19 years ago",
    thumbnail: "img/origin.jpg",
    tags: ["film", "writing", "debate"],
    text: [
      "PLACEHOLDER - paste the Origins text here.",
      "Before any filmmaking I did competitive debate and Model UN for years: national debate champion in 2021, Team India, 32 conferences and 13 best delegate awards.",
    ],
  },
];

window.SHORTS_SHELF_TITLE = "Work";


// `fit: "contain"` shows the whole picture instead of cropping it to fill.
// `url` is where the play button offers to take people; items without one have no play button.
// The `id` is the last part of the address: /work/<id> here, /worldview/<id> above.
window.SHORTS = [
  {
    id: "parallaxis",
    type: "short",
    title: "Parallaxis",
    subtitle: "Jun 2026 - now",
    views: "TBA",
    uploaded: "perpetual",
    thumbnail: "img/parallaxis.jpg",
    url: "https://www.youtube.com/@TheParallaxis",
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
    views: "$700K+",
    viewsLabel: "pre-sold",
    uploaded: "2 to 14 months ago",
    thumbnail: "img/maya.jpg",
    url: "https://entermaya.com",
    tags: ["world-building", "writing", "directing"],
    text: [
      "PLACEHOLDER - paste the Maya Narrative Universe text here.",
      "Thematic structure and world-building mechanics for MAYA, a multi-format narrative universe, at the Department of Lore.",
    ],
  },
  {
    id: "edu",
    type: "short",
    title: "Education",
    subtitle: "IIM Bangalore, IB Diploma",
    views: "148 crore",
    uploaded: "timeless",
    thumbnail: "img/academic.jpg",
    tags: ["education", "debate"],
    text: [
      "PLACEHOLDER - paste the Education text here.",
      "BBA in Digital Business and Entrepreneurship at IIM Bangalore. International Baccalaureate diploma from Hiranandani Upscale School, Chennai.",
    ],
  },
  {
    id: "film",
    type: "short",
    title: "Film",
    subtitle: "Chennai",
    views: "1K",
    uploaded: "2 to 4 years ago",
    thumbnail: "img/film.jpg",
    url: "https://www.youtube.com/watch?v=MVwDkSDxSMQ",
    tags: ["film", "directing", "writing", "editing"],
    text: [
      "PLACEHOLDER - paste the Film text here.",
      "A 23-page non-linear short film, written, directed and edited in Chennai, from storyboards through to ADR and foley.",
    ],
  },
];

// The chip bar under the header.
window.CHIPS = [{ label: "All", tag: null }];
