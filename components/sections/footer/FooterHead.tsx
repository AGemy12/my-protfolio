import React from "react";

export default function FooterHead({
  title,
  customStyle,
}: {
  title: string;
  customStyle?: string;
}) {
  return (
    <h6
      className={`w-fit mx-auto text-text text-xl font-bold capitalize mb-4 relative before:absolute before:bottom-0 before:left-0 before:w-1/2 before:h-1 pb-2 before:bg-primary before:shadow-light-shadow before:duration-300 group-hover:before:bg-primary-50 after:absolute after:bottom-0 after:right-0 after:w-1/2 after:h-1 after:bg-primary-50 after:shadow-light-shadow after:duration-300 group-hover:after:bg-primary ${customStyle}`}
    >
      {title}
    </h6>
  );
}
