"use client";

import { create } from "zustand";

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type ConfirmState = {
  open: boolean;
  options: ConfirmOptions | null;
  resolve: ((value: boolean) => void) | null;
  ask: (options: ConfirmOptions) => Promise<boolean>;
  settle: (value: boolean) => void;
};

/**
 * One app-wide confirm dialog (mounted once in <Providers>), driven from
 * anywhere with `await confirmDialog({...})` — a styled replacement for
 * window.confirm().
 */
export const useConfirmStore = create<ConfirmState>((set, get) => ({
  open: false,
  options: null,
  resolve: null,
  ask: (options) =>
    new Promise<boolean>((resolve) => {
      get().resolve?.(false); // a newer prompt cancels any pending one
      set({ open: true, options, resolve });
    }),
  settle: (value) => {
    get().resolve?.(value);
    // keep `options` so the text doesn't vanish during the close animation
    set({ open: false, resolve: null });
  },
}));

export const confirmDialog = (options: ConfirmOptions) => useConfirmStore.getState().ask(options);
