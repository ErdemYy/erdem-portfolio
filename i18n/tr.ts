import type { Dictionary } from "./dictionaries";

/** Türkçe — `en.ts` ile birebir aynı yapıda olmalı (TypeScript denetler). */
export const tr: Dictionary = {
  seo: {
    title: "Erdem Yiğitsoy — Yazılım Geliştirici",
    description:
      "Yazılım mühendisliği, web, mobil, backend ve yaratıcı geliştirme çalışmalarını sergileyen interaktif 3D portföy.",
    siteName: "Erdem Yiğitsoy",
    projectSuffix: "Erdem Yiğitsoy",
  },

  navigation: {
    work: "Projeler",
    about: "Hakkımda",
    stack: "Teknolojiler",
    contact: "İletişim",
    home: "Ana sayfa",
    primary: "Ana menü",
    mobile: "Mobil menü",
    footer: "Alt bilgi",
    skip: "İçeriğe geç",
  },

  ui: {
    menu: "Menü",
    close: "Kapat",
    sound: "Ses",
    on: "Açık",
    off: "Kapalı",
    language: "Dil",
    back: "Geri",
    previous: "Önceki",
    next: "Sonraki",
    viewProject: "Projeyi incele",
    viewSource: "Kaynak kod",
    liveDemo: "Canlı demo",
    readMore: "Detayları gör",
    visitGithub: "GitHub'ı ziyaret et",
    caseStudy: "Proje detayı",
    more: "daha fazla",
    loading: "Deneyim hazırlanıyor",
    scroll: "Keşfetmek için kaydır",
    sectionProgress: "Bölüm ilerlemesi",
    goTo: "Git:",
    preview: "proje önizlemesi",
    figureAlt: "şekil",
    topologyAlt: "topoloji",
    placeholder: "EKRAN GÖRÜNTÜSÜ YER TUTUCU",
    fallbackNote: "İnteraktif 3D görünüm bu cihazda kullanılamıyor — hafif sürüm gösteriliyor.",
  },

  progress: {
    hero: "Giriş",
    about: "Hakkımda",
    build: "Geliştirme",
    work: "Projeler",
    stack: "Teknolojiler",
    engineering: "Yaklaşım",
    journey: "Yolculuk",
    open: "Açık kaynak",
    contact: "İletişim",
  },

  profile: {
    role: "Yazılım Geliştirici",
    headline: ["YAZILIM GELİŞTİRİCİ", "& YARATICI TEKNOLOJİ GELİŞTİRİCİSİ"],
    tagline: ["SİSTEMLER KURUYORUM.", "DENEYİMLER TASARLIYORUM."],
    location: "Türkiye",
    bio: [
      "Türkiye'den bir Bilgisayar Mühendisliği öğrencisiyim. Full-stack web, mobil ve backend yazılımlar geliştiriyorum: Next.js ve Flutter uygulamaları, REST API'ler, veritabanı tasarımı ve ağ otomasyonu.",
      "Repolarım Go ile sıfırdan yazılmış bir key-value veritabanı motorundan ve FastAPI tabanlı bir ağ otomasyon platformundan, Flutter uygulamalarına ve React Three Fiber ile geliştirdiğim scroll tabanlı WebGL deneyimlerine uzanıyor.",
      "Yaparak öğreniyorum. Net bir mimariyi, düzenli arayüzleri ve bir ürünü özenli hissettiren küçük detayları seviyorum; yapay zekâ destekli uygulamalara ve veri çalışmalarına ilgim giderek artıyor.",
    ],
  },

  hero: {
    scroll: "Keşfetmek için kaydır",
  },

  about: {
    label: "Hakkımda",
    kicker: "KİMİM",
    headline: ["GERÇEK", "SORUNLARI", "ÇÖZEN *yazılımlar*", "GELİŞTİRİYORUM."],
    role: "Rol",
    location: "Konum",
    languages: "Diller",
  },

  build: {
    kicker: "NELER GELİŞTİRİYORUM",
    headline: ["TEK ORTAM.", "*dört*", "ALAN."],
    areas: {
      web: {
        title: "WEB",
        kicker: "ARAYÜZLER",
        text: "Hızlı yüklenen, ürünle birlikte ölçeklenen ve bakımı keyifli kalan arayüzler.",
      },
      mobile: {
        title: "MOBİL",
        kicker: "MOBİL GELİŞTİRME",
        text: "Yerel hissi veren hareketlere ve tek, iyi yapılandırılmış bir kod tabanına sahip çapraz platform uygulamalar.",
      },
      backend: {
        title: "BACKEND",
        kicker: "BACKEND / ALTYAPI",
        text: "Net sözleşmelere sahip API'ler ve servisler — ilk istekten veritabanındaki son satıra kadar.",
      },
      systems: {
        title: "SİSTEMLER / ALTYAPI",
        kicker: "AĞ VE SİSTEMLER",
        text: "Konteynerler, veritabanları ve aralarındaki tesisat: bozulana kadar kimsenin görmediği parçalar.",
      },
    },
    flow: ["İSTEMCİ", "API", "BACKEND", "VERİTABANI", "SUNUCU"],
  },

  laptop: {
    kicker: "ÇALIŞMA ALANI",
    label: "Fikirlerin yazılıma dönüştüğü yer",
    headline: ["FİKİRLERİN", "YAZILIMA", "*dönüştüğü yer.*"],
    tabs: {
      projects: "PROJELER",
      code: "KOD",
      architecture: "MİMARİ",
      debugging: "HATA AYIKLAMA",
    },
    ide: {
      workspace: "ÇALIŞMA ALANI",
      explorer: "GEZGİN",
      more: "DAHA FAZLA",
      relationships: "{n} belgelenmiş ilişki",
      layers: ["İSTEMCİ", "API", "SERVİS", "DEPO", "VERİTABANI"],
      debugSteps: ["YENİDEN ÜRET", "İZOLE ET", "ANLA", "DÜZELT", "DOĞRULA"],
    },
  },

  work: {
    kicker: "SEÇİLİ PROJELER",
    label: "Seçili projeler",
    headline: ["GELİŞTİRİLDİ,", "*yayınlandı,*", "BELGELENDİ."],
    filterLabel: "Projeleri filtrele",
    filters: {
      all: "TÜMÜ",
      web: "WEB",
      mobile: "MOBİL",
      backend: "BACKEND",
      "ai-data": "YZ / VERİ",
      systems: "SİSTEMLER",
    },
    empty: "BU KATEGORİDE HENÜZ PROJE YOK.",
    featured: "ÖNE ÇIKAN PROJE",
    project: "PROJE",
  },

  status: {
    completed: "Tamamlandı",
    "in-progress": "Geliştiriliyor",
    concept: "Konsept",
  },

  screen: {
    technologies: "TEKNOLOJİLER",
    topology: "TOPOLOJİ",
    nodes: "{n} DÜĞÜM · CANLI",
    platform: "PLATFORM",
    stack: "TEKNOLOJİ YIĞINI",
    lifecycle: "YAŞAM DÖNGÜSÜ",
    repository: "DEPO",
    figure: "ŞEKİL · DEPODAN",
    repositories: "depolar",
    projects: "projeler",
    footnote: "KAYDIRMAK KAMERAYI HAREKET ETTİRİR",
    eras: [
      "BABBAGE",
      "UNIVAC",
      "ANA BİLGİSAYAR",
      "INTEL 4004",
      "ALTAIR",
      "APPLE II",
      "IBM PC",
      "MACINTOSH",
      "AĞ",
      "VERİ MERKEZİ",
    ],
  },

  skills: {
    kicker: "TEKNOLOJİLER",
    label: "Teknolojiler",
    headline: ["YAZILIM", "*mühendisliği*", "MERKEZDE."],
    center: "YAZILIM MÜHENDİSLİĞİ",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      database: "Veritabanı",
      mobile: "Mobil",
      infrastructure: "Altyapı",
      languages: "Diller",
    },
  },

  engineering: {
    kicker: "MÜHENDİSLİK YAKLAŞIMI",
    label: "Mühendislik yaklaşımı",
    headline: ["NASIL", "*düşünüyorum.*"],
    items: {
      architecture: {
        title: "MİMARİ",
        text: "Ölçeklenebilir ve sürdürülebilir yazılım sistemleri tasarlıyorum.",
      },
      security: {
        title: "GÜVENLİK",
        text: "Uygulama ve veri güvenliğini temel tasarım prensibi olarak ele alıyorum.",
      },
      performance: {
        title: "PERFORMANS",
        text: "Kullanıcı deneyimini ve sistem performansını birlikte optimize ediyorum.",
      },
      scalability: {
        title: "ÖLÇEKLENEBİLİRLİK",
        text: "Bir sonraki büyüklük mertebesine göre tasarlıyorum — ondan sonraki on için değil.",
      },
      automation: {
        title: "OTOMASYON",
        text: "İki kez oluyorsa, scriptle. Tekrarlanabilirlik kahramanlıktan iyidir.",
      },
      "problem-solving": {
        title: "PROBLEM ÇÖZME",
        text: "Yeniden üret, izole et, anla, sonra düzelt. Bu sırayla.",
      },
    },
  },

  journey: {
    kicker: "YOLCULUK",
    label: "Geliştir, öğren, dene, yayınla",
    headline: ["BİR DÖNGÜ,", "*çizgi değil.*"],
    phases: {
      build: {
        title: "GELİŞTİR",
        text: "Bir problemi çalışan bir sisteme dönüştür. Küçük başla, yapıyı dürüst tut.",
      },
      learn: {
        title: "ÖĞREN",
        text: "Kaynak kodu, dokümanları ve postmortem'leri oku. Sadece nasıl'ı değil, neden'i anla.",
      },
      experiment: {
        title: "DENE",
        text: "Hızlı prototip çıkar, bilerek bozmaya çalış, ayakta kalanı sakla.",
      },
      ship: {
        title: "YAYINLA",
        text: "Yayınla, ölç, iyileştir. Yazılım ancak biri kullandığında sayılır.",
      },
    },
    kinds: {
      education: "EĞİTİM",
      internship: "STAJ",
      experience: "DENEYİM",
      certification: "SERTİFİKA",
    },
  },

  github: {
    kicker: "AÇIK KAYNAK",
    label: "Açık kaynak",
    headline: ["KODUM", "*herkese açık.*"],
  },

  contact: {
    kicker: "İLETİŞİM",
    label: "İletişim",
    headline: ["BİRLİKTE", "HATIRLANMAYA", "DEĞER BİR ŞEY", "*geliştirelim.*"],
    viewWork: "Projeleri gör",
    email: "E-posta",
    github: "GitHub",
    linkedin: "LinkedIn",
  },

  footer: {
    rights: "Tüm hakları saklıdır.",
  },

  detail: {
    back: "PROJELERE DÖN",
    project: "PROJE",
    overview: "GENEL BAKIŞ",
    problem: "PROBLEM",
    approach: "YAKLAŞIM",
    architecture: "MİMARİ",
    technologies: "TEKNOLOJİLER",
    screenshots: "EKRAN GÖRÜNTÜLERİ",
    results: "SONUÇLAR",
    source: "KAYNAK",
    live: "CANLI DEMO",
    sourceAndLive: "KAYNAK VE CANLI DEMO",
    next: "SONRAKİ PROJE",
  },

  notFound: {
    title: "IZGARADA KAYBOLDUK.",
    back: "Ana sayfaya dön",
  },
};
