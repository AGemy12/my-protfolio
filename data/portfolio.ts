export const profile = {
  name: "Ahmad Marzouk",
  role: "Full Stack Developer",
  location: "Beni Suef, Egypt",
  email: "aggamal98@gmail.com",
  phone: "+20 114 956 0988",
  whatsapp: "https://wa.me/201149560988",
  github: "https://github.com/AGemy12",
  linkedin: "https://www.linkedin.com/in/ahmad-marzouk-9430b1233/",
  cv: "/assets/media/cv/cv.pdf",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const heroFacts = [
  { value: "3+ years", label: "building production web apps" },
  { value: "10+ projects", label: "platforms and websites delivered" },
  { value: "End to end", label: "from requirements to deployment" },
];

export const aboutDetails = [
  { term: "Location", value: "Beni Suef, Egypt" },
  { term: "Education", value: "B.Eng, Al-Azhar University" },
  { term: "Languages", value: "Arabic, English" },
];

export const services = [
  {
    title: "Web applications",
    description:
      "Complete products with accounts, user roles and dashboards, built to grow with your business.",
  },
  {
    title: "Backend and APIs",
    description:
      "Secure, well-structured APIs and databases using NestJS, PostgreSQL and MongoDB.",
  },
  {
    title: "Admin dashboards",
    description:
      "Simple control panels so your team can manage content, users and data without help.",
  },
  {
    title: "Websites and SEO",
    description:
      "Fast, responsive company websites that are easy to find on search engines.",
  },
];

export type Project = {
  title: string;
  description: string;
  image: string;
  link: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    title: "Alarabify Academy",
    description:
      "Online learning platform with dashboards for admins, teachers and students, and live sessions.",
    image: "/assets/media/projects/arabify.png",
    link: "https://www.alarabify.com",
    stack: ["Next.js", "TypeScript", "Laravel API"],
  },
  {
    title: "Best Clean",
    description:
      "Cleaning services platform with online booking and an admin panel for services and content.",
    image: "/assets/media/projects/best-clean.png",
    link: "https://www.best-cleanteam.com/",
    stack: ["Next.js", "Node.js", "Admin panel"],
  },
  {
    title: "Itqan Academy",
    description:
      "A search-friendly website for an online Quran and Arabic academy.",
    image: "/assets/media/projects/itqan.png",
    link: "https://www.itqanforquran.com/ar",
    stack: ["Next.js", "TypeScript", "SEO"],
  },
  {
    title: "Rowad4u",
    description:
      "Digital services platform with a full dashboard for services, categories and users.",
    image: "/assets/media/projects/rowad.png",
    link: "https://www.rowad4u.com/",
    stack: ["Next.js", "Node.js", "Dashboard"],
  },
  {
    title: "CMT Digital",
    description:
      "Corporate website for a technology services company, from layout to deployment.",
    image: "/assets/media/projects/cmt.png",
    link: "https://cmt-azure.vercel.app/",
    stack: ["Next.js", "Tailwind CSS"],
  },
  {
    title: "2 Stars",
    description:
      "Agency website for web design, development and digital marketing services.",
    image: "/assets/media/projects/stars.png",
    link: "https://2-stars-seven.vercel.app/",
    stack: ["Next.js", "Tailwind CSS"],
  },
];

export const privateWork =
  "a property management platform and the Nemmra platform at DeyarTech.";

export type Role = {
  period: string;
  title: string;
  org: string;
  points?: string[];
  projects?: string;
};

export const experience: Role[] = [
  {
    period: "2022 – Present",
    title: "Full Stack Developer",
    org: "DeyarTech · Remote",
    points: [
      "Build and maintain company products end to end, from data models and APIs to the apps on top.",
      "Work with design and business teams to turn requirements into shipped features.",
    ],
    projects: "Property management platform, Nemmra, CMT Digital, Diyarsco",
  },
  {
    period: "2021 – Present",
    title: "Freelance Full Stack Developer",
    org: "Self-employed · Remote",
    points: [
      "Deliver complete web solutions for clients, including databases, APIs and interfaces.",
      "Manage projects from the first requirements through launch and ongoing support.",
    ],
    projects: "Alarabify, Itqan for Quran, Best Clean, Rowad4u",
  },
  {
    period: "2022",
    title: "B.Eng, Mechanical Power Engineering",
    org: "Al-Azhar University",
  },
];

export const skills = [
  {
    group: "Frontend",
    items: ["Next.js", "React", "Vue.js and Nuxt.js", "Tailwind CSS", "SASS"],
  },
  {
    group: "Backend",
    items: [
      "NestJS",
      "Node.js",
      "TypeScript",
      "REST APIs",
      "Authentication and roles",
    ],
  },
  {
    group: "Databases",
    items: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Mongoose"],
  },
  {
    group: "Workflow",
    items: ["Docker", "Git and GitHub", "Postman", "Vercel", "Claude and Codex"],
  },
];
