import type { Project } from "@/types/portfolio";

/** Filter keys. Labels live in the dictionaries (`work.filters`). */
export const projectFilterKeys = ["all", "web", "mobile", "backend", "ai-data", "systems"] as const;
export type ProjectFilterKey = (typeof projectFilterKeys)[number];

const gh = (repo: string) => `https://github.com/ErdemYy/${repo}`;

/**
 * Real projects from github.com/ErdemYy (descriptions condensed from each
 * repository README).
 *
 * Text fields are `Localized`: `{ tr, en }`, or a bare string when it is the
 * same in both languages. Project NAMES are brand names and stay untranslated.
 * `status` is a conservative guess — adjust it to the truth.
 *
 * Each project is shown on the 3D monitor as a live React interface chosen by
 * `screenLayout` (code | network | dashboard | mobile | editorial). `image`
 * is used by the case-study page; `figure` (naval) is a real figure from that
 * repository and is also shown inside its dashboard screen.
 */
export const projects: Project[] = [
  {
    id: "computing",
    title: "COMPUTING",
    category: "web",
    description: {
      en: "A scroll-driven 3D experience on the evolution of the computer, 1820 → 2026 — scroll is the camera.",
      tr: "Bilgisayarın 1820'den 2026'ya evrimini anlatan, scroll ile yönetilen 3D deneyim — kaydırmak kamerayı hareket ettirir.",
    },
    longDescription: {
      en: "One fixed WebGL canvas and ten chapters — Babbage, UNIVAC, mainframe, Intel 4004, Altair, Apple II, IBM PC, Macintosh, network and data center — each with its own lighting, atmosphere and typography, plus three hand-built transitions.",
      tr: "Tek sabit WebGL canvas ve on bölüm — Babbage, UNIVAC, ana bilgisayar, Intel 4004, Altair, Apple II, IBM PC, Macintosh, ağ ve veri merkezi — her birinin kendi ışığı, atmosferi ve tipografisi, ayrıca elle yapılmış üç geçiş.",
    },
    technologies: ["Next.js", "React", "TypeScript", "Three.js", "React Three Fiber", "GSAP", "Lenis"],
    status: "in-progress",
    featured: true,
    github: gh("computing"),
    image: "/images/projects/computing.webp",
    accent: "#ff5b2e",
    screenLayout: "editorial",
  },
  {
    id: "switchpilot",
    title: "SWITCHPILOT",
    category: "systems",
    description: {
      en: "Multi-vendor network automation platform for configuration backup, orchestration and topology compliance.",
      tr: "Yapılandırma yedekleme, orkestrasyon ve topoloji uyumluluğu için çok üreticili ağ otomasyon platformu.",
    },
    longDescription: {
      en: "A monorepo with a Next.js web app and a Python FastAPI backend built on an async clean architecture. Vendor drivers sit behind an abstraction layer covering Cisco, Aruba, Juniper, Huawei, MikroTik, Ubiquiti and HP Enterprise.",
      tr: "Next.js web uygulaması ve asenkron temiz mimari üzerine kurulu Python FastAPI backend'inden oluşan bir monorepo. Cisco, Aruba, Juniper, Huawei, MikroTik, Ubiquiti ve HP Enterprise'ı kapsayan bir soyutlama katmanının arkasında üretici sürücüleri yer alır.",
    },
    technologies: ["Next.js", "TypeScript", "Python", "FastAPI", "Tailwind CSS"],
    status: "in-progress",
    github: gh("SwitchPilot"),
    image: "/images/projects/switchpilot.webp",
    accent: "#4f8cff",
    screenLayout: "network",
    screenNodes: ["Cisco", "Aruba", "Juniper", "Huawei", "MikroTik", "Ubiquiti", "HPE"],
  },
  {
    id: "bitcask-db",
    title: "BITCASK DB",
    category: "backend",
    description: {
      en: "A key-value database engine written from scratch in Go on the log-structured, append-only Bitcask design.",
      tr: "Log yapılı, yalnızca ekleme yapan Bitcask tasarımıyla Go'da sıfırdan yazılmış bir key-value veritabanı motoru.",
    },
    longDescription: {
      en: "Ships with a gRPC server and a desktop management client built with Tauri (Rust), React and Tailwind CSS.",
      tr: "Bir gRPC sunucusu ve Tauri (Rust), React ve Tailwind CSS ile geliştirilmiş masaüstü yönetim istemcisiyle birlikte gelir.",
    },
    technologies: ["Go", "gRPC", "Rust", "Tauri", "React", "Tailwind CSS"],
    status: "in-progress",
    github: gh("VeritabaniMimarisi"),
    image: "/images/projects/bitcask.webp",
    accent: "#4f8cff",
    screenLayout: "code",
  },
  {
    id: "naval-propulsion-clustering",
    title: "NAVAL PROPULSION CLUSTERING",
    category: "ai-data",
    description: {
      en: "Unsupervised discovery of operating and degradation profiles in naval gas turbine propulsion systems.",
      tr: "Deniz gaz türbinli tahrik sistemlerinde çalışma ve performans düşüşü profillerinin gözetimsiz keşfi.",
    },
    longDescription: {
      en: "A research-style clustering study on the UCI Naval Propulsion Plants dataset (N = 11,934), separating the variance caused by operating load from genuine degradation. Includes a test suite and generated analysis figures.",
      tr: "UCI Naval Propulsion Plants veri kümesi (N = 11.934) üzerinde, işletme yükünden kaynaklanan varyansı gerçek bozulmadan ayıran araştırma tarzı bir kümeleme çalışması. Bir test paketi ve üretilmiş analiz figürleri içerir.",
    },
    technologies: ["Python", "Machine Learning", "Unsupervised Clustering"],
    status: "in-progress",
    github: gh("naval-propulsion-clustering"),
    image: "/images/projects/naval.webp",
    figure: "/images/projects/naval.webp",
    accent: "#c9c4b8",
    screenLayout: "dashboard",
  },
  {
    id: "cvcraft",
    title: "CVCRAFT",
    category: "web",
    description: {
      en: "Create, edit, manage and export professional CVs as PDF from a single workspace.",
      tr: "Profesyonel CV'leri tek bir çalışma alanında oluşturun, düzenleyin, yönetin ve PDF olarak dışa aktarın.",
    },
    technologies: ["Next.js 16", "React 19", "TypeScript"],
    status: "in-progress",
    github: gh("CVCraft"),
    image: "/images/projects/cvcraft.webp",
    accent: "#e8e6df",
    screenLayout: "code",
  },
  {
    id: "cresite",
    title: "CRESITE",
    category: "web",
    description: {
      en: "A no-code web builder: design, collaborate, publish and export websites from one visual studio.",
      tr: "Kodsuz web oluşturucu: web sitelerini tek bir görsel stüdyoda tasarlayın, birlikte çalışın, yayınlayın ve dışa aktarın.",
    },
    longDescription: {
      en: "Full-stack builder around a Craft.js drag-and-drop engine, with Supabase as the backend and Stripe subscriptions.",
      tr: "Craft.js sürükle-bırak motoru etrafında kurulu full-stack oluşturucu; backend için Supabase, abonelikler için Stripe.",
    },
    technologies: ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "Stripe", "Craft.js"],
    status: "in-progress",
    github: gh("CreSite"),
    image: "/images/projects/cresite.webp",
    accent: "#ff5b2e",
    screenLayout: "dashboard",
  },
  {
    id: "vaultx",
    title: "VAULTX",
    category: "mobile",
    description: {
      en: "A premium daily-reward experience: fintech polish meets game-like progression, with a Next.js landing page.",
      tr: "Premium günlük ödül deneyimi: fintech cilası oyun benzeri ilerlemeyle buluşuyor; bir Next.js tanıtım sayfasıyla birlikte.",
    },
    longDescription: {
      en: "A Flutter app with a custom safe-cracker dial, haptics, programmatic visual effects and cinematic reward moments, in an obsidian-and-gold visual system.",
      tr: "Özel kasa açma kadranı, haptik geri bildirim, programatik görsel efektler ve sinematik ödül anlarına sahip bir Flutter uygulaması; obsidyen ve altın bir görsel sistemde.",
    },
    technologies: ["Flutter", "Dart", "Next.js"],
    status: "in-progress",
    github: gh("VaultX"),
    image: "/images/projects/vaultx.webp",
    accent: "#d8b45c",
    screenLayout: "mobile",
  },
  {
    id: "lumina",
    title: "LUMINA",
    category: "mobile",
    description: {
      en: "A smart-home command center in Flutter with a glassmorphism UI, micro-animations and a live network-mesh view.",
      tr: "Glassmorphism arayüzü, mikro animasyonları ve canlı ağ-mesh görünümü olan Flutter akıllı ev kontrol merkezi.",
    },
    technologies: ["Flutter", "Dart"],
    status: "in-progress",
    github: gh("Lumina"),
    image: "/images/projects/lumina.webp",
    accent: "#5ad1ff",
    screenLayout: "mobile",
  },
  {
    id: "wheretogo",
    title: "WHERETOGO",
    category: "mobile",
    description: {
      en: "A group decision app: discover places nearby, then vote together in real time on where to go.",
      tr: "Bir grup karar uygulaması: yakındaki yerleri keşfedin, nereye gideceğinize birlikte gerçek zamanlı oy verin.",
    },
    technologies: ["Flutter", "Dart", "Firebase", "Google Places API"],
    status: "in-progress",
    github: gh("wheretogo"),
    image: "/images/projects/wheretogo.webp",
    accent: "#8fb4ff",
    screenLayout: "mobile",
  },
  {
    id: "zamanyolu",
    title: "ZAMANYOLU",
    category: "mobile",
    description: {
      en: "A location-based mobile exploration game that combines real Anatolian places with AR puzzles.",
      tr: "Gerçek Anadolu mekânlarını AR bulmacalarıyla birleştiren, konum tabanlı mobil keşif oyunu.",
    },
    longDescription: {
      en: "Planned as an Android-first Unity game with source-verified historical content, starting in Sivas. The repository currently holds the plan and scope.",
      tr: "Kaynaklarla doğrulanmış tarihsel içerikle, Sivas'tan başlayacak şekilde Android öncelikli bir Unity oyunu olarak planlandı. Depoda şu an plan ve kapsam yer alıyor.",
    },
    technologies: ["Unity", "C#", "AR"],
    status: "concept",
    github: gh("ZamanYolu"),
    image: "/images/projects/zamanyolu.webp",
    accent: "#ff5b2e",
    screenLayout: "mobile",
  },
];

export const getProject = (id: string) => projects.find((p) => p.id === id);
export const featuredProject = projects.find((p) => p.featured) ?? projects[0];
