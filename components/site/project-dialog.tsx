"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { XIcon } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";
import { ProjectDetails } from "./project-details";

export const projectPath = (slug: string) => `/projects/${slug}`;

/**
 * A real link to the project's page (`/projects/<slug>`) that, on a plain click,
 * opens the details in a dialog instead and puts that same URL in the address bar.
 * Refreshing or sharing then lands on the full page, Back closes the dialog, and
 * Ctrl/Cmd/middle-click still open the page in a new tab. `children` is the link text.
 */
export function ProjectDialog({
  project: p,
  className,
  children,
}: {
  project: Project;
  className?: string;
  children: ReactNode;
}) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const pathname = usePathname();
  const href = projectPath(p.slug);
  const open = pathname === href;
  // Where we were before opening, if this dialog added the history entry itself.
  const returnTo = useRef<string | null>(null);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    returnTo.current = window.location.pathname + window.location.search;
    window.history.pushState(null, "", `/${locale}${href}`);
  };

  const onOpenChange = (next: boolean) => {
    if (next || !open) return;
    if (returnTo.current) {
      returnTo.current = null;
      window.history.back();
    } else {
      // Opened from an old `/projects#slug` link: there is no entry of ours to go back to.
      window.history.replaceState(null, "", `/${locale}/projects`);
    }
  };

  return (
    <>
      <Link href={href} onClick={onClick} className={className} scroll={false}>
        {children}
      </Link>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[92dvh] gap-0 overflow-hidden overflow-y-auto overscroll-contain rounded-2xl p-0 sm:max-w-4xl"
        >
          <ProjectDetails
            project={p}
            variant="dialog"
            coverAction={
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label={t("close")}
                  className="absolute end-4 top-4 rounded-full bg-background/80 shadow-sm backdrop-blur hover:bg-background"
                >
                  <XIcon />
                </Button>
              </DialogClose>
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
