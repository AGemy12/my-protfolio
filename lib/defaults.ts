// Starter content (from the CV). The public site falls back to this when the
// database is empty or unreachable, and "Import starter content" in the
// dashboard writes it to MongoDB so everything becomes editable.
import type { Experience, Project, Service, Settings, Skill } from "./types";

type Seed<T> = Omit<T, "_id">;

export const defaultSettings: Settings = {
  name: { en: "Ahmad Marzouk", ar: "أحمد مرزوق" },
  role: { en: "Full Stack Developer", ar: "مطوّر ويب متكامل" },
  headline: {
    en: "I build web products end to end — from the *database* to the *pixels*.",
    ar: "أبني منتجات الويب من البداية للنهاية — من *قاعدة البيانات* حتى *الواجهة*.",
  },
  bio: {
    en: "Full Stack JavaScript developer with 3+ years of experience shipping scalable web applications with Next.js, React, Node.js and NestJS. I design the data, build secure APIs and craft fast, SEO-friendly interfaces.",
    ar: "مطوّر JavaScript متكامل بخبرة تزيد عن 3 سنوات في بناء تطبيقات ويب قابلة للتوسع باستخدام Next.js وReact وNode.js وNestJS. أصمّم البيانات، وأبني واجهات برمجية آمنة، وأطوّر واجهات سريعة ومتوافقة مع محركات البحث.",
  },
  about: {
    en: "I work on the whole product: the database, the API behind it, and the interface people use every day. Owning every layer keeps the product consistent and easier to grow.\n\nOn the backend I design modular REST APIs with NestJS and Node.js, model data in PostgreSQL and MongoDB with Prisma and Mongoose, and secure them with JWT, guards and role-based access control. On the frontend I build fast, SEO-optimized interfaces with Next.js (App Router, SSR, SSG), React and Tailwind CSS.\n\nI work directly with business stakeholders, own features from requirements to production, and care about clean, maintainable and reusable code.",
    ar: "أعمل على المنتج كاملاً: قاعدة البيانات، والواجهة البرمجية خلفها، والواجهة التي يستخدمها الناس كل يوم. تولّي كل طبقة يجعل المنتج متّسقاً وأسهل في التطوير.\n\nفي الخادم أصمّم واجهات REST معيارية باستخدام NestJS وNode.js، وأنمذج البيانات في PostgreSQL وMongoDB عبر Prisma وMongoose، وأؤمّنها باستخدام JWT والحراس والصلاحيات حسب الأدوار. وفي الواجهة أبني واجهات سريعة ومحسّنة لمحركات البحث باستخدام Next.js (App Router وSSR وSSG) وReact وTailwind CSS.\n\nأعمل مباشرة مع أصحاب الأعمال، وأتولى الميزات من المتطلبات حتى الإطلاق، وأهتم بكود نظيف قابل للصيانة وإعادة الاستخدام.",
  },
  location: { en: "Beni Suef, Egypt · Remote", ar: "بني سويف، مصر · عن بُعد" },
  heroRoles: {
    en: ["Full Stack Developer", "Next.js on the frontend", "NestJS on the backend", "From idea to production"],
    ar: ["مطوّر ويب متكامل", "Next.js في الواجهات", "NestJS في الخوادم", "من الفكرة حتى الإطلاق"],
  },
  email: "aggamal98@gmail.com",
  phone: "+20 114 956 0988",
  whatsapp: "https://wa.me/201149560988",
  avatar: "/images/avatar.png",
  cvEn: "/files/cv.pdf",
  cvAr: "",
  github: "https://github.com/AGemy12",
  linkedin: "https://www.linkedin.com/in/ahmad-marzouk-9430b1233/",
  x: "",
  available: true,
  yearsExperience: 3,
  projectsDone: 10,
  seoTitle: {
    en: "Ahmad Marzouk — Full Stack Developer (Next.js & NestJS)",
    ar: "أحمد مرزوق — مطوّر ويب متكامل (Next.js و NestJS)",
  },
  seoDescription: {
    en: "Full Stack JavaScript developer building scalable web apps with Next.js, React, Node.js, NestJS, MongoDB and PostgreSQL.",
    ar: "مطوّر JavaScript متكامل يبني تطبيقات ويب قابلة للتوسع باستخدام Next.js وReact وNode.js وNestJS وMongoDB وPostgreSQL.",
  },
  ogImage: "",
  sections: { about: true, skills: true, experience: true, projects: true, services: true, contact: true },
};

const project = (p: Partial<Seed<Project>> & Pick<Seed<Project>, "slug" | "title" | "summary">): Seed<Project> => ({
  description: { en: "", ar: "" },
  role: { en: "Full Stack Developer", ar: "مطوّر متكامل" },
  cover: "",
  gallery: [],
  tech: [],
  category: "other",
  year: 2024,
  liveUrl: "",
  repoUrl: "",
  featured: false,
  published: true,
  order: 0,
  ...p,
});

