"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const tooltipWidth = tooltipRef.current.offsetWidth;

      const spacing = 8;
      const windowHeight = window.innerHeight;

      const showAbove =
        triggerRect.bottom + tooltipHeight + spacing > windowHeight;

      const top = showAbove
        ? triggerRect.top - tooltipHeight - spacing
        : triggerRect.bottom + spacing;

      const left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;

      setPosition({ top, left });
    }
  }, [visible]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="inline-block"
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 50,
              pointerEvents: "none",
            }}
            className="bg-muted border-[1px] border-muted text-white  text-xs whitespace-nowrap px-2 py-1 rounded-sm shadow-sm opacity-0 transition-opacity duration-200 ease-in-out animate-fadeIn hidden md:block"
            onAnimationEnd={(e) => {
              (e.target as HTMLDivElement).style.opacity = "1";
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
