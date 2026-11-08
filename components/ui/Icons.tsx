type IconProps = { className?: string };

const base = "h-4 w-4 flex-none fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]";

function Svg({ className = "", children, box = 16 }: IconProps & { children: React.ReactNode; box?: number }) {
  return (
    <svg viewBox={`0 0 ${box} ${box}`} strokeWidth={1.6} aria-hidden="true" className={`${base} ${className}`}>
      {children}
    </svg>
  );
}

/** Arrows point "forward", so they mirror automatically in right-to-left pages. */
const flip = "rtl:-scale-x-100";

export const ArrowIcon = ({ className = "" }: IconProps) => (
  <Svg className={`${flip} ${className}`}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </Svg>
);

export const ExternalIcon = ({ className = "" }: IconProps) => (
  <Svg className={`${flip} ${className}`}>
    <path d="M5 11l6-6M6 5h5v5" />
  </Svg>
);

export const DownloadIcon = ({ className = "" }: IconProps) => (
  <Svg className={className}>
    <path d="M8 3v8M4.5 7.5L8 11l3.5-3.5M3 13.5h10" />
  </Svg>
);

export const SunIcon = ({ className = "" }: IconProps) => (
  <Svg className={className}>
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
  </Svg>
);

export const MoonIcon = ({ className = "" }: IconProps) => (
  <Svg className={className}>
    <path d="M13.5 9.6A5.6 5.6 0 0 1 6.4 2.5a5.6 5.6 0 1 0 7.1 7.1z" />
  </Svg>
);

export const MenuIcon = ({ className = "" }: IconProps) => (
  <Svg className={className}>
    <path d="M2.5 5h11M2.5 11h11" />
  </Svg>
);

export const CloseIcon = ({ className = "" }: IconProps) => (
  <Svg className={className}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Svg>
);

export const CheckIcon = ({ className = "" }: IconProps) => (
  <Svg className={className}>
    <path d="M3 8.5l3.2 3L13 4.5" />
  </Svg>
);

export const CopyIcon = ({ className = "" }: IconProps) => (
  <Svg className={className}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="2" />
    <path d="M10.5 5.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
  </Svg>
);

export const AppIcon = ({ className = "" }: IconProps) => (
  <Svg box={20} className={className}>
    <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" />
    <path d="M2.5 7.5h15M5.5 5.5h.01M7.5 5.5h.01" />
  </Svg>
);

export const DatabaseIcon = ({ className = "" }: IconProps) => (
  <Svg box={20} className={className}>
    <ellipse cx="10" cy="5" rx="6.5" ry="2.5" />
    <path d="M3.5 5v10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V5M3.5 10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" />
  </Svg>
);

export const DashboardIcon = ({ className = "" }: IconProps) => (
  <Svg box={20} className={className}>
    <rect x="2.5" y="2.5" width="6.5" height="8" rx="1.5" />
    <rect x="11" y="2.5" width="6.5" height="5" rx="1.5" />
    <rect x="11" y="9.5" width="6.5" height="8" rx="1.5" />
    <rect x="2.5" y="12.5" width="6.5" height="5" rx="1.5" />
  </Svg>
);

export const GlobeIcon = ({ className = "" }: IconProps) => (
  <Svg box={20} className={className}>
    <circle cx="10" cy="10" r="7.5" />
    <path d="M2.5 10h15M10 2.5c2.2 2.3 3.2 4.8 3.2 7.5s-1 5.2-3.2 7.5c-2.2-2.3-3.2-4.8-3.2-7.5s1-5.2 3.2-7.5z" />
  </Svg>
);