export const defaultProjects: Seed<Project>[] = [
  project({
    slug: "property-management-platform",
    title: { en: "Property Management Platform", ar: "منصة إدارة العقارات" },
    summary: {
      en: "Scalable platform for owners, tenants and administrators with role-based dashboards.",
      ar: "منصة قابلة للتوسع للملاك والمستأجرين والمسؤولين بلوحات تحكم حسب الصلاحيات.",
    },
    description: {
      en: "Building a scalable property management platform end to end: backend modules and data models, REST APIs, and dynamic dashboards on the client side.\n\nImplemented authenticated, role-based access for owners, tenants and administrators, with dynamic data flows between services and the application. Applied caching, performance optimization and SEO best practices across the platform.",
      ar: "بناء منصة قابلة للتوسع لإدارة العقارات من البداية للنهاية: وحدات الخادم ونماذج البيانات وواجهات REST ولوحات تحكم ديناميكية.\n\nتطبيق دخول آمن وصلاحيات حسب الدور للملاك والمستأجرين والمسؤولين، مع تدفق بيانات ديناميكي بين الخدمات والتطبيق، وتطبيق التخزين المؤقت وتحسين الأداء ومحركات البحث.",
    },
    tech: ["NestJS", "Next.js", "PostgreSQL", "Prisma", "Redis", "Docker"],
    category: "dashboard",
    year: 2025,
    featured: true,
    order: 1,
  }),
  project({
    slug: "alarabify",
    title: { en: "Alarabify Academy", ar: "أكاديمية العربيفاي" },
    summary: {
      en: "Online learning platform with dashboards for admins, teachers and students, and live sessions.",
      ar: "منصة تعليم عن بُعد بلوحات تحكم للإدارة والمعلمين والطلاب، مع جلسات مباشرة.",
    },
    description: {
      en: "Built an end-to-end educational platform with role-based dashboards for Admin, Teacher and Student users. Implemented the API integration layer for lessons, subscriptions, messaging and real-time notifications, and integrated live online sessions.",
      ar: "بناء منصة تعليمية متكاملة بلوحات تحكم حسب الدور للإدارة والمعلمين والطلاب، مع طبقة ربط للدروس والاشتراكات والرسائل والإشعارات اللحظية، ودمج الجلسات المباشرة.",
    },
    cover: "/images/projects/arabify.png",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "REST API"],
    category: "education",
    year: 2024,
    liveUrl: "https://www.alarabify.com",
    featured: true,
    order: 2,
  }),
  project({
    slug: "nemmra",
    title: { en: "Nemmra Platform", ar: "منصة نمرة" },
    summary: {
      en: "Full-stack features with authentication, dynamic content and optimized rendering.",
      ar: "ميزات متكاملة مع تسجيل الدخول والمحتوى الديناميكي وتحسين الأداء.",
    },
    cover: "/images/projects/nemmra.png",
    tech: ["Next.js", "React", "REST API"],
    category: "platform",
    year: 2025,
    featured: true,
    order: 3,
  }),
  project({
    slug: "best-clean",
    title: { en: "Best Clean", ar: "بيست كلين" },
    summary: {
      en: "Cleaning services platform with online booking and an admin panel for services and content.",
      ar: "منصة لخدمات التنظيف مع حجز إلكتروني ولوحة إدارة للخدمات والمحتوى.",
    },
    cover: "/images/projects/best-clean.png",
    tech: ["Next.js", "Node.js", "MongoDB"],
    category: "platform",
    year: 2024,
    liveUrl: "https://www.best-cleanteam.com/",
    featured: true,
    order: 4,
  }),
  project({
    slug: "rowad4u",
    title: { en: "Rowad4u", ar: "رواد" },
    summary: {
      en: "Digital services platform with a full dashboard for services, categories and users.",
      ar: "منصة خدمات رقمية مع لوحة تحكم كاملة للخدمات والتصنيفات والمستخدمين.",
    },
    cover: "/images/projects/rowad.png",
    tech: ["Next.js", "Node.js"],
    category: "platform",
    year: 2024,
    liveUrl: "https://www.rowad4u.com/",
    order: 5,
  }),
  project({
    slug: "itqan",
    title: { en: "Itqan Academy", ar: "أكاديمية إتقان" },
    summary: {
      en: "A search-friendly website for an online Quran and Arabic academy.",
      ar: "موقع متوافق مع محركات البحث لأكاديمية تعليم القرآن واللغة العربية عن بُعد.",
    },
    cover: "/images/projects/itqan.png",
    tech: ["Next.js", "TypeScript"],
    category: "education",
    year: 2023,
    liveUrl: "https://www.itqanforquran.com/ar",
    order: 6,
  }),
  project({
    slug: "cmt-digital",
    title: { en: "CMT Digital", ar: "CMT Digital" },
    summary: {
      en: "Corporate website for a technology services company, from layout to deployment.",
      ar: "موقع تعريفي لشركة خدمات تقنية، من التصميم حتى النشر.",
    },
    cover: "/images/projects/cmt.png",
    tech: ["Next.js", "Tailwind CSS"],
    category: "corporate",
    year: 2025,
    liveUrl: "https://cmt-azure.vercel.app/",
    order: 7,
  }),
  project({
    slug: "diyarsco",
    title: { en: "Diyarsco", ar: "ديارسكو" },
    summary: {
      en: "Company website with responsive layout, visual design and content management.",
      ar: "موقع الشركة بتصميم متجاوب وهوية بصرية وإدارة للمحتوى.",
    },
    cover: "/images/projects/diyarsco.png",
    tech: ["Next.js", "Tailwind CSS"],
    category: "corporate",
    year: 2025,
    liveUrl: "https://diyarsco.com",
    order: 8,
  }),
  project({
    slug: "2-stars",
    title: { en: "2 Stars", ar: "2 Stars" },
    summary: {
      en: "Agency website for web design, development and digital marketing services.",
      ar: "موقع وكالة لخدمات تصميم وتطوير المواقع والتسويق الرقمي.",
    },
    cover: "/images/projects/stars.png",
    tech: ["Next.js", "Tailwind CSS"],
    category: "corporate",
    year: 2023,
    liveUrl: "https://2-stars-seven.vercel.app/",
    order: 9,
  }),
  project({
    slug: "amira-hr-consultancy",
    title: { en: "Amira Mayoof Consultancy", ar: "أميرة معيوف للاستشارات" },
    summary: {
      en: "Bilingual WordPress site for a career coaching and HR consultancy, with online booking and a book store.",
      ar: "موقع WordPress ثنائي اللغة لاستشارات الموارد البشرية والكوتشنج المهني، مع حجز مواعيد إلكتروني ومتجر للكتب.",
    },
    description: {
      en: "Built and maintain a bilingual (Arabic/English) WordPress website for a career coaching and HR consultancy serving individuals and companies.\n\nThe site covers corporate and individual services, workshops, a blog and news, and a WooCommerce store for career products and digital books. It includes appointment booking, online payments, and custom plugins for book delivery, practitioner sessions, payment recovery and WhatsApp order alerts.",
      ar: "بناء وصيانة موقع WordPress ثنائي اللغة (عربي/إنجليزي) لمكتب استشارات موارد بشرية وكوتشنج مهني يخدم الأفراد والشركات.\n\nيضم الموقع خدمات الشركات والأفراد وورش العمل والمدونة والأخبار، ومتجر WooCommerce للمنتجات المهنية والكتب الرقمية، مع حجز المواعيد والدفع الإلكتروني، وإضافات مخصصة لتوصيل الكتب وجلسات الممارسين واسترداد المدفوعات وتنبيهات الطلبات عبر واتساب.",
    },
    role: { en: "WordPress Developer", ar: "مطوّر WordPress" },
    cover: "/images/projects/amira-inspiring-careers.png",
    gallery: ["/images/projects/amira-nine-gates.png", "/images/projects/amira-home.png"],
    tech: ["WordPress", "WooCommerce", "PHP", "WPML", "ACF"],
    category: "corporate",
    year: 2026,
    liveUrl: "https://amirahrconsultancy.com/",
    order: 10,
  }),
];

