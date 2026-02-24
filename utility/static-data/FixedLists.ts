import { ElementType } from "react";
import { IoMoonOutline } from "react-icons/io5";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";

interface BtnTypes {
  id: number;
  title: string;
  handleClickEvent: () => void;
  Icon?: ElementType;
}

export const toggleModeBtns: BtnTypes[] = [
  {
    id: 1,
    title: "dark",
    Icon: IoMoonOutline,
    handleClickEvent: () => {},
  },
  {
    id: 2,
    title: "Light",
    Icon: IoMoonOutline,
    handleClickEvent: () => {},
  },
];

export const mySkillsList = [
  {
    id: 1,
    title: "JavaScript",
    imgSrc: "/assets/media/skills/js.png",
    define: "Programming Language",
  },
  {
    id: 2,
    title: "React.js",
    imgSrc: "/assets/media/skills/react.png",
    define: "JavaScript Library",
  },
  {
    id: 3,
    title: "Next.js",
    imgSrc: "/assets/media/skills/next.png",
    define: "React Framework",
  },
  {
    id: 4,
    title: "Vue.js",
    imgSrc: "/assets/media/skills/vue.png",
    define: "JavaScript Framework",
  },
  {
    id: 5,
    title: "Nuxt.js",
    imgSrc: "/assets/media/skills/nuxt.png",
    define: "Vue Framework",
  },
  {
    id: 6,
    title: "Redux",
    imgSrc: "/assets/media/skills/redux.png",
    define: "State Management",
  },
  {
    id: 7,
    title: "Pinia",
    imgSrc: "/assets/media/skills/pinia.png",
    define: "State Management",
  },
  {
    id: 8,
    title: "HTML",
    imgSrc: "/assets/media/skills/html.png",
    define: "Markup Language",
  },
  {
    id: 9,
    title: "CSS3",
    imgSrc: "/assets/media/skills/css3.png",
    define: "Styling Language",
  },
  {
    id: 10,
    title: "Bootstrap",
    imgSrc: "/assets/media/skills/bootstrap.png",
    define: "CSS Framework",
  },
  {
    id: 11,
    title: "Tailwind",
    imgSrc: "/assets/media/skills/tailwind.png",
    define: "CSS Framework",
  },
  {
    id: 12,
    title: "SASS",
    imgSrc: "/assets/media/skills/sass.png",
    define: "CSS Preprocessor ",
  },
];

