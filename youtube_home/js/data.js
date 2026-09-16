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
    hover: "135, 135, 135",
    tags: ["film", "writing", "directing", "video-essays"],
    text: [
      "Kubrick was half decent at the whole audiovisual medium thing, but there can only be so many Kubricks.",
      "There can only be so many people born just in time, in just enough privilege to ascend the general interest magazine photographer to studio head's lackey henchman ladder.",
      "There can only be so many people who keep showing hints of promise, just enough for the deep pockets to continue betting reluctantly past the first few disappointments.",
      "I imagine he was told frequently as a young man to contribute his, no doubt extraordinary, intellect elsewhere. In the betterment of the world. Perhaps in writing a book, which are read exclusively by civilised people. That would be the right idea because the movies will never be serious.",
      "Barack Obama named 2001: A Space Odyssey the defining sci-fi of his generation, the Vatican recommends it as a lens for humanity, the richest man on the planet references it as a benchmark for thinking critically about the  defining innovation of the 21st century.",
      "He took the movies seriously, he made the movies serious.",
      "To take a genuinely new thing that hasn't existed enough yet to be taken seriously, and make it serious, inherently demands a sense of paranoia. Paranoia about the world, which tends to conspire foolishly against inevitable change, and paranoia about oneself, who tends to doubt.",
      "There can only be so many people specific to Kubrick's revolution, but revolutions, in general, are unbelievably common.",
      "In ten years, I wouldn't like to be Kubrick.",
      "I'd like to be paranoid.",
    ],
  },
  {
    id: "origins",
    type: "video",
    title: "Origins",
    views: "1",
    uploaded: "16 years ago",
    thumbnail: "img/origin.jpg",
    hover: "201, 183, 69",
    tags: ["film", "writing", "debate"],
    text: [
      "Eight years before this photograph was taken, the first feature film shot entirely on digital cameras came out in theaters.",
      "Three years before it was taken, Steve Jobs took to the stage to announce that Apple was \"going to reinvent the phone\".",
      "It was shot on a little Nokia with a physical keyboard that I hated. Easy to fat-finger about five keys at once, even for a three year old.",
      "Four years after it was taken, I started getting really into Minecraft letsplays. I often think about how no Indian seven year old before me could have gotten into Minecraft letsplays.",
      "Eight years after it was taken, I had given up my Tinkles and Diamond Comics' in favour of Batman.",
      "Twelve years after, I was utterly absorbed by Bresson's blocking, Kurosawa's motion, Khondji's illumination and Sorkin's rhythm.",
      "Initially, I suspected this was because I \"liked movies\", but that idea was easily dismissed.",
      "It couldn't be that. Earlier, I had sunken into Procedural Nodes in Blender, Game Development in Godot, Double Exposure film photography. All things capturing, and all things creating.",
      "Culture is meant to change.",
      "Culture is meant to be captured.",
      "Culture is meant to be created.",
    ],
  },
];

window.SHORTS_SHELF_TITLE = "Work";


