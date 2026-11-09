"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider, useTheme } from "next-themes";
import { Direction } from "radix-ui";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/confirm-dialog";

function ThemedToaster({ dir }: { dir: "ltr" | "rtl" }) {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      dir={dir}
      position={dir === "rtl" ? "bottom-left" : "bottom-right"}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      richColors
      closeButton
    />
  );
}

export function Providers({
  children,
  dir,
}: {
  children: React.ReactNode;
  dir: "ltr" | "rtl";
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Radix primitives (ScrollArea, Tabs, menus…) default to LTR without this */}
      <Direction.Provider dir={dir}>
        <TooltipProvider delayDuration={300}>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
          <ConfirmDialog />
          <ThemedToaster dir={dir} />
        </TooltipProvider>
      </Direction.Provider>
    </ThemeProvider>
  );
}