export const projects = [
  {
    id: 0,
    title: "Alarabify Academy",
    description:
      "Alarabify Academy is a full-featured online learning platform with dedicated dashboards for Admins, Teachers, and Students. The system supports structured course management where each course contains levels, each level includes units, and each unit contains lessons with images and detailed explanations. The platform enables creating and managing live sessions between teachers and students with full Zoom integration — users are redirected directly to Zoom meetings from the session link. After session completion, payments are automatically calculated based on session duration (per minute) without payment gateways. The system also includes real-time notifications to enhance user interaction and live updates across the platform.",
    image: "/assets/media/projects/arabify.png",
    githubLink: "https://github.com/AGemy12/alarabify",
    link: "https://www.alarabify.com",
    techList: [
      { id: 1, title: "React.js" },
      { id: 2, title: "Next.js" },
      { id: 3, title: "TypeScript" },
      { id: 4, title: "Tailwind CSS" },
      { id: 5, title: "PHP Laravel" },
      { id: 6, title: "Zoom Integration" },
      { id: 7, title: "Real-time Notifications" },
      { id: 8, title: "Role-based Dashboard System" },
    ],
  },

  {
    id: 1,
    title: "Best Clean",
    description:
      "Best Clean is a full-stack Next.js cleaning services platform in Hafar Al Batin. It includes a powerful admin dashboard to manage users, services, categories, hero slider content, and the site logo — offering an easy booking and contact experience for customers.",
    image: "/assets/media/projects/best-clean.png",
    githubLink: "https://github.com/AGemy12/sho3a3",
    link: "https://www.best-cleanteam.com/",
    techList: [
      { id: 1, title: "React.js" },
      { id: 2, title: "Next.js" },
      { id: 3, title: "TypeScript" },
      { id: 4, title: "Tailwind CSS" },
      { id: 5, title: "Node.js" },
      { id: 6, title: "Dashboard (Admin Panel)" },
    ],
  },

  {
    id: 2,
    title: "Rowad4u",
    description:
      "Rowad4u is a digital services and design platform built with a full admin dashboard to manage dashboard users, services, categories, and hero slider content (image, description) — providing a smooth browsing and request experience for clients.",
    image: "/assets/media/projects/rowad.png",
    githubLink: "https://github.com/AGemy12/rowad",
    link: "https://www.rowad4u.com/",
    techList: [
      { id: 1, title: "React.js" },
      { id: 2, title: "Next.js" },
      { id: 3, title: "TypeScript" },
      { id: 4, title: "Tailwind CSS" },
      { id: 5, title: "Node.js" },
      { id: 6, title: "Admin Dashboard" },
    ],
  },

  {
    id: 3,
    title: "Diyarsco",
    description:
      "Diyarsco is a real estate showcase website built on Zoho Sites with extensive customizations across multiple sections — including a custom image slider/gallery to present projects and listed properties in a modern, interactive way.",
    image: "/assets/media/projects/diyarsco.png",
    link: "https://www.diyarsco.com/",
    techList: [
      { id: 1, title: "Zoho Sites" },
      { id: 2, title: "HTML" },
      { id: 3, title: "CSS" },
      { id: 4, title: "JavaScript" },
    ],
  },

  {
    id: 3,
    title: "2 Stars",
    description:
      "A tech agency website offering web design, development, and digital marketing services",
    image: "/assets/media/projects/stars.png",
    githubLink: "https://github.com/AGemy12/2-stars",
    link: "https://2-stars-seven.vercel.app/",
    techList: [
      { id: 1, title: "React.js" },
      { id: 2, title: "Next.js" },
      { id: 3, title: "Tailwind CSS" },
      { id: 4, title: "Swiper JS" },
    ],
  },

  {
    id: 4,
    title: "Code Master Technology Site (CMT)",
    description:
      "A tech services platform offering web design, development, and digital marketing solutions",
    image: "/assets/media/projects/cmt.png",
    githubLink: "https://github.com/AGemy12/cmt",
    link: "https://cmt-azure.vercel.app/",
    techList: [
      { id: 1, title: "React.js" },
      { id: 2, title: "Next.js" },
      { id: 3, title: "Node.js" },
      { id: 4, title: "Tailwind CSS" },
      { id: 5, title: "Swiper JS" },
    ],
  },
  {
    id: 5,
    title: "Jazan Map",
    description:
      "Discover Jazan through an interactive, detailed map—explore its governorates, Red Sea coastline, terrain, and strategic landmarks, all in one place.",
    image: "/assets/media/projects/jazan.png",
    githubLink: "https://github.com/AGemy12/jazan",
    techList: [
      { id: 1, title: "HTML" },
      { id: 2, title: "JavaScript" },
      { id: 3, title: "CSS" },
    ],
  },
];

export const contactsLinks = [
  {
    id: 1,
    title: "Facebook",
    link: "https://www.facebook.com/ahmad.g.marzouk/",
    icon: FaFacebookF,
  },
  {
    id: 2,
    title: "Linkedin",
    link: "https://www.linkedin.com/in/ahmad-marzouk-9430b1233/",
    icon: FaLinkedinIn,
  },
  {
    id: 3,
    title: "Whatsapp",
    link: "https://web.whatsapp.com/send?phone=01149560988&text=",
    icon: FaWhatsapp,
  },
  {
    id: 3,
    title: "Gmail",
    link: "mailto:aggamal98@gmail.com",
    icon: BiLogoGmail,
  },
];

export const links = [
  { id: 1, title: "hero", path: "#hero" },
  { id: 2, title: "skills", path: "#skills" },
  { id: 3, title: "about", path: "#about" },
  { id: 4, title: "projects", path: "#projects" },
  { id: 5, title: "contact", path: "#contact" },
];