export const defaultExperience: Seed<Experience>[] = [
  {
    company: "DeyarTech",
    companyUrl: "https://deyartech.com",
    role: { en: "Full Stack Developer", ar: "مطوّر ويب متكامل" },
    location: { en: "Remote", ar: "عن بُعد" },
    type: "work",
    start: "2022",
    end: "",
    current: true,
    highlights: {
      en: [
        "Develop and maintain company products end to end: data modeling, REST API layer, authentication and role-based access, and the client applications built on top of them.",
        "Translate business requirements into shipped features in collaboration with design and business stakeholders.",
        "Maintain clean, modular and reusable code, applying performance optimization and cross-browser compatibility across all products.",
      ],
      ar: [
        "تطوير وصيانة منتجات الشركة من البداية للنهاية: نمذجة البيانات وواجهات REST والمصادقة والصلاحيات وتطبيقات العميل.",
        "تحويل متطلبات العمل إلى ميزات منشورة بالتعاون مع فرق التصميم وأصحاب الأعمال.",
        "الحفاظ على كود نظيف ومعياري وقابل لإعادة الاستخدام مع تحسين الأداء والتوافق مع المتصفحات.",
      ],
    },
    published: true,
    order: 1,
  },
  {
    company: "Freelance",
    companyUrl: "",
    role: { en: "Full Stack Developer", ar: "مطوّر ويب متكامل (عمل حر)" },
    location: { en: "Remote", ar: "عن بُعد" },
    type: "freelance",
    start: "2021",
    end: "",
    current: true,
    highlights: {
      en: [
        "Deliver complete web solutions for clients: database design, REST API services, authentication and authorization, and frontend applications.",
        "Manage projects independently, from requirements gathering through delivery, deployment and post-launch support.",
      ],
      ar: [
        "تقديم حلول ويب متكاملة للعملاء: تصميم قواعد البيانات وخدمات REST والمصادقة والصلاحيات وتطبيقات الواجهة.",
        "إدارة المشاريع باستقلالية من جمع المتطلبات حتى التسليم والنشر والدعم بعد الإطلاق.",
      ],
    },
    published: true,
    order: 2,
  },
];

