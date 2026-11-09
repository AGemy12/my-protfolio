import { Mail } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub, SiWhatsapp, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import type { Settings } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Socials({ settings, className }: { settings: Settings; className?: string }) {
  const links = [
    { href: settings.github, label: "GitHub", Icon: SiGithub },
    { href: settings.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
    { href: settings.x, label: "X", Icon: SiX },
    { href: settings.whatsapp, label: "WhatsApp", Icon: SiWhatsapp },
    { href: settings.email ? `mailto:${settings.email}` : "", label: "Email", Icon: Mail },
  ].filter((l) => l.href);

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <Button
            asChild
            variant="outline"
            size="icon-lg"
            className="rounded-full bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-brand hover:bg-card hover:text-brand dark:bg-card"
          >
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
            >
              <Icon />
            </a>
          </Button>
        </li>
      ))}
    </ul>
  );
}
