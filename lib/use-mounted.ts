import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** false during SSR and hydration, true afterwards, without a setState-in-effect pass. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
