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
    imgSrc: "/assets/media/skills/javaScript.png",
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
    id: 1,
    title: "Nemmra",
    description:
      "Nemmra is a leading platform that connects you with hundreds of companies and service providers with just one click — send WhatsApp messages (text, images, documents) and advertise your offers",
    image: "/assets/media/projects/nemmra.png",
    githubLink: "https://github.com/AGemy12/nemmra",
    link: "https://www.nemmra.com/ar",
    techList: [
      { id: 1, title: "Vue.js" },
      { id: 2, title: "Nuxt.js" },
      { id: 3, title: "Sass" },
      { id: 4, title: "Node.js" },
      { id: 5, title: "PHP Laravel" },
    ],
  },
  {
    id: 2,
    title: "Anaqatty",
    description:
      "Anaqatyy is a modern lifestyle platform empowering Arab women with tips on fashion, wellness, beauty, and self-growth — all in one place.",
    image: "/assets/media/projects/anaqatyy.png",
    githubLink: "https://github.com/AGemy12/anaqaty-site",
    link: "https://www.anaqatyy.com/",
    techList: [
      { id: 1, title: "Vue.js" },
      { id: 2, title: "Nuxt.js" },
      { id: 3, title: "Vuetify" },
      { id: 4, title: "Sass" },
      { id: 5, title: "Node.js" },
      { id: 6, title: "PHP Laravel" },
    ],
  },
  {
    id: 3,
    title: "Code Master Technology Site (CMT)",
    description:
      "A tech services platform offering web design, development, and digital marketing solutions",
    image: "/assets/media/projects/cmt.png",
    githubLink: "https://github.com/AGemy12/code-master-technology",
    link: "https://cmt-saudi.com/",
    techList: [
      { id: 1, title: "React.js" },
      { id: 2, title: "Next.js" },
      { id: 3, title: "Node.js" },
      { id: 4, title: "Tailwind CSS" },
      { id: 5, title: "Swiper JS" },
    ],
  },
  {
    id: 4,
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
    id: 5,
    title: "Jazan Map",
    description:
      "Discover Jazan through an interactive, detailed map—explore its governorates, Red Sea coastline, terrain, and strategic landmarks, all in one place.",
    image: "/assets/media/projects/jazan.png",
    githubLink: "https://github.com/AGemy12/jazan",
    link: "https://torathmasr.com/MapofJazan/",
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
