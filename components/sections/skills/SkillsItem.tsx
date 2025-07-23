import { motion, easeOut } from "framer-motion";
import Image from "next/image";

interface SkillItemProps {
  title: string;
  imgSrc: string;
  define: string;
}

export default function SkillsItem({ title, imgSrc, define }: SkillItemProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };
  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      variants={itemVariants}
    >
      <Image alt={title} src={imgSrc} width={100} height={100} className="" />
      <h4 className="text-text font-bold text-base text-start">{title}</h4>
      <p className="p-2 capitalize text-muted font-bold rounded-sm [background:linear-gradient(#0B0B0B,#0B0B0B)padding-box,linear-gradient(to_bottom,#702123,#371114)border-box] dark:[background:linear-gradient(#0B0B0B,#0B0B0B)padding-box,linear-gradient(to_bottom,var(--color-primary-50),var(--color-primary-10))border-box] border-[1px] border-transparent">
        {define}
      </p>
    </motion.div>
  );
}
