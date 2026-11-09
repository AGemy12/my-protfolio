"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Briefcase,
  ExternalLink,
  FolderKanban,
  Image as ImageIcon,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { dirOf } from "@/i18n/routing";
import { logout } from "@/lib/actions/auth";
import { LogoMark } from "@/components/logo";
import { LocaleSwitch, ThemeToggle } from "@/components/site/controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Hint } from "./ui";

const NAV = [
  { href: "/admin", key: "overview", icon: LayoutDashboard },
  { href: "/admin/profile", key: "profile", icon: User },
  { href: "/admin/projects", key: "projects", icon: FolderKanban },
  { href: "/admin/experience", key: "experience", icon: Briefcase },
  { href: "/admin/skills", key: "skills", icon: Wrench },
  { href: "/admin/services", key: "services", icon: Sparkles },
  { href: "/admin/messages", key: "messages", icon: Inbox },
  { href: "/admin/media", key: "media", icon: ImageIcon },
  { href: "/admin/account", key: "account", icon: KeyRound },
] as const;

function Brand({ label }: { label: string }) {
  return (
    <Link href="/admin" className="group flex min-w-0 items-center gap-2.5 font-semibold">
      <LogoMark className="text-foreground" />
      <span className="truncate text-[15px] tracking-tight">{label}</span>
    </Link>
  );
}

function SidebarNav({ unread, email, onNavigate }: { unread: number; email: string; onNavigate?: () => void }) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const router = useRouter();
  const [leaving, start] = useTransition();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <nav className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b px-5">
        <Brand label={t("brand")} />
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <ul className="space-y-1 p-3">
          {NAV.map(({ href, key, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors",
                    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    active
                      ? "bg-brand-soft text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {/* active marker on the inline-start edge (right in RTL, left in LTR) */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-2 start-0 w-[3px] rounded-e-full bg-brand transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <Icon
                    className={cn(
                      "size-[18px] shrink-0 transition-colors",
                      active ? "text-brand" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  <span className="flex-1 truncate text-start">{t(`nav.${key}`)}</span>
                  {key === "messages" && unread > 0 && (
                    <Badge variant="brand" className="h-5 min-w-5 justify-center rounded-full px-1.5 font-mono text-[10px]">
                      {unread > 99 ? "99+" : unread}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </ScrollArea>

      <div className="shrink-0 space-y-3 border-t p-3">
        {/* account card */}
        <div className="flex items-center gap-3 rounded-xl border bg-background/40 p-2.5">
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft font-semibold text-brand uppercase"
          >
            {email.charAt(0)}
          </span>
          <p className="min-w-0 flex-1 truncate text-start text-xs text-muted-foreground" dir="ltr" title={email}>
            {email}
          </p>
          <Hint label={t("nav.logout")}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={leaving}
              aria-label={t("nav.logout")}
              className="size-8 shrink-0 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() =>
                start(async () => {
                  await logout();
                  router.replace("/admin/login");
                  router.refresh();
                })
              }
            >
              <LogOut className="rtl:-scale-x-100" />
            </Button>
          </Hint>
        </div>

        {/* preferences */}
        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <ThemeToggle />
          <Hint label={t("nav.viewSite")}>
            <Button
              asChild
              variant="outline"
              size="icon"
              className="ms-auto rounded-full bg-card/60 hover:border-brand hover:text-brand"
            >
              <Link href="/" target="_blank" aria-label={t("nav.viewSite")}>
                <ExternalLink className="rtl:-scale-x-100" />
              </Link>
            </Button>
          </Hint>
        </div>
      </div>
    </nav>
  );
}

export function Sidebar({ unread, email }: { unread: number; email: string }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label={t("nav.overview")}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={dirOf(locale) === "rtl" ? "right" : "left"} className="w-72 max-w-[85vw] gap-0 bg-card p-0">
            <SheetTitle className="sr-only">{t("brand")}</SheetTitle>
            <SheetDescription className="sr-only">{t("nav.overview")}</SheetDescription>
            <SidebarNav unread={unread} email={email} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="font-semibold">{t("brand")}</span>
        <span className="w-9" />
      </header>

      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 border-e bg-card lg:block">
        <SidebarNav unread={unread} email={email} />
      </aside>
    </>
  );
}