// `fit: "contain"` shows the whole picture instead of cropping it to fill.
// `url` is where the play button offers to take people; items without one have no play button.
// The `id` is the last part of the address: /work/<id> here, /worldview/<id> above.
// `hover` is the red, green, blue of the tint behind a card under the pointer. It was worked
// out from each thumbnail: the average hue weighted by how colourful each pixel is, set to
// 55% saturation and 53% lightness, or grey (135, 135, 135) when the picture has little colour.
window.SHORTS = [
  {
    id: "parallaxis",
    type: "short",
    title: "Parallaxis",
    views: "TBA",
    uploaded: "perpetual",
    thumbnail: "img/parallaxis.jpg",
    hover: "201, 184, 69",
    url: "https://www.youtube.com/@TheParallaxis",
    tags: ["film", "video-essays", "editing", "writing"],
    text: [
      "CLICK PLAY TO BROWSE (redirects).",
      "Parallaxis are concept video essays.",
      "The initial three were pitched as crazy fiction-non-fiction subject matter collisions. Obsession's Nikki as an allegory for transgenderism. Marty Supreme's Marty as an allegory for the State of Israel. The intersection between Oppenheimer and Peter Thiel.",
      "Now, I'm starting a temporary pivot to tried and true YouTube formats, starting with \"The 7 Levels of Open Endings\". This is designed to be an undertaking in understanding the algorithm more deeply before I venture back into originality on a conceptual level.",
    ],
  },
  {
    id: "maya",
    type: "short",
    title: "Maya Narrative Universe",
    views: "$700K+",
    viewsLabel: "pre-sold",
    uploaded: "2 to 14 months ago",
    thumbnail: "img/maya.jpg",
    hover: "135, 135, 135",
    url: "https://entermaya.com",
    tags: ["world-building", "writing", "directing"],
    text: [
      "CLICK PLAY TO LEARN MORE (redirects).",
      "I interviewed for an internship at the MAYA Narrative Universe last year, on my 18th birthday, hoping to work directly under Anand Gandhi (Ship of Theseus, Tumbbad) and Zain Memon (Shasn).",
      "They ended up seeing snippets of the film I made in High School, and keeping me around for 10 months full time.",
      "I was primarily occupied by managing the internal content + influencer outreach and negotiations for the first novel in the universe, which became the highest funded debut novel in crowdfunding history.",
      "Most people have great products, not everyone has great distribution. MAYA happens to be the best independent distributor in the country.",
      "I left this July to build for the internet, first-order. See Parallaxis.",
    ],
  },
  {
    id: "edu",
    type: "short",
    title: "Education",
    views: "148 crore",
    uploaded: "timeless",
    thumbnail: "img/academic.jpg",
    hover: "201, 69, 74",
    tags: ["education", "debate"],
    text: [
      "IIM Bangalore Bachelors in Business Administration\n(Digital Business and Entrepreneurship) - Entrance Examination AIR 36 of 6000+.\n[Distance Learning with In-Person Exams, Graduating 2029]",
      "IB Diploma - 33 Points (Physics HL, Math AA HL, Chemistry)",
      "CBSE 10th 94.2%",
      "SAT 1540",
      "National Debate Champion [Individual] '23 (Indian Schools Debating Society Circuit)",
      "Whistling Woods International (Film School) Entrance Examination AIR 1.",
      "UCLA BA FTDM - Admitted.",
    ],
  },
  {
    id: "film",
    type: "short",
    title: "Film",
    views: "1K",
    uploaded: "2 to 3 years ago",
    thumbnail: "img/film.jpg",
    hover: "201, 91, 69",
    url: "https://www.youtube.com/watch?v=MVwDkSDxSMQ",
    tags: ["film", "directing", "writing", "editing"],
    text: [
      "CLICK PLAY TO WATCH (redirects). Best experienced by drag-scrolling through for visual interest in the shots. Not my best writing. See Parallaxis.",
      "This was a passion project written 3 years ago and shot 2 years ago, while I was 16-17.",
      "I had written two screenplays before ATDE and both turned out to be impossible to produce at my shoestring budget of INR ~35,000, so I grounded myself to simple physical concepts and sunk about 8 months into optimized pre-production. I grappled with ideas of colour, light and aspect ratio(/space) at both the textual and hyper-textual levels, and used them as devices to demonstrate the suffocation that exists in the subjugation faced by the powerless - through the lens of either socioeconomic class, employment hierarchy, or systems engineered for corruption supplemented profit -  at the hands of unearned authority.",
    ],
  },
];

// The chip bar under the header. `type` shows only long videos ("video") or only Work ("short").
window.CHIPS = [
  { label: "All", tag: null },
  { label: "Worldview", tag: "worldview", type: "video" },
  { label: "Work", tag: "work", type: "short" },
];
