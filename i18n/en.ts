/**
 * English — the SHAPE of every dictionary. `tr.ts` must match it exactly
 * (enforced by TypeScript). Technology names are never translated.
 *
 * Headlines use `*word*` to mark the serif accent word.
 */
export const en = {
  seo: {
    title: "Erdem Yiğitsoy — Software Developer",
    description:
      "Interactive 3D portfolio showcasing software engineering, web, mobile, backend and creative development work.",
    siteName: "Erdem Yiğitsoy",
    projectSuffix: "Erdem Yiğitsoy",
  },

  navigation: {
    work: "Work",
    about: "About",
    stack: "Stack",
    contact: "Contact",
    home: "Home",
    primary: "Primary",
    mobile: "Mobile",
    footer: "Footer",
    skip: "Skip to content",
  },

  ui: {
    menu: "Menu",
    close: "Close",
    sound: "Sound",
    on: "On",
    off: "Off",
    language: "Language",
    back: "Back",
    previous: "Previous",
    next: "Next",
    viewProject: "View project",
    viewSource: "View source",
    liveDemo: "Live demo",
    readMore: "Read more",
    visitGithub: "Visit GitHub",
    caseStudy: "Case study",
    more: "more",
    loading: "Initializing experience",
    scroll: "Scroll to explore",
    sectionProgress: "Section progress",
    goTo: "Go to",
    preview: "project preview",
    figureAlt: "figure",
    topologyAlt: "topology",
    placeholder: "SCREENSHOT PLACEHOLDER",
    fallbackNote: "The interactive 3D view is unavailable on this device — showing the lightweight version.",
  },

  progress: {
    hero: "Intro",
    about: "About",
    build: "Build",
    work: "Work",
    stack: "Stack",
    engineering: "Mindset",
    journey: "Journey",
    open: "Open",
    contact: "Contact",
  },

  profile: {
    role: "Software Developer",
    headline: ["SOFTWARE DEVELOPER", "& CREATIVE TECHNOLOGIST"],
    tagline: ["BUILDING SYSTEMS.", "CRAFTING EXPERIENCES."],
    location: "Türkiye",
    bio: [
      "Computer Engineering student from Türkiye. I build full-stack web, mobile and backend software — Next.js and Flutter applications, REST APIs, database design and network automation.",
      "My repositories range from a key-value database engine written in Go and a FastAPI network-automation platform to Flutter apps and scroll-driven WebGL experiences built with React Three Fiber.",
      "I learn by building. I like clear architecture, tidy interfaces and the small details that make a product feel considered — and I am increasingly interested in AI-powered applications and data work.",
    ],
  },

  hero: {
    scroll: "Scroll to explore",
  },

  about: {
    label: "About",
    kicker: "WHO I AM",
    headline: ["BUILDING", "SOFTWARE", "THAT *solves*", "REAL PROBLEMS."],
    role: "Role",
    location: "Location",
    languages: "Languages",
  },

  build: {
    kicker: "WHAT I BUILD",
    headline: ["ONE ENVIRONMENT.", "*four*", "DISCIPLINES."],
    areas: {
      web: {
        title: "WEB",
        kicker: "INTERFACES",
        text: "Interfaces that load fast, scale with the product and stay pleasant to maintain.",
      },
      mobile: {
        title: "MOBILE",
        kicker: "MOBILE DEVELOPMENT",
        text: "Cross-platform apps with native-feeling motion and a single, well-structured codebase.",
      },
      backend: {
        title: "BACKEND",
        kicker: "BACKEND / INFRASTRUCTURE",
        text: "APIs and services with clear contracts — from the first request to the last row in the database.",
      },
      systems: {
        title: "SYSTEMS / INFRASTRUCTURE",
        kicker: "NETWORK & SYSTEMS",
        text: "Containers, databases and the plumbing between them: the parts nobody sees until they break.",
      },
    },
    flow: ["CLIENT", "API", "BACKEND", "DATABASE", "SERVER"],
  },

  laptop: {
    kicker: "THE WORKSPACE",
    label: "Where ideas become software",
    headline: ["WHERE IDEAS", "BECOME", "*software.*"],
    tabs: {
      projects: "PROJECTS",
      code: "CODE",
      architecture: "ARCHITECTURE",
      debugging: "DEBUGGING",
    },
    ide: {
      workspace: "WORKSPACE",
      explorer: "EXPLORER",
      more: "MORE",
      relationships: "{n} documented relationships",
      layers: ["CLIENT", "API", "SERVICE", "REPOSITORY", "DATABASE"],
      debugSteps: ["REPRODUCE", "ISOLATE", "UNDERSTAND", "FIX", "VERIFY"],
    },
  },

  work: {
    kicker: "SELECTED WORK",
    label: "Selected work",
    headline: ["BUILT,", "*shipped,*", "DOCUMENTED."],
    filterLabel: "Filter projects",
    filters: {
      all: "ALL",
      web: "WEB",
      mobile: "MOBILE",
      backend: "BACKEND",
      "ai-data": "AI / DATA",
      systems: "SYSTEMS",
    },
    empty: "NO PROJECTS IN THIS CATEGORY YET.",
    featured: "FEATURED WORK",
    project: "PROJECT",
  },

  status: {
    completed: "Completed",
    "in-progress": "In Progress",
    concept: "Concept",
  },

  screen: {
    technologies: "TECHNOLOGIES",
    topology: "TOPOLOGY",
    nodes: "{n} NODES · LIVE",
    platform: "PLATFORM",
    stack: "STACK",
    lifecycle: "LIFECYCLE",
    repository: "REPOSITORY",
    figure: "FIGURE · FROM THE REPOSITORY",
    repositories: "repositories",
    projects: "projects",
    footnote: "SCROLL IS THE CAMERA",
    eras: [
      "BABBAGE",
      "UNIVAC",
      "MAINFRAME",
      "INTEL 4004",
      "ALTAIR",
      "APPLE II",
      "IBM PC",
      "MACINTOSH",
      "NETWORK",
      "DATA CENTER",
    ],
  },

  skills: {
    kicker: "TECH STACK",
    label: "Tech stack",
    headline: ["SOFTWARE", "*engineering*", "AT THE CENTRE."],
    center: "SOFTWARE ENGINEERING",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      database: "Database",
      mobile: "Mobile",
      infrastructure: "Infrastructure",
      languages: "Languages",
    },
  },

  engineering: {
    kicker: "ENGINEERING MINDSET",
    label: "Engineering mindset",
    headline: ["HOW", "*I*", "THINK."],
    items: {
      architecture: {
        title: "ARCHITECTURE",
        text: "I design scalable and maintainable software systems.",
      },
      security: {
        title: "SECURITY",
        text: "I treat application and data security as a core design principle.",
      },
      performance: {
        title: "PERFORMANCE",
        text: "I optimize system performance together with user experience.",
      },
      scalability: {
        title: "SCALABILITY",
        text: "Design for the next order of magnitude — not for ten after that.",
      },
      automation: {
        title: "AUTOMATION",
        text: "If it happens twice, script it. Repeatable beats heroic.",
      },
      "problem-solving": {
        title: "PROBLEM SOLVING",
        text: "Reproduce, isolate, understand, then fix. In that order.",
      },
    },
  },

  journey: {
    kicker: "JOURNEY",
    label: "Build, learn, experiment, ship",
    headline: ["A LOOP,", "*not a line.*"],
    phases: {
      build: {
        title: "BUILD",
        text: "Turn a problem into a working system. Start small, keep the structure honest.",
      },
      learn: {
        title: "LEARN",
        text: "Read the source, the docs and the postmortems. Understand why, not just how.",
      },
      experiment: {
        title: "EXPERIMENT",
        text: "Prototype fast, break things on purpose, keep what survives.",
      },
      ship: {
        title: "SHIP",
        text: "Release, measure, iterate. Software only counts once somebody uses it.",
      },
    },
    kinds: {
      education: "EDUCATION",
      internship: "INTERNSHIP",
      experience: "EXPERIENCE",
      certification: "CERTIFICATION",
    },
  },

  github: {
    kicker: "OPEN SOURCE",
    label: "Open source",
    headline: ["CODE IN", "*the open.*"],
  },

  contact: {
    kicker: "CONTACT",
    label: "Contact",
    headline: ["LET’S BUILD", "SOMETHING", "WORTH", "*remembering.*"],
    viewWork: "View work",
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
  },

  footer: {
    rights: "All rights reserved.",
  },

  detail: {
    back: "BACK TO WORK",
    project: "PROJECT",
    overview: "OVERVIEW",
    problem: "PROBLEM",
    approach: "APPROACH",
    architecture: "ARCHITECTURE",
    technologies: "TECHNOLOGIES",
    screenshots: "SCREENSHOTS",
    results: "RESULTS",
    source: "SOURCE",
    live: "LIVE DEMO",
    sourceAndLive: "SOURCE & LIVE DEMO",
    next: "NEXT PROJECT",
  },

  notFound: {
    title: "LOST IN THE GRID.",
    back: "Back home",
  },
};
