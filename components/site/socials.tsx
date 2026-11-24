import { Mail } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { SocialIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { socialName } from "@/lib/socials";
import type { Settings } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Socials({ settings, className }: { settings: Settings; className?: string }) {
  const links = [
    // the dashboard's list, in its order
    ...settings.socials.map((l) => ({
      key: `${l.platform}-${l.url}`,
      href: l.url,
      label: socialName(l),
      icon: <SocialIcon platform={l.platform} />,
    })),
    // then the contact details from the profile
    { key: "whatsapp", href: settings.whatsapp, label: "WhatsApp", icon: <SiWhatsapp /> },
    { key: "email", href: settings.email ? `mailto:${settings.email}` : "", label: "Email", icon: <Mail /> },
  ].filter((l) => l.href);

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map(({ key, href, label, icon }) => (
        <li key={key}>
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
              {icon}
            </a>
          </Button>
        </li>
      ))}
    </ul>
  );
}