const skill = (name: string, icon: string, category: Skill["category"], order: number): Seed<Skill> => ({
  name,
  icon,
  category,
  order,
  published: true,
});

export const defaultSkills: Seed<Skill>[] = [
  skill("Next.js", "nextdotjs", "frontend", 1),
  skill("React", "react", "frontend", 2),
  skill("TypeScript", "typescript", "frontend", 3),
  skill("JavaScript", "javascript", "frontend", 4),
  skill("Tailwind CSS", "tailwindcss", "frontend", 5),
  skill("Vue.js", "vuedotjs", "frontend", 6),
  skill("Nuxt", "nuxt", "frontend", 7),
  skill("Redux", "redux", "frontend", 8),
  skill("Shadcn UI", "shadcnui", "frontend", 9),
  skill("Sass", "sass", "frontend", 10),
  skill("Node.js", "nodedotjs", "backend", 11),
  skill("NestJS", "nestjs", "backend", 12),
  skill("Express", "express", "backend", 13),
  skill("JWT & RBAC", "jsonwebtokens", "backend", 14),
  skill("Socket.io", "socketdotio", "backend", 15),
  skill("Swagger", "swagger", "backend", 16),
  skill("MongoDB", "mongodb", "database", 17),
  skill("PostgreSQL", "postgresql", "database", 18),
  skill("Prisma", "prisma", "database", 19),
  skill("TypeORM", "typeorm", "database", 20),
  skill("Mongoose", "mongoose", "database", 21),
  skill("Redis", "redis", "database", 22),
  skill("Docker", "docker", "devops", 23),
  skill("Vercel", "vercel", "devops", 24),
  skill("Git", "git", "tools", 25),
  skill("GitHub", "github", "tools", 26),
  skill("Postman", "postman", "tools", 27),
  skill("Claude", "claude", "ai", 28),
  skill("Codex", "bot", "ai", 29),
];

export const defaultServices: Seed<Service>[] = [
  {
    title: { en: "Full Stack Web Apps", ar: "تطبيقات ويب متكاملة" },
    description: {
      en: "Complete products from database design and APIs to polished, responsive interfaces.",
      ar: "منتجات كاملة من تصميم قاعدة البيانات والواجهات البرمجية حتى واجهات متجاوبة ومتقنة.",
    },
    icon: "layers",
    published: true,
    order: 1,
  },
  {
    title: { en: "Backend & APIs", ar: "الخوادم والواجهات البرمجية" },
    description: {
      en: "Modular NestJS / Node.js REST APIs with JWT auth, RBAC, validation and caching.",
      ar: "واجهات REST معيارية بـ NestJS وNode.js مع JWT والصلاحيات والتحقق والتخزين المؤقت.",
    },
    icon: "server",
    published: true,
    order: 2,
  },
  {
    title: { en: "Dashboards & Admin Panels", ar: "لوحات التحكم والإدارة" },
    description: {
      en: "Role-based dashboards that let teams manage content, users and data with ease.",
      ar: "لوحات تحكم حسب الصلاحيات تتيح للفرق إدارة المحتوى والمستخدمين والبيانات بسهولة.",
    },
    icon: "layout-dashboard",
    published: true,
    order: 3,
  },
  {
    title: { en: "Performance & SEO", ar: "الأداء ومحركات البحث" },
    description: {
      en: "Fast Next.js sites with SSR/SSG, Core Web Vitals tuning and on-page SEO.",
      ar: "مواقع Next.js سريعة مع SSR وSSG وتحسين مؤشرات الأداء ومحركات البحث.",
    },
    icon: "gauge",
    published: true,
    order: 4,
  },
];
